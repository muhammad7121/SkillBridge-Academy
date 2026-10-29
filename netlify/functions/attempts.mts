import type { Config, Context } from '@netlify/functions';
import { and, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { examAttempts } from '../../db/schema.js';
import {
  EXAM_ID,
  SUBMIT_GRACE_SECONDS,
  errorResponse,
  findRegisteredStudent,
  gradeAnswers,
  isPastDeadline,
  json,
  newAttemptValues,
  readJson,
  sanitizeAnswers,
  sanitizeFlags,
  secondsSinceStart,
  toClientAttempt,
} from '../lib/exam.js';

/**
 * Candidate-facing attempt API.
 *
 *   GET  /api/attempts?studentId=…        current attempt for a candidate (or null)
 *   POST /api/attempts                    start (or resume) the candidate's attempt
 *   PUT  /api/attempts/:id/progress       autosave answers + flags while in progress
 *   POST /api/attempts/:id/submit         final submission, graded on the server
 *
 * Every write requires the attempt ID issued by the server together with the
 * matching registered student ID, so a candidate can only write their own attempt.
 */
export default async (req: Request, context: Context) => {
  const { id, action } = context.params ?? {};
  try {
    if (!id && req.method === 'GET') return await getCurrent(req);
    if (!id && req.method === 'POST') return await startAttempt(req);
    if (id && action === 'progress' && req.method === 'PUT') return await saveProgress(req, id);
    if (id && action === 'submit' && req.method === 'POST') return await submitAttempt(req, id);
    return errorResponse(405, 'method_not_allowed', 'Method not allowed.');
  } catch (err) {
    console.error('[attempts] Unhandled database error', {
      method: req.method,
      attemptId: id,
      action,
      error: err instanceof Error ? err.message : String(err),
    });
    return errorResponse(500, 'server_error', 'The exam server could not process this request. Please try again.');
  }
};

async function findAttemptForStudent(studentId: string) {
  const [row] = await db
    .select()
    .from(examAttempts)
    .where(and(eq(examAttempts.studentId, studentId), eq(examAttempts.examId, EXAM_ID)))
    .limit(1);
  return row ?? null;
}

async function loadOwnedAttempt(attemptId: string, studentId: unknown) {
  const student = findRegisteredStudent(studentId);
  if (!student) {
    return { error: errorResponse(403, 'unknown_student', 'Candidate is not on the registered roster.') };
  }
  const [row] = await db.select().from(examAttempts).where(eq(examAttempts.id, attemptId)).limit(1);
  if (!row) {
    return {
      error: errorResponse(
        404,
        'attempt_not_found',
        'This exam attempt no longer exists. It may have been reset by the instructor.'
      ),
    };
  }
  if (row.studentId !== student.id) {
    console.warn('[attempts] Rejected write to attempt owned by another candidate', {
      attemptId,
      studentId: student.id,
    });
    return { error: errorResponse(403, 'forbidden', 'This attempt does not belong to the signed-in candidate.') };
  }
  return { row };
}

async function getCurrent(req: Request) {
  const studentId = new URL(req.url).searchParams.get('studentId');
  const student = findRegisteredStudent(studentId);
  if (!student) return errorResponse(403, 'unknown_student', 'Candidate is not on the registered roster.');
  const row = await findAttemptForStudent(student.id);
  return json({ attempt: row ? toClientAttempt(row) : null });
}

async function startAttempt(req: Request) {
  const body = await readJson(req);
  const student = findRegisteredStudent(body?.studentId);
  if (!student) return errorResponse(403, 'unknown_student', 'Candidate is not on the registered roster.');

  // ON CONFLICT DO NOTHING + re-select makes this safe against double clicks and
  // concurrent tabs: the unique (student_id, exam_id) index allows one attempt only.
  await db.insert(examAttempts).values(newAttemptValues(student)).onConflictDoNothing();
  const row = await findAttemptForStudent(student.id);
  if (!row) throw new Error('Attempt missing after insert');
  return json({ attempt: toClientAttempt(row) });
}

async function saveProgress(req: Request, attemptId: string) {
  const body = await readJson(req);
  if (!body) return errorResponse(400, 'invalid_body', 'Request body must be JSON.');
  const { row, error } = await loadOwnedAttempt(attemptId, body.studentId);
  if (error) return error;
  if (row.status === 'submitted') {
    return errorResponse(409, 'already_submitted', 'This assessment has already been submitted.');
  }
  if (isPastDeadline(row, SUBMIT_GRACE_SECONDS)) {
    return errorResponse(409, 'time_expired', 'The exam time has expired.');
  }

  await db
    .update(examAttempts)
    .set({
      answers: sanitizeAnswers(body.answers, row.questionIds),
      flaggedQuestionIds: sanitizeFlags(body.flaggedQuestionIds, row.questionIds),
      updatedAt: new Date(),
    })
    .where(and(eq(examAttempts.id, row.id), eq(examAttempts.status, 'in_progress')));
  return json({ ok: true });
}

async function submitAttempt(req: Request, attemptId: string) {
  const body = await readJson(req);
  if (!body) return errorResponse(400, 'invalid_body', 'Request body must be JSON.');
  const { row, error } = await loadOwnedAttempt(attemptId, body.studentId);
  if (error) return error;

  // Idempotent: a repeated submit (double click, retry after a dropped
  // response, page refresh) returns the stored result instead of a new one.
  if (row.status === 'submitted') {
    return json({ attempt: toClientAttempt(row), alreadySubmitted: true });
  }

  const now = new Date();
  // Past the deadline + grace window, only answers autosaved in time count.
  const answers = isPastDeadline(row, SUBMIT_GRACE_SECONDS, now)
    ? row.answers
    : sanitizeAnswers(body.answers, row.questionIds);
  const flags = sanitizeFlags(body.flaggedQuestionIds, row.questionIds);
  const result = gradeAnswers(row.questionIds, answers);

  const [saved] = await db
    .update(examAttempts)
    .set({
      answers,
      flaggedQuestionIds: flags,
      status: 'submitted',
      score: result.score,
      totalMarks: result.totalMarks,
      percentage: result.percentage,
      passed: result.passed,
      submittedAt: now,
      timeSpentSeconds: Math.max(0, Math.min(row.durationSeconds, secondsSinceStart(row, now))),
      updatedAt: now,
    })
    .where(and(eq(examAttempts.id, row.id), eq(examAttempts.status, 'in_progress')))
    .returning();

  if (!saved) {
    // A concurrent request submitted first; return that stored result.
    const [existing] = await db.select().from(examAttempts).where(eq(examAttempts.id, row.id)).limit(1);
    if (existing?.status === 'submitted') {
      return json({ attempt: toClientAttempt(existing), alreadySubmitted: true });
    }
    throw new Error('Submission update affected no rows');
  }

  console.log('[attempts] Exam submitted', {
    attemptId: saved.id,
    studentId: saved.studentId,
    score: saved.score,
    totalMarks: saved.totalMarks,
  });
  return json({ attempt: toClientAttempt(saved), alreadySubmitted: false });
}

export const config: Config = {
  path: ['/api/attempts', '/api/attempts/:id/:action'],
};

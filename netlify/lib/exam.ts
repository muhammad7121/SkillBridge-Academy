import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { QUESTION_BANK } from '../../src/data/questionsBank.js';
import { REGISTERED_STUDENTS } from '../../src/data/students.js';
import { EXAM_DURATION_SECONDS, EXAM_ID, EXAM_TITLE, PASS_MARK_PERCENT } from '../../src/data/examConfig.js';
import { generateBalancedExamQuestions } from '../../src/utils/examEngine.js';
import type { ExamAttempt, ExamQuestion, Student } from '../../src/types/exam.js';
import type { examAttempts } from '../../db/schema.js';

type AttemptRow = typeof examAttempts.$inferSelect;
type Option = 'A' | 'B' | 'C' | 'D';

/** Late submissions within this window still accept the answers sent with the submit request. */
export const SUBMIT_GRACE_SECONDS = 120;

const QUESTIONS_BY_ID = new Map<string, ExamQuestion>(QUESTION_BANK.map((q) => [q.id, q]));
const VALID_OPTIONS = new Set(['A', 'B', 'C', 'D']);

export { EXAM_ID, EXAM_TITLE, EXAM_DURATION_SECONDS };

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function errorResponse(status: number, code: string, message: string): Response {
  return json({ error: message, code }, status);
}

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Resolves a candidate from the official roster. Names/emails always come from the roster, not the client. */
export function findRegisteredStudent(studentId: unknown): Student | null {
  if (typeof studentId !== 'string') return null;
  return REGISTERED_STUDENTS.find((s) => s.id === studentId) ?? null;
}

export function newAttemptValues(student: Student) {
  const questionIds = generateBalancedExamQuestions().map((q) => q.id);
  return {
    id: randomUUID(),
    studentId: student.id,
    studentName: student.name,
    studentEmail: student.email,
    examId: EXAM_ID,
    examTitle: EXAM_TITLE,
    questionIds,
    totalMarks: questionIds.length,
    durationSeconds: EXAM_DURATION_SECONDS,
  };
}

/** Keeps only answers to questions in this attempt with a valid option letter. */
export function sanitizeAnswers(raw: unknown, questionIds: string[]): Record<string, Option> {
  const clean: Record<string, Option> = {};
  if (!raw || typeof raw !== 'object') return clean;
  const allowed = new Set(questionIds);
  for (const [qid, value] of Object.entries(raw as Record<string, unknown>)) {
    if (allowed.has(qid) && typeof value === 'string' && VALID_OPTIONS.has(value)) {
      clean[qid] = value as Option;
    }
  }
  return clean;
}

export function sanitizeFlags(raw: unknown, questionIds: string[]): string[] {
  if (!Array.isArray(raw)) return [];
  const allowed = new Set(questionIds);
  return [...new Set(raw.filter((id): id is string => typeof id === 'string' && allowed.has(id)))];
}

export function secondsSinceStart(row: AttemptRow, now = new Date()): number {
  return Math.round((now.getTime() - new Date(row.startedAt).getTime()) / 1000);
}

export function isPastDeadline(row: AttemptRow, graceSeconds: number, now = new Date()): boolean {
  return secondsSinceStart(row, now) > row.durationSeconds + graceSeconds;
}

/** Trusted grading against the server-side question bank. */
export function gradeAnswers(questionIds: string[], answers: Record<string, Option>) {
  let score = 0;
  for (const qid of questionIds) {
    const q = QUESTIONS_BY_ID.get(qid);
    if (q && answers[qid] === q.correct) score += 1;
  }
  const totalMarks = questionIds.length;
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  return { score, totalMarks, percentage, passed: percentage >= PASS_MARK_PERCENT };
}

/** Converts a DB row to the ExamAttempt shape the UI already understands. */
export function toClientAttempt(row: AttemptRow, { includeQuestions = true } = {}): ExamAttempt {
  const questions = includeQuestions
    ? row.questionIds.map((id) => QUESTIONS_BY_ID.get(id)).filter((q): q is ExamQuestion => Boolean(q))
    : [];
  return {
    id: row.id,
    studentId: row.studentId,
    studentName: row.studentName,
    studentEmail: row.studentEmail,
    examId: row.examId,
    examTitle: row.examTitle,
    startTime: new Date(row.startedAt).getTime(),
    durationSeconds: row.durationSeconds,
    questions,
    answers: row.answers ?? {},
    flaggedQuestionIds: row.flaggedQuestionIds ?? [],
    submitted: row.status === 'submitted',
    score: row.score ?? undefined,
    totalQuestions: row.totalMarks,
    percentage: row.percentage ?? undefined,
    passed: row.passed ?? undefined,
    submittedAt: row.submittedAt ? new Date(row.submittedAt).toISOString() : undefined,
    timeSpentSeconds: row.timeSpentSeconds ?? undefined,
    serverSaved: true,
  };
}

// ---------------------------------------------------------------------------
// Instructor sessions: the password is verified on the server and exchanged
// for a short-lived signed token, so results are never readable without it.
// ---------------------------------------------------------------------------

// Fallback preserves the password the console already used. Set the
// INSTRUCTOR_PASSWORD environment variable in Netlify to override it.
const LEGACY_INSTRUCTOR_PASSWORD = '3ha@123456789';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function instructorPassword(): string {
  return process.env.INSTRUCTOR_PASSWORD || LEGACY_INSTRUCTOR_PASSWORD;
}

function signingKey(): Buffer {
  return createHash('sha256').update(`skillbridge-instructor-session:${instructorPassword()}`).digest();
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkInstructorPassword(candidate: unknown): boolean {
  if (typeof candidate !== 'string') return false;
  const digest = (s: string) => createHash('sha256').update(s).digest('hex');
  return safeEqual(digest(candidate), digest(instructorPassword()));
}

export function issueInstructorToken(): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `instructor.${expiresAt}`;
  const sig = createHmac('sha256', signingKey()).update(payload).digest('base64url');
  return { token: `${payload}.${sig}`, expiresAt };
}

export function verifyInstructorRequest(req: Request): boolean {
  const header = req.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'instructor') return false;
  const expiresAt = Number(parts[1]);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const expected = createHmac('sha256', signingKey()).update(`${parts[0]}.${parts[1]}`).digest('base64url');
  return safeEqual(parts[2], expected);
}

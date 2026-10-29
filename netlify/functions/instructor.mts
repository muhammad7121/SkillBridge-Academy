import type { Config, Context } from '@netlify/functions';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { examAttempts } from '../../db/schema.js';
import {
  EXAM_ID,
  checkInstructorPassword,
  errorResponse,
  issueInstructorToken,
  json,
  readJson,
  toClientAttempt,
  verifyInstructorRequest,
} from '../lib/exam.js';

/**
 * Instructor API. Reads from the same exam_attempts table the candidate API writes to.
 *
 *   POST   /api/instructor/login                 exchange password for a session token
 *   GET    /api/instructor/results               all attempts for the exam (token required)
 *   DELETE /api/instructor/results/:studentId    reset a candidate's attempt (token required)
 */
export default async (req: Request, context: Context) => {
  const { action, studentId } = context.params ?? {};
  try {
    if (action === 'login' && req.method === 'POST') {
      const body = await readJson(req);
      if (!checkInstructorPassword(body?.password)) {
        console.warn('[instructor] Failed login attempt');
        return errorResponse(401, 'invalid_password', 'Invalid instructor password.');
      }
      return json(issueInstructorToken());
    }

    if (action !== 'results') return errorResponse(404, 'not_found', 'Not found.');

    if (!verifyInstructorRequest(req)) {
      return errorResponse(401, 'unauthorized', 'Instructor session expired or invalid. Please sign in again.');
    }

    if (!studentId && req.method === 'GET') {
      const rows = await db
        .select()
        .from(examAttempts)
        .where(eq(examAttempts.examId, EXAM_ID))
        .orderBy(asc(examAttempts.startedAt));
      return json({
        attempts: rows.map((r) => toClientAttempt(r, { includeQuestions: false })),
        fetchedAt: new Date().toISOString(),
      });
    }

    if (studentId && req.method === 'DELETE') {
      await db
        .delete(examAttempts)
        .where(and(eq(examAttempts.studentId, studentId), eq(examAttempts.examId, EXAM_ID)));
      console.log('[instructor] Attempt reset', { studentId });
      return json({ ok: true });
    }

    return errorResponse(405, 'method_not_allowed', 'Method not allowed.');
  } catch (err) {
    console.error('[instructor] Unhandled database error', {
      method: req.method,
      action,
      studentId,
      error: err instanceof Error ? err.message : String(err),
    });
    return errorResponse(500, 'server_error', 'Could not load results from the database. Please try again.');
  }
};

export const config: Config = {
  path: ['/api/instructor/:action', '/api/instructor/:action/:studentId'],
};

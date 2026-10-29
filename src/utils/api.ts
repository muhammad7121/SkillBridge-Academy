import { ExamAttempt } from '../types/exam';

export type ApiErrorKind = 'network' | 'permission' | 'not_found' | 'conflict' | 'server';

/**
 * Error raised for any failed call to the exam API, classified so the UI can
 * show a meaningful message (network drop vs. permission vs. server failure).
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public kind: ApiErrorKind,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const INSTRUCTOR_TOKEN_KEY = 'skillbridge_instructor_session_v1';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    });
  } catch (err) {
    console.error(`[api] Network failure calling ${path}:`, err);
    throw new ApiError(
      'Unable to reach the exam server. Check your internet connection and try again.',
      'network',
      0
    );
  }

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response (e.g. gateway error page)
  }

  if (!res.ok) {
    const kind: ApiErrorKind =
      res.status === 401 || res.status === 403
        ? 'permission'
        : res.status === 404
          ? 'not_found'
          : res.status === 409
            ? 'conflict'
            : 'server';
    const message = body?.error || `The exam server returned an error (HTTP ${res.status}).`;
    console.error(`[api] ${init.method || 'GET'} ${path} failed (${res.status}):`, body?.code, message);
    throw new ApiError(message, kind, res.status, body?.code);
  }

  return body as T;
}

// ---------------------------------------------------------------------------
// Candidate endpoints
// ---------------------------------------------------------------------------

export async function fetchStudentAttempt(studentId: string): Promise<ExamAttempt | null> {
  const { attempt } = await request<{ attempt: ExamAttempt | null }>(
    `/api/attempts?studentId=${encodeURIComponent(studentId)}`
  );
  return attempt;
}

export async function startAttempt(studentId: string): Promise<ExamAttempt> {
  const { attempt } = await request<{ attempt: ExamAttempt }>('/api/attempts', {
    method: 'POST',
    body: JSON.stringify({ studentId }),
  });
  return attempt;
}

export async function saveAttemptProgress(attempt: ExamAttempt): Promise<void> {
  await request(`/api/attempts/${encodeURIComponent(attempt.id)}/progress`, {
    method: 'PUT',
    body: JSON.stringify({
      studentId: attempt.studentId,
      answers: attempt.answers,
      flaggedQuestionIds: attempt.flaggedQuestionIds,
    }),
  });
}

export async function submitAttempt(attempt: ExamAttempt): Promise<ExamAttempt> {
  const { attempt: saved } = await request<{ attempt: ExamAttempt }>(
    `/api/attempts/${encodeURIComponent(attempt.id)}/submit`,
    {
      method: 'POST',
      body: JSON.stringify({
        studentId: attempt.studentId,
        answers: attempt.answers,
        flaggedQuestionIds: attempt.flaggedQuestionIds,
      }),
    }
  );
  return saved;
}

// ---------------------------------------------------------------------------
// Instructor endpoints
// ---------------------------------------------------------------------------

export function getInstructorToken(): string | null {
  try {
    const raw = sessionStorage.getItem(INSTRUCTOR_TOKEN_KEY);
    if (!raw) return null;
    const { token, expiresAt } = JSON.parse(raw);
    return typeof token === 'string' && expiresAt > Date.now() ? token : null;
  } catch {
    return null;
  }
}

export function clearInstructorToken(): void {
  sessionStorage.removeItem(INSTRUCTOR_TOKEN_KEY);
}

export async function instructorLogin(password: string): Promise<void> {
  const session = await request<{ token: string; expiresAt: number }>('/api/instructor/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  sessionStorage.setItem(INSTRUCTOR_TOKEN_KEY, JSON.stringify(session));
}

function instructorHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${getInstructorToken() ?? ''}` };
}

export async function fetchInstructorResults(): Promise<Record<string, ExamAttempt>> {
  const { attempts } = await request<{ attempts: ExamAttempt[] }>('/api/instructor/results', {
    headers: instructorHeaders(),
  });
  const byStudent: Record<string, ExamAttempt> = {};
  attempts.forEach((a) => {
    byStudent[a.studentId] = a;
  });
  return byStudent;
}

export async function resetAttemptOnServer(studentId: string): Promise<void> {
  await request(`/api/instructor/results/${encodeURIComponent(studentId)}`, {
    method: 'DELETE',
    headers: instructorHeaders(),
  });
}

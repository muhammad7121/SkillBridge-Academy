import { ExamAttempt, ExamQuestion, Student } from '../types/exam';
// Attempts are created and graded by the server (netlify/functions/attempts.mts).
// localStorage here only caches the candidate's in-browser copy for resilience.
import { QUESTION_BANK } from '../data/questionsBank';
import { REGISTERED_STUDENTS } from '../data/students';

const STORAGE_KEY_ATTEMPTS = 'skillbridge_exam_attempts_v1';
const STORAGE_KEY_CURRENT_STUDENT = 'skillbridge_active_student_v1';

/**
 * Fisher-Yates array shuffle helper
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a balanced 40-question exam set:
 * - 10 from Week 1
 * - 10 from Week 2
 * - 10 from Week 3
 * - 10 from Week 4
 * Shuffled in order for each attempt.
 */
export function generateBalancedExamQuestions(): ExamQuestion[] {
  const week1 = QUESTION_BANK.filter((q) => q.week === 1);
  const week2 = QUESTION_BANK.filter((q) => q.week === 2);
  const week3 = QUESTION_BANK.filter((q) => q.week === 3);
  const week4 = QUESTION_BANK.filter((q) => q.week === 4);

  const selected: ExamQuestion[] = [
    ...shuffleArray(week1).slice(0, 10),
    ...shuffleArray(week2).slice(0, 10),
    ...shuffleArray(week3).slice(0, 10),
    ...shuffleArray(week4).slice(0, 10),
  ];

  return shuffleArray(selected);
}

/**
 * Gets all attempts from localStorage.
 */
export function getAllAttempts(): Record<string, ExamAttempt> {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    if (!data) return {};
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading attempts from localStorage:', err);
    return {};
  }
}

/**
 * Saves all attempts to localStorage.
 */
export function saveAllAttempts(attempts: Record<string, ExamAttempt>): void {
  try {
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(attempts));
  } catch (err) {
    console.error('Error saving attempts to localStorage:', err);
  }
}

/**
 * Gets the attempt for a given student ID.
 */
export function getAttemptForStudent(studentId: string): ExamAttempt | null {
  const attempts = getAllAttempts();
  return attempts[studentId] || null;
}

/**
 * Saves or updates a student's attempt.
 */
export function saveStudentAttempt(attempt: ExamAttempt): void {
  const attempts = getAllAttempts();
  attempts[attempt.studentId] = attempt;
  saveAllAttempts(attempts);
}

/**
 * Resets a student's attempt (Instructor privilege).
 */
export function resetStudentAttempt(studentId: string): void {
  const attempts = getAllAttempts();
  if (attempts[studentId]) {
    delete attempts[studentId];
    saveAllAttempts(attempts);
  }
}

/**
 * Saves current logged-in student in session.
 */
export function setCurrentStudentSession(student: Student | null): void {
  if (!student) {
    localStorage.removeItem(STORAGE_KEY_CURRENT_STUDENT);
  } else {
    localStorage.setItem(STORAGE_KEY_CURRENT_STUDENT, JSON.stringify(student));
  }
}

/**
 * Gets current logged-in student session.
 */
export function getCurrentStudentSession(): Student | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CURRENT_STUDENT);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export interface WeekPerformance {
  week: number;
  label: string;
  total: number;
  correct: number;
  percentage: number;
}

/**
 * Computes performance breakdown per week for an attempt.
 */
export function getWeekBreakdown(attempt: ExamAttempt): WeekPerformance[] {
  const weekLabels: Record<number, string> = {
    1: 'Week 1: IT Roles, Hardware, Cabling & Troubleshooting',
    2: 'Week 2: Windows 11 Build, Local Accounts & Least Privilege',
    3: 'Week 3: VirtualBox, Active Directory, DNS & DHCP',
    4: 'Week 4: Ubuntu Linux, SSH, Netplan, Nginx & UFW',
  };

  const map: Record<number, { total: number; correct: number }> = {
    1: { total: 0, correct: 0 },
    2: { total: 0, correct: 0 },
    3: { total: 0, correct: 0 },
    4: { total: 0, correct: 0 },
  };

  attempt.questions.forEach((q) => {
    if (map[q.week]) {
      map[q.week].total += 1;
      if (attempt.answers[q.id] === q.correct) {
        map[q.week].correct += 1;
      }
    }
  });

  return [1, 2, 3, 4].map((w) => {
    const total = map[w].total;
    const correct = map[w].correct;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      week: w,
      label: weekLabels[w] || `Week ${w}`,
      total,
      correct,
      percentage,
    };
  });
}

/**
 * Formats seconds into MM:SS
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Generates CSV string of all 12 student records and their current exam status
 */
export function generateResultsCSV(attempts: Record<string, ExamAttempt>): string {
  const headers = [
    'Student ID',
    'Full Name',
    'Email',
    'Exam',
    'Status',
    'Score',
    'Total',
    'Percentage (%)',
    'Result',
    'Time Spent (min)',
    'Submitted At (UTC)',
  ];

  const rows = REGISTERED_STUDENTS.map((student) => {
    const attempt = attempts[student.id];
    if (!attempt) {
      return [
        student.id,
        `"${student.name}"`,
        student.email || 'N/A',
        '-',
        'Not Started',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
      ];
    }

    if (!attempt.submitted) {
      const answeredCount = Object.keys(attempt.answers).length;
      return [
        student.id,
        `"${student.name}"`,
        student.email || 'N/A',
        `"${attempt.examTitle ?? ''}"`,
        `In Progress (${answeredCount}/${attempt.totalQuestions} answered)`,
        '-',
        attempt.totalQuestions,
        '-',
        '-',
        '-',
        '-',
      ];
    }

    const minutesSpent = attempt.timeSpentSeconds
      ? (attempt.timeSpentSeconds / 60).toFixed(1)
      : '-';

    return [
      student.id,
      `"${student.name}"`,
      student.email || 'N/A',
      `"${attempt.examTitle ?? ''}"`,
      'Completed',
      attempt.score ?? 0,
      attempt.totalQuestions,
      `${attempt.percentage ?? 0}%`,
      attempt.passed ? 'PASSED (Competent)' : 'NOT YET COMPETENT',
      minutesSpent,
      attempt.submittedAt || '-',
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

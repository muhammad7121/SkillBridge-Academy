export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface ExamQuestion {
  id: string;
  week: number;
  topic: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuestionSeedData {
  meta: {
    programme: string;
    cohort: string;
    scope: string;
    totalQuestions: number;
    format: string;
  };
  questions: ExamQuestion[];
}

export interface ExamAttempt {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  examId?: string;
  examTitle?: string;
  startTime: number; // ms timestamp
  durationSeconds: number; // 3600 (60 mins)
  questions: ExamQuestion[];
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  flaggedQuestionIds: string[];
  submitted: boolean;
  score?: number;
  totalQuestions: number;
  percentage?: number;
  passed?: boolean;
  submittedAt?: string;
  timeSpentSeconds?: number;
  /** True once the server has confirmed this attempt is stored in the database. */
  serverSaved?: boolean;
}

export type AppView = 'login' | 'instructions' | 'exam' | 'results' | 'instructor';

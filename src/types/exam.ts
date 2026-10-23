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
}

export type AppView = 'login' | 'instructions' | 'exam' | 'results' | 'instructor';

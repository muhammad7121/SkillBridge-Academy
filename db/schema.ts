import {
  pgTable,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

/**
 * One row per candidate sitting of an exam. A candidate can hold at most one
 * attempt per exam (enforced by the unique index), which is what prevents
 * duplicate results from repeated clicks or page refreshes. An instructor
 * "reset" deletes the row so a fresh attempt can be created.
 */
export const examAttempts = pgTable(
  'exam_attempts',
  {
    id: text().primaryKey(),
    studentId: text('student_id').notNull(),
    studentName: text('student_name').notNull(),
    studentEmail: text('student_email').notNull().default(''),
    examId: text('exam_id').notNull(),
    examTitle: text('exam_title').notNull(),
    // Question IDs served to the candidate, in display order. Grading is done
    // on the server against the question bank, never against client input.
    questionIds: jsonb('question_ids').$type<string[]>().notNull(),
    answers: jsonb().$type<Record<string, 'A' | 'B' | 'C' | 'D'>>().notNull().default({}),
    flaggedQuestionIds: jsonb('flagged_question_ids').$type<string[]>().notNull().default([]),
    status: text().$type<'in_progress' | 'submitted'>().notNull().default('in_progress'),
    score: integer(),
    totalMarks: integer('total_marks').notNull(),
    percentage: integer(),
    passed: boolean(),
    durationSeconds: integer('duration_seconds').notNull(),
    timeSpentSeconds: integer('time_spent_seconds'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    submittedAt: timestamp('submitted_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('exam_attempts_student_exam_uniq').on(t.studentId, t.examId),
    index('exam_attempts_exam_status_idx').on(t.examId, t.status),
  ]
);

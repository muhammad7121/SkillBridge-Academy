CREATE TABLE "exam_attempts" (
	"id" text PRIMARY KEY,
	"student_id" text NOT NULL,
	"student_name" text NOT NULL,
	"student_email" text DEFAULT '' NOT NULL,
	"exam_id" text NOT NULL,
	"exam_title" text NOT NULL,
	"question_ids" jsonb NOT NULL,
	"answers" jsonb DEFAULT '{}' NOT NULL,
	"flagged_question_ids" jsonb DEFAULT '[]' NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"score" integer,
	"total_marks" integer NOT NULL,
	"percentage" integer,
	"passed" boolean,
	"duration_seconds" integer NOT NULL,
	"time_spent_seconds" integer,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "exam_attempts_student_exam_uniq" ON "exam_attempts" ("student_id","exam_id");--> statement-breakpoint
CREATE INDEX "exam_attempts_exam_status_idx" ON "exam_attempts" ("exam_id","status");
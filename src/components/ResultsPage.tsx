import React, { useState } from 'react';
import { ExamAttempt } from '../types/exam';
import { getWeekBreakdown } from '../utils/examEngine';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  LogOut,
  Printer,
  ShieldCheck,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

interface ResultsPageProps {
  attempt: ExamAttempt;
  onLogout: () => void;
  justSubmitted?: boolean;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ attempt, onLogout, justSubmitted = false }) => {
  const [showReview, setShowReview] = useState(false);
  const [filterWeek, setFilterWeek] = useState<number | 'all'>('all');

  const breakdown = getWeekBreakdown(attempt);
  const isPassed = Boolean(attempt.passed);
  const score = attempt.score ?? 0;
  const total = attempt.totalQuestions ?? 40;
  const percentage = attempt.percentage ?? 0;

  const filteredQuestions =
    filterWeek === 'all'
      ? attempt.questions
      : attempt.questions.filter((q) => q.week === filterWeek);

  const formatMinutes = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-6">
      {justSubmitted && attempt.serverSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Your assessment was submitted and your result has been saved. Your instructor can now see it.</span>
        </div>
      )}

      {/* Assessment Final Score Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Banner with Result State */}
        <div
          className={`p-6 sm:p-8 text-white relative overflow-hidden ${
            isPassed ? 'bg-[#0E5C63]' : 'bg-slate-800'
          }`}
        >
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#D4A017]">
                SkillBridge Systems Administration Assessment
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-md text-white font-mono">
                Cohort C1-2026
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Assessment Completed
                </h1>
                <p className="text-teal-100 text-sm mt-1">
                  Candidate: <strong className="text-white">{attempt.studentName}</strong> (ID: {attempt.studentId})
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`px-4 py-2.5 rounded-lg border text-sm font-bold flex items-center gap-2 self-start sm:self-auto ${
                  isPassed
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                    : 'bg-rose-500/20 border-rose-400 text-rose-200'
                }`}
              >
                {isPassed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span>PASSED · COMPETENT</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-300" />
                    <span>NOT YET COMPETENT</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Score & Summary Metrics */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Final Score</span>
              <div className="text-3xl font-bold text-slate-900 tabular-nums">
                {percentage}%
              </div>
              <div className="text-xs text-slate-600 font-medium">
                {score} of {total} correct
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Pass Mark Required</span>
              <div className="text-3xl font-bold text-slate-900 tabular-nums">50%</div>
              <div className="text-xs text-slate-600">Threshold: 20/40</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Time Elapsed</span>
              <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                {formatMinutes(attempt.timeSpentSeconds)}
              </div>
              <div className="text-xs text-slate-500">Allotted: 60 min</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Submission Stamp</span>
              <div className="text-xs font-mono text-slate-900 font-medium mt-1">
                {attempt.submittedAt
                  ? new Date(attempt.submittedAt).toLocaleDateString()
                  : 'Recorded'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {attempt.submittedAt
                  ? new Date(attempt.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : ''}
              </div>
            </div>
          </div>

          {/* Performance Breakdown by Week */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Curriculum Topic Breakdown
              </h2>
              <span className="text-xs text-slate-500">10 Questions per Module</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {breakdown.map((item) => {
                const isWeekPassed = item.percentage >= 50;
                return (
                  <div
                    key={item.week}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 truncate pr-2">
                        {item.label}
                      </span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums shrink-0">
                        {item.correct}/{item.total} ({item.percentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isWeekPassed ? 'bg-[#0E5C63]' : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Retake Policy Lockout Notice */}
          <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0E5C63] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-900 block">Assessment Registered</span>
              <p>
                Your attempt has been saved to the cohort records. Retakes are blocked by default to maintain examination integrity. If a reset is required due to extraordinary technical difficulty, consult your Academy Instructor.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReview(!showReview)}
                className="px-4 py-2.5 rounded-lg border border-[#0E5C63] text-[#0E5C63] hover:bg-[#E7F2F3] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{showReview ? 'Hide Answer Review' : 'Review Question Answers'}</span>
                {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <button
                onClick={handlePrint}
                className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
                title="Print or Save PDF"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print / Save PDF</span>
              </button>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Answer Review Section */}
      {showReview && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Detailed Question Review ({total} Questions)
              </h2>
              <p className="text-xs text-slate-500">
                Review your selections against the official answer keys and technical rationales.
              </p>
            </div>

            {/* Filter by week */}
            <div className="flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-lg">
              {(['all', 1, 2, 3, 4] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setFilterWeek(w)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    filterWeek === w
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {w === 'all' ? 'All Weeks' : `W${w}`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filteredQuestions.map((q, idx) => {
              const studentAnswer = attempt.answers[q.id];
              const isCorrect = studentAnswer === q.correct;
              const isUnanswered = !studentAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-4 text-xs pb-3 border-b border-slate-200/60">
                    <div className="space-x-2 text-slate-600">
                      <span className="font-bold text-slate-900">
                        Q{idx + 1}. ({q.id})
                      </span>
                      <span>·</span>
                      <span className="font-medium text-[#0E5C63]">Week {q.week}</span>
                      <span>·</span>
                      <span>{q.topic}</span>
                    </div>

                    <div className="shrink-0">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                        </span>
                      ) : isUnanswered ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                          <AlertCircle className="w-4 h-4" /> Unanswered (0)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                          <XCircle className="w-4 h-4" /> Incorrect (0)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="py-3 text-sm sm:text-base font-medium text-slate-900">
                    {q.question}
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-2 pt-1 text-xs sm:text-sm">
                    {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                      const text = q.options[letter];
                      const isCorrectKey = letter === q.correct;
                      const isStudentChoice = letter === studentAnswer;

                      let rowStyle = 'border-slate-200 bg-white text-slate-700';

                      if (isCorrectKey) {
                        rowStyle = 'border-emerald-300 bg-emerald-50 text-emerald-950 font-medium';
                      } else if (isStudentChoice && !isCorrectKey) {
                        rowStyle = 'border-rose-300 bg-rose-50 text-rose-950 line-through';
                      }

                      return (
                        <div
                          key={letter}
                          className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${rowStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                isCorrectKey
                                  ? 'bg-emerald-600 text-white'
                                  : isStudentChoice
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {letter}
                            </span>
                            <span>{text}</span>
                          </div>

                          <div className="text-[11px] font-semibold shrink-0">
                            {isCorrectKey && <span className="text-emerald-700">✓ Official Key</span>}
                            {isStudentChoice && !isCorrectKey && (
                              <span className="text-rose-700">✗ Your Choice</span>
                            )}
                            {isStudentChoice && isCorrectKey && (
                              <span className="text-emerald-700">· Your Choice</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Technical Rationale / Explanation */}
                  <div className="mt-3.5 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-semibold text-slate-900 block">Technical Explanation:</span>
                    <p className="text-slate-600 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

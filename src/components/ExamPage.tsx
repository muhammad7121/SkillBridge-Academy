import React, { useState, useEffect, useRef } from 'react';
import { ExamAttempt, ExamQuestion } from '../types/exam';
import {
  saveStudentAttempt,
  formatTimeRemaining,
} from '../utils/examEngine';
import { submitAttempt, saveAttemptProgress } from '../utils/api';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';

interface ExamPageProps {
  attempt: ExamAttempt;
  onFinishExam: (gradedAttempt: ExamAttempt) => void;
}

export const ExamPage: React.FC<ExamPageProps> = ({
  attempt: initialAttempt,
  onFinishExam,
}) => {
  const [attempt, setAttempt] = useState<ExamAttempt>(initialAttempt);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const elapsed = Math.floor((Date.now() - initialAttempt.startTime) / 1000);
    const left = initialAttempt.durationSeconds - elapsed;
    return Math.max(0, left);
  });
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPaletteMobile, setShowPaletteMobile] = useState(false);
  const [showFiveMinuteWarning, setShowFiveMinuteWarning] = useState(false);
  const [isSubmittingAuto, setIsSubmittingAuto] = useState(false);
  const timerRef = useRef<number | null>(null);
  const hasTriggeredFiveMinWarning = useRef(false);
  const attemptRef = useRef<ExamAttempt>(attempt);

  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);

  const currentQuestion: ExamQuestion = attempt.questions[currentIndex];
  const totalQuestions = attempt.questions.length;
  const answeredCount = Object.keys(attempt.answers).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const isFlagged = attempt.flaggedQuestionIds.includes(currentQuestion.id);
  const selectedOption = attempt.answers[currentQuestion.id];

  const handleAutoSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmittingAuto(true);
    finalizeSubmission();
  };

  const isSubmittingRef = useRef(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Saves and grades on the server; only reports success once the result is stored.
  const finalizeSubmission = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSubmitError(null);
    try {
      const saved = await submitAttempt(attemptRef.current);
      saveStudentAttempt(saved);
      onFinishExam(saved);
    } catch (err) {
      console.error('Exam submission failed:', err);
      setIsSubmittingAuto(false);
      setSubmitError(
        (err instanceof Error ? err.message : 'Submission failed.') +
          ' Your answers are still saved on this device — please try submitting again.'
      );
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Timer interval with 5-minute warning check
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        // Trigger 5-minute warning when passing 300 seconds (5:00)
        if (prev <= 300 && !hasTriggeredFiveMinWarning.current && prev > 1) {
          hasTriggeredFiveMinWarning.current = true;
          setShowFiveMinuteWarning(true);
        }

        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelectOption = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    const updatedAnswers = {
      ...attempt.answers,
      [currentQuestion.id]: optionKey,
    };
    const updatedAttempt: ExamAttempt = {
      ...attempt,
      answers: updatedAnswers,
    };
    setAttempt(updatedAttempt);
    saveStudentAttempt(updatedAttempt);
    saveAttemptProgress(updatedAttempt).catch((err) => console.warn('Autosave failed:', err));
  };

  const handleToggleFlag = () => {
    let updatedFlags: string[];
    if (isFlagged) {
      updatedFlags = attempt.flaggedQuestionIds.filter((id) => id !== currentQuestion.id);
    } else {
      updatedFlags = [...attempt.flaggedQuestionIds, currentQuestion.id];
    }
    const updatedAttempt: ExamAttempt = {
      ...attempt,
      flaggedQuestionIds: updatedFlags,
    };
    setAttempt(updatedAttempt);
    saveStudentAttempt(updatedAttempt);
    saveAttemptProgress(updatedAttempt).catch((err) => console.warn('Autosave failed:', err));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setShowPaletteMobile(false);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    if (timerRef.current) clearInterval(timerRef.current);
    finalizeSubmission();
  };

  const isLowTime = secondsRemaining <= 300; // Under 5 minutes

  return (
    <div className="flex-1 flex flex-col bg-[#F5F7F8]">
      {/* Exam Sticky Action Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Candidate & Progress */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowPaletteMobile(!showPaletteMobile)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Toggle Question Grid"
            >
              {showPaletteMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base truncate">
                  {attempt.studentName}
                </span>
                <span className="text-slate-400 hidden sm:inline">·</span>
                <span className="text-xs font-mono text-slate-600 hidden sm:inline">
                  {attempt.studentId}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span>·</span>
                <span className="font-medium text-[#0E5C63]">
                  {answeredCount} answered
                </span>
              </div>
            </div>
          </div>

          {/* Timer & Submit CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Countdown Badge */}
            <div
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border font-mono font-bold text-sm sm:text-base tabular-nums transition-colors ${
                isLowTime
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-teal-50 border-teal-200 text-[#0E5C63]'
              }`}
            >
              <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${isLowTime ? 'text-rose-600' : 'text-[#0E5C63]'}`} />
              <span>{formatTimeRemaining(secondsRemaining)}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-3.5 sm:px-4 py-2 bg-[#0E5C63] hover:bg-[#093E43] active:bg-[#072F33] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Submit Assessment</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar Section */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">Progress:</span>
              <span className="text-slate-600">
                <strong className="text-slate-900 tabular-nums">{answeredCount}</strong> of <strong className="text-slate-900 tabular-nums">{totalQuestions}</strong> questions answered
              </span>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <span className="text-slate-500 hidden sm:inline">
                {totalQuestions - answeredCount > 0 ? `${totalQuestions - answeredCount} remaining` : 'All answered!'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Outer Track */}
              <div
                className="flex-1 sm:w-56 bg-slate-200 rounded-full h-3 overflow-hidden p-0.5"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Assessment completion progress"
              >
                <div
                  className="bg-[#0E5C63] h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-bold text-[#0E5C63] font-mono tabular-nums text-xs shrink-0 min-w-[3rem] text-right">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Examination Viewport */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Active Question Workspace */}
        <div className="flex-1 flex flex-col space-y-4">
          {/* 5-Minute Warning Persistent Banner */}
          {isLowTime && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">5-Minute Time Warning:</span>{' '}
                  <span>You have less than 5 minutes remaining. When the timer reaches <strong>00:00</strong>, your exam will auto-submit.</span>
                </div>
              </div>
              <span className="font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md text-xs tabular-nums shrink-0">
                {formatTimeRemaining(secondsRemaining)}
              </span>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 flex-1 flex flex-col justify-between">
            <div>
              {/* Question Meta Header */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <span className="font-semibold text-[#0E5C63]">
                    Week {currentQuestion.week}
                  </span>
                  <span>·</span>
                  <span>{currentQuestion.topic}</span>
                  <span>·</span>
                  <span className="font-mono text-slate-400">ID: {currentQuestion.id}</span>
                </div>

                {/* Flag for review button */}
                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isFlagged
                      ? 'bg-[#FBF4DE] text-[#A57C0E] border border-[#D4A017]/40'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isFlagged ? 'fill-[#D4A017] text-[#D4A017]' : 'text-slate-400'}`}
                  />
                  <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="py-6">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-3 pt-2">
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const optionText = currentQuestion.options[key];
                  const isSelected = selectedOption === key;

                  return (
                    <label
                      key={key}
                      onClick={() => handleSelectOption(key)}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-[#E7F2F3] border-[#0E5C63] shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      {/* Custom Radio Circle */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? 'bg-[#0E5C63] text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {key}
                      </div>

                      {/* Option Text */}
                      <div className="flex-1 text-sm sm:text-base font-normal pt-0.5 leading-relaxed text-slate-800">
                        {optionText}
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#0E5C63] shrink-0 mt-0.5" />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav Bar within Question Card */}
            <div className="flex items-center justify-between gap-4 pt-8 mt-8 border-t border-slate-100">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-50 border border-slate-200'
                    : 'text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs text-slate-500 hidden sm:block">
                Saved to local cache · Auto-sync active
              </div>

              {currentIndex === totalQuestions - 1 ? (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0E5C63] hover:bg-[#093E43] shadow-xs transition-colors cursor-pointer"
                >
                  <span>Submit Exam</span>
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0E5C63] hover:bg-[#093E43] shadow-xs transition-colors cursor-pointer"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Grid Palette (Desktop + Mobile Drawer) */}
        <aside
          className={`lg:w-80 shrink-0 ${
            showPaletteMobile
              ? 'fixed inset-0 z-50 bg-black/40 flex justify-end lg:static lg:bg-transparent'
              : 'hidden lg:block'
          }`}
        >
          <div
            className={`w-full max-w-sm lg:max-w-none bg-white rounded-xl shadow-xs border border-slate-200 p-5 h-full flex flex-col space-y-4 ${
              showPaletteMobile ? 'h-full overflow-y-auto' : ''
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-slate-900">
                Question Palette ({totalQuestions})
              </h3>
              {showPaletteMobile && (
                <button
                  onClick={() => setShowPaletteMobile(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Palette Completion Progress Indicator */}
            <div className="space-y-1.5 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Completion</span>
                <span className="font-bold text-[#0E5C63] font-mono tabular-nums">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-[#0E5C63] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>{answeredCount} answered</span>
                <span>{totalQuestions - answeredCount} remaining</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-[#0E5C63]" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300" />
                <span>Unanswered ({totalQuestions - answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-[#FBF4DE] border border-[#D4A017]" />
                <span>Flagged ({attempt.flaggedQuestionIds.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded border-2 border-[#0E5C63] bg-white" />
                <span>Current</span>
              </div>
            </div>

            {/* 40-question grid */}
            <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[460px] py-1 pr-1">
              {attempt.questions.map((q, idx) => {
                const isAnswered = Boolean(attempt.answers[q.id]);
                const isItemFlagged = attempt.flaggedQuestionIds.includes(q.id);
                const isCurrent = idx === currentIndex;

                let btnClass = 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';

                if (isAnswered) {
                  btnClass = 'bg-[#0E5C63] text-white border-[#0E5C63] font-semibold';
                }
                if (isItemFlagged) {
                  btnClass = `${isAnswered ? 'bg-[#0E5C63] text-white' : 'bg-[#FBF4DE] text-amber-900 border-[#D4A017]'}`;
                }
                if (isCurrent) {
                  btnClass += ' ring-2 ring-offset-1 ring-[#0E5C63] font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`relative h-10 rounded-lg text-xs flex items-center justify-center border transition-all cursor-pointer ${btnClass}`}
                  >
                    <span>{idx + 1}</span>
                    {isItemFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D4A017] border border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Review & Final Submit Action */}
            <div className="pt-3 border-t border-slate-100 mt-auto">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-3 bg-[#0E5C63] hover:bg-[#093E43] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit & Complete</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {submitError && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)] p-4 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm shadow-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <strong className="block">Submission not saved</strong>
            <span>{submitError}</span>
          </div>
          <button onClick={finalizeSubmission} className="px-3 py-1.5 rounded bg-rose-600 text-white text-xs font-semibold">Retry</button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-teal-50 text-[#0E5C63] shrink-0">
                <AlertTriangle className="w-6 h-6 text-[#0E5C63]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Ready to Submit Assessment?
                </h3>
                <p className="text-xs text-slate-600">
                  Please confirm you want to finalize your assessment submission.
                </p>
              </div>
            </div>

            {/* Summary statistics */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-700">
                <span>Total Questions:</span>
                <span className="font-semibold text-slate-900 tabular-nums">{totalQuestions}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Questions Answered:</span>
                <span className="font-semibold text-[#0E5C63] tabular-nums">{answeredCount}</span>
              </div>
              {totalQuestions - answeredCount > 0 && (
                <div className="flex justify-between text-rose-700 font-medium">
                  <span>Unanswered Questions:</span>
                  <span className="tabular-nums">{totalQuestions - answeredCount}</span>
                </div>
              )}
              {attempt.flaggedQuestionIds.length > 0 && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>Questions Flagged:</span>
                  <span className="tabular-nums">{attempt.flaggedQuestionIds.length}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-200">
                <span>Time Remaining:</span>
                <span className="font-mono font-semibold tabular-nums">
                  {formatTimeRemaining(secondsRemaining)}
                </span>
              </div>
            </div>

            {totalQuestions - answeredCount > 0 && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-md border border-rose-200">
                Warning: You have {totalQuestions - answeredCount} unanswered questions. Unanswered questions will receive zero points.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Return to Exam
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-5 py-2.5 rounded-lg bg-[#0E5C63] hover:bg-[#093E43] text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5-Minute Warning Popup Modal */}
      {showFiveMinuteWarning && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border-2 border-amber-400 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-full bg-amber-100 text-amber-700 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  5 Minutes Remaining!
                </h3>
                <p className="text-xs text-slate-600">
                  You have less than 5 minutes left in this examination.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="flex justify-between font-bold">
                <span>Time Left:</span>
                <span className="font-mono tabular-nums text-amber-800 text-sm">
                  {formatTimeRemaining(secondsRemaining)}
                </span>
              </div>
              <p>
                When the timer hits <strong>00:00</strong>, your exam will <strong>automatically submit</strong>. Please review any unanswered or flagged questions now.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowFiveMinuteWarning(false)}
                className="px-5 py-2.5 bg-[#0E5C63] hover:bg-[#093E43] text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Understood, Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Submitting When Time Expires Overlay */}
      {isSubmittingAuto && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Time Expired!
              </h3>
              <p className="text-xs text-slate-600">
                The 60-minute examination period has ended. Automatically finalizing and recording your assessment results...
              </p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#0E5C63] h-1.5 rounded-full animate-pulse w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

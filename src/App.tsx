import React, { useState, useEffect, useRef } from 'react';
import { Student, ExamAttempt, AppView } from './types/exam';
import {
  getCurrentStudentSession,
  setCurrentStudentSession,
  getAttemptForStudent,
  saveStudentAttempt,
  resetStudentAttempt,
} from './utils/examEngine';
import { fetchStudentAttempt, startAttempt, saveAttemptProgress } from './utils/api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { InstructionsPage } from './components/InstructionsPage';
import { ExamPage } from './components/ExamPage';
import { ResultsPage } from './components/ResultsPage';
import { InstructorView } from './components/InstructorView';

export default function App() {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(() =>
    getCurrentStudentSession()
  );
  const [activeAttempt, setActiveAttempt] = useState<ExamAttempt | null>(() => {
    const student = getCurrentStudentSession();
    return student ? getAttemptForStudent(student.id) : null;
  });
  const [view, setView] = useState<AppView>(() => {
    const student = getCurrentStudentSession();
    if (!student) return 'login';
    const attempt = getAttemptForStudent(student.id);
    if (attempt?.submitted) return 'results';
    if (attempt && !attempt.submitted) return 'instructions';
    return 'instructions';
  });

  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const viewRef = useRef(view);
  viewRef.current = view;

  /**
   * The database is the source of truth for attempts. Reconcile the browser's
   * cached copy with it so results, instructor resets, and resumes stay consistent.
   */
  const syncAttemptFromServer = async (student: Student) => {
    try {
      const serverAttempt = await fetchStudentAttempt(student.id);
      const local = getAttemptForStudent(student.id);
      let next: ExamAttempt | null = serverAttempt;

      if (
        serverAttempt &&
        !serverAttempt.submitted &&
        local &&
        !local.submitted &&
        local.id === serverAttempt.id
      ) {
        // Local answers may be newer than the last autosave that reached the server.
        next = {
          ...serverAttempt,
          answers: { ...serverAttempt.answers, ...local.answers },
          flaggedQuestionIds: local.flaggedQuestionIds,
        };
        saveAttemptProgress(next).catch((err) =>
          console.warn('Could not push cached answers to server:', err)
        );
      }

      if (next) {
        saveStudentAttempt(next);
      } else {
        // No attempt on the server (never started, or reset by the instructor).
        resetStudentAttempt(student.id);
      }

      // Don't disrupt a candidate who is mid-exam or viewing results already.
      if (viewRef.current === 'exam') return;
      setActiveAttempt(next);
      if (viewRef.current === 'results' || viewRef.current === 'instructions') {
        setView(next?.submitted ? 'results' : 'instructions');
      }
    } catch (err) {
      console.error('Failed to load attempt from server; using cached copy.', err);
    }
  };

  // Reconcile a restored session with the server on first load
  useEffect(() => {
    if (currentStudent) syncAttemptFromServer(currentStudent);
  }, []);

  const handleLoginSuccess = (student: Student) => {
    setCurrentStudent(student);
    setCurrentStudentSession(student);
    setStartError(null);
    setJustSubmitted(false);
    const attempt = getAttemptForStudent(student.id);
    setActiveAttempt(attempt);

    if (attempt?.submitted) {
      setView('results');
    } else {
      setView('instructions');
    }
    syncAttemptFromServer(student);
  };

  const handleStartExam = async () => {
    if (!currentStudent || isStarting) return;
    setStartError(null);
    setIsStarting(true);
    try {
      // Server creates the attempt (or returns the existing one) and chooses the questions.
      const serverAttempt = await startAttempt(currentStudent.id);
      const local = getAttemptForStudent(currentStudent.id);
      const attempt =
        local && !local.submitted && local.id === serverAttempt.id && !serverAttempt.submitted
          ? { ...serverAttempt, answers: { ...serverAttempt.answers, ...local.answers }, flaggedQuestionIds: local.flaggedQuestionIds }
          : serverAttempt;
      saveStudentAttempt(attempt);
      setActiveAttempt(attempt);
      setView(attempt.submitted ? 'results' : 'exam');
    } catch (err) {
      console.error('Failed to start assessment:', err);
      setStartError(
        err instanceof Error ? err.message : 'Could not start the assessment. Please try again.'
      );
    } finally {
      setIsStarting(false);
    }
  };

  const handleFinishExam = (savedAttempt: ExamAttempt) => {
    setActiveAttempt(savedAttempt);
    setJustSubmitted(true);
    setView('results');
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setCurrentStudentSession(null);
    setActiveAttempt(null);
    setJustSubmitted(false);
    setStartError(null);
    setView('login');
  };

  const isExamInProgress = view === 'exam';

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F8] text-[#1A1A1A]">
      <Header
        currentStudent={currentStudent}
        onLogout={handleLogout}
        onOpenInstructor={() => setView('instructor')}
        isExamInProgress={isExamInProgress}
      />

      <main className="flex-1 flex flex-col">
        {view === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}

        {view === 'instructions' && currentStudent && (
          <InstructionsPage
            student={currentStudent}
            existingAttempt={activeAttempt}
            onStartExam={handleStartExam}
            onViewResults={() => setView('results')}
            isStarting={isStarting}
            startError={startError}
          />
        )}

        {view === 'exam' && activeAttempt && (
          <ExamPage
            attempt={activeAttempt}
            onFinishExam={handleFinishExam}
          />
        )}

        {view === 'results' && activeAttempt && (
          <ResultsPage
            attempt={activeAttempt}
            onLogout={handleLogout}
            justSubmitted={justSubmitted}
          />
        )}

        {view === 'instructor' && (
          <InstructorView
            onBackToPortal={() => {
              if (currentStudent) {
                const att = getAttemptForStudent(currentStudent.id);
                setActiveAttempt(att);
                setView(att?.submitted ? 'results' : 'instructions');
                syncAttemptFromServer(currentStudent);
              } else {
                setView('login');
              }
            }}
          />
        )}
      </main>

      {!isExamInProgress && <Footer />}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Student, ExamAttempt, AppView } from './types/exam';
import {
  getCurrentStudentSession,
  setCurrentStudentSession,
  getAttemptForStudent,
  createNewAttempt,
} from './utils/examEngine';
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

  // Keep activeAttempt in sync if currentStudent changes
  useEffect(() => {
    if (currentStudent) {
      const attempt = getAttemptForStudent(currentStudent.id);
      setActiveAttempt(attempt);
      if (view === 'login') {
        if (attempt?.submitted) {
          setView('results');
        } else {
          setView('instructions');
        }
      }
    } else {
      setActiveAttempt(null);
    }
  }, [currentStudent]);

  const handleLoginSuccess = (student: Student) => {
    setCurrentStudent(student);
    setCurrentStudentSession(student);
    const attempt = getAttemptForStudent(student.id);
    setActiveAttempt(attempt);

    if (attempt?.submitted) {
      setView('results');
    } else {
      setView('instructions');
    }
  };

  const handleStartExam = () => {
    if (!currentStudent) return;
    let attempt = getAttemptForStudent(currentStudent.id);
    if (!attempt || attempt.submitted) {
      attempt = createNewAttempt(currentStudent);
    }
    setActiveAttempt(attempt);
    setView('exam');
  };

  const handleFinishExam = (gradedAttempt: ExamAttempt) => {
    setActiveAttempt(gradedAttempt);
    setView('results');
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setCurrentStudentSession(null);
    setActiveAttempt(null);
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
          />
        )}

        {view === 'exam' && activeAttempt && (
          <ExamPage
            attempt={activeAttempt}
            onFinishExam={handleFinishExam}
          />
        )}

        {view === 'results' && activeAttempt && (
          <ResultsPage attempt={activeAttempt} onLogout={handleLogout} />
        )}

        {view === 'instructor' && (
          <InstructorView
            onBackToPortal={() => {
              if (currentStudent) {
                const att = getAttemptForStudent(currentStudent.id);
                setActiveAttempt(att);
                setView(att?.submitted ? 'results' : 'instructions');
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

import React, { useState } from 'react';
import { findStudent, REGISTERED_STUDENTS } from '../data/students';
import { Student } from '../types/exam';
import { LogIn, AlertCircle, Info, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (student: Student) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDirectory, setShowDirectory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const student = findStudent(identifier);
    if (!student) {
      setErrorMessage(
        'Student ID or Full Name not found in the Cohort C1-2026 register. Please ensure exact spelling or check the student list below.'
      );
      return;
    }

    onLoginSuccess(student);
  };

  const handleSelectStudent = (student: Student) => {
    setIdentifier(student.id);
    setErrorMessage(null);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl">
        {/* Assessment Card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#0E5C63] text-white px-6 py-8 text-center relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#D4A017]">
                SkillBridge Academy · C1-2026
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Systems Administration Assessment
              </h1>
              <p className="text-teal-100 text-sm max-w-md mx-auto">
                Weeks 1–4 Assessment Portal · Remote & On-Campus Examination
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">
                Candidate Authentication
              </h2>
              <p className="text-xs text-slate-500">
                Enter your assigned Student ID (e.g., <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-800">SBA-C1-SNA-2026-001</code>) or your registered Full Name.
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-3 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm"
              >
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block">Authentication Failed</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="student-identifier"
                  className="block text-sm font-medium text-slate-700"
                >
                  Student ID or Full Name
                </label>
                <div className="relative">
                  <input
                    id="student-identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="e.g. SBA-C1-SNA-2026-001 or Muhd Arab Lamido"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E5C63] focus:border-transparent text-sm sm:text-base font-medium transition-all"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>No password required for this cohort. Verification is matched against the 12 official enrolments.</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#0E5C63] hover:bg-[#093E43] active:bg-[#072F33] text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                <LogIn className="w-5 h-5" />
                <span>Enter Assessment Portal</span>
              </button>
            </form>

            {/* Quick Cohort Roster Helper */}
            <div className="border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setShowDirectory(!showDirectory)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-[#0E5C63] transition-colors py-2 px-1"
              >
                <span>Cohort C1-2026 Student Directory (12 Candidates)</span>
                {showDirectory ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showDirectory && (
                <div className="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-2 max-h-56 overflow-y-auto">
                  <p className="text-slate-500 text-[11px] pb-1 border-b border-slate-200">
                    Tap any student to auto-fill their credentials:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {REGISTERED_STUDENTS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectStudent(s)}
                        className={`text-left p-2 rounded flex items-center justify-between transition-colors ${
                          identifier === s.id || identifier.toLowerCase() === s.name.toLowerCase()
                            ? 'bg-[#E7F2F3] text-[#0E5C63] font-semibold border border-[#0E5C63]/30'
                            : 'hover:bg-white text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="font-mono text-[11px] text-slate-500">{s.id}</div>
                        </div>
                        {identifier === s.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#0E5C63] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Help card & Developer credit */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1.5">
          <p>Experiencing difficulty accessing your assessment? Contact the academy lab coordinator or instructor.</p>
          <p className="text-slate-600 font-medium text-xs pt-1">
            Developed by <span className="text-slate-900 font-semibold">Muhammad Abdullahi Muhammad</span>
          </p>
        </div>
      </div>
    </div>
  );
};

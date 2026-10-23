import React from 'react';
import { Student } from '../types/exam';
import { ShieldCheck, LogOut, User, LockKeyhole } from 'lucide-react';

interface HeaderProps {
  currentStudent: Student | null;
  onLogout: () => void;
  onOpenInstructor: () => void;
  isExamInProgress?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStudent,
  onLogout,
  onOpenInstructor,
  isExamInProgress = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark & programme badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#0E5C63] flex items-center justify-center text-white font-bold text-lg shadow-xs">
            SB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                SkillBridge Academy
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Building Skills. Creating Opportunities.
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation / Student Status */}
        <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600">
          {currentStudent && !isExamInProgress && (
            <div className="hidden md:flex items-center gap-2 font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
              <User className="w-4 h-4 text-[#0E5C63]" />
              <span className="font-semibold text-slate-900">{currentStudent.name}</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-xs text-slate-600">{currentStudent.id}</span>
            </div>
          )}

          {isExamInProgress && (
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Assessment In Session</span>
            </div>
          )}
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenInstructor}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0E5C63] hover:bg-slate-50 px-2.5 py-1.5 rounded-md transition-colors"
            title="Instructor Access"
          >
            <LockKeyhole className="w-3.5 h-3.5 text-[#0E5C63]" />
            <span className="hidden sm:inline">Instructor Portal</span>
          </button>

          {currentStudent && !isExamInProgress && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-md transition-colors border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

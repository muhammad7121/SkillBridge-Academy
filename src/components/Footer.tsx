import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-1.5">
        <p className="font-medium text-slate-700">
          A Social Enterprise Initiative of PTDS · Kano, Nigeria
        </p>
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <span>SkillBridge Academy</span>
          <span>·</span>
          <span>Systems & Network Administration</span>
          <span>·</span>
          <span>Cohort C1-2026</span>
        </div>
        <p className="text-slate-600 font-medium text-xs pt-1">
          Developed by <span className="text-slate-900 font-semibold">Muhammad Abdullahi Muhammad</span>
        </p>
      </div>
    </footer>
  );
};

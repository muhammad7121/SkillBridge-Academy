import React from 'react';
import { Student, ExamAttempt } from '../types/exam';
import { Clock, CheckSquare, Award, AlertTriangle, Shield, ArrowRight, BookOpen } from 'lucide-react';

interface InstructionsPageProps {
  student: Student;
  existingAttempt: ExamAttempt | null;
  onStartExam: () => void;
  onViewResults: () => void;
}

export const InstructionsPage: React.FC<InstructionsPageProps> = ({
  student,
  existingAttempt,
  onStartExam,
  onViewResults,
}) => {
  const isAlreadySubmitted = existingAttempt?.submitted === true;
  const isInProgress = existingAttempt && !existingAttempt.submitted;

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#0E5C63] text-white p-6 sm:p-8 rounded-xl shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4A017]">
          <span>Systems & Network Administration</span>
          <span>·</span>
          <span>Cohort C1-2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome, {student.name}
        </h1>
        <p className="text-teal-100 text-sm font-mono">
          Student ID: {student.id} {student.email ? `· ${student.email}` : ''}
        </p>
      </div>

      {/* Already completed banner */}
      {isAlreadySubmitted && (
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#D4A017] shrink-0" />
            <div>
              <h2 className="font-semibold text-base">Assessment Already Submitted</h2>
              <p className="text-xs sm:text-sm text-amber-800">
                You completed this assessment on {existingAttempt.submittedAt ? new Date(existingAttempt.submittedAt).toLocaleString() : 'record'}.
                Each candidate is allotted one attempt by default. Retakes are locked unless reset by the instructor.
              </p>
            </div>
          </div>
          <div className="pt-1">
            <button
              onClick={onViewResults}
              className="px-4 py-2 bg-[#0E5C63] hover:bg-[#093E43] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <span>View Your Assessment Results & Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Assessment Specifications & Instructions */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Systems Administration Assessment (Weeks 1–4)
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Carefully review the assessment rules, curriculum scope, and remote examination policy before beginning.
          </p>
        </div>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <CheckSquare className="w-4 h-4 text-[#0E5C63]" />
              <span>Questions</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">40</div>
            <div className="text-[11px] text-slate-500">10 per week (balanced)</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-4 h-4 text-[#0E5C63]" />
              <span>Time Limit</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">60 min</div>
            <div className="text-[11px] text-slate-500">Auto-submits at 00:00</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Award className="w-4 h-4 text-[#D4A017]" />
              <span>Pass Mark</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">50%</div>
            <div className="text-[11px] text-slate-500">20 / 40 correct</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Format</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">MCQ</div>
            <div className="text-[11px] text-slate-500">4 options, 1 correct</div>
          </div>
        </div>

        {/* Remote Integrity Note */}
        <div className="rounded-lg p-4 bg-[#FBF4DE] border border-[#D4A017]/40 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm text-amber-900">
            <Shield className="w-4 h-4 text-[#A57C0E]" />
            <span>Academic Integrity Protocol</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900">
            “This assessment may be taken on campus or remotely. Work independently. Do not share questions or answers. Your attempt is recorded against your Student ID.”
          </p>
        </div>

        {/* Exam Scope Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <BookOpen className="w-4 h-4 text-[#0E5C63]" />
            <span>Curriculum Scope (Systems Administration Only)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-semibold text-slate-900 block">Week 1 · Infrastructure & Troubleshooting</span>
              <p className="text-slate-600">
                IT device roles (Switch MAC forwarding vs Router IP routing), hardware resources (RAM paging), cabling specs (100m copper link), asset register fields, support tickets, physical-layer-first checks, lab safety.
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-semibold text-slate-900 block">Week 2 · Windows 11 Build & Least Privilege</span>
              <p className="text-slate-600">
                Clean installation baselines, Windows 11 Pro vs Home for domain join, least privilege, build records, local shares, NTFS vs share permissions, snapshots and bootable media.
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-semibold text-slate-900 block">Week 3 · Active Directory & Windows Server</span>
              <p className="text-slate-600">
                VirtualBox Host-Only (192.168.10.0/24 with VBox DHCP disabled), DC01 static 192.168.10.10, AD DS, DNS SRV records, DHCP scope 192.168.10.100–200, APIPA 169.254.x.x troubleshooting, domain join, LabShare.
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-semibold text-slate-900 block">Week 4 · Ubuntu Server & Linux Administration</span>
              <p className="text-slate-600">
                Ubuntu lnx01 192.168.10.20, Netplan YAML, SSH key auth & PuTTY, apt update/upgrade, sudo accountability, file permissions, nginx web verification, UFW rules, /etc/fstab, cron scheduling.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            * Note: Weeks 5–8 pure networking topics (routing protocols, VLANs, subnetting design) are not included in this examination.
          </p>
        </div>

        {/* Navigation & Safety Features */}
        <div className="rounded-lg p-4 bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <span className="font-semibold text-slate-900 block">During the Assessment:</span>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>You can navigate freely between questions using <strong>Previous</strong>, <strong>Next</strong>, or the question palette.</li>
            <li>Use the <strong>Flag for Review</strong> button to bookmark questions you wish to double-check before submitting.</li>
            <li>Your answers are automatically saved in real time to your browser storage. If your browser reloads or disconnects, your progress is preserved.</li>
            <li>A timer countdown is displayed continuously at the top of the screen.</li>
            <li>When you have answered all questions, click <strong>Submit Assessment</strong> and confirm.</li>
          </ul>
        </div>

        {/* Start / Resume Action */}
        {!isAlreadySubmitted ? (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              {isInProgress
                ? 'An assessment attempt is already started. You may resume where you left off.'
                : 'Click below to initiate your 60-minute assessment countdown.'}
            </div>
            <button
              onClick={onStartExam}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0E5C63] hover:bg-[#093E43] active:bg-[#072F33] text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base shrink-0"
            >
              <span>{isInProgress ? 'Resume Assessment' : 'Start Assessment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="pt-2 flex justify-end border-t border-slate-200">
            <button
              onClick={onViewResults}
              className="w-full sm:w-auto px-6 py-3 bg-[#0E5C63] hover:bg-[#093E43] text-white font-semibold rounded-lg transition-colors text-sm"
            >
              View Assessment Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

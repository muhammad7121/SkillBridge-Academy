import React, { useState } from 'react';
import { REGISTERED_STUDENTS } from '../data/students';
import { QUESTION_BANK } from '../data/questionsBank';
import {
  getAllAttempts,
  resetStudentAttempt,
  generateResultsCSV,
  saveAllAttempts,
} from '../utils/examEngine';
import { ExamAttempt } from '../types/exam';
import {
  Lock,
  Download,
  Copy,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  BookOpen,
  Users,
  Award,
  ChevronLeft,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface InstructorViewProps {
  onBackToPortal: () => void;
}

export const InstructorView: React.FC<InstructorViewProps> = ({ onBackToPortal }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'questions'>('roster');
  const [attempts, setAttempts] = useState<Record<string, ExamAttempt>>(() => getAllAttempts());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForReset, setSelectedStudentForReset] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [weekFilter, setWeekFilter] = useState<number | 'all'>('all');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '3ha@123456789') {
      setIsAuthenticated(true);
      setAuthError(false);
      setAttempts(getAllAttempts());
    } else {
      setAuthError(true);
    }
  };

  const handleReset = (studentId: string) => {
    resetStudentAttempt(studentId);
    setAttempts(getAllAttempts());
    setSelectedStudentForReset(null);
  };

  const handleDownloadCSV = () => {
    const csv = generateResultsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `SkillBridge_C1-2026_Exam_Results_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    const totalStudents = REGISTERED_STUDENTS.length;
    let completedCount = 0;
    let passCount = 0;
    let totalScorePercent = 0;

    REGISTERED_STUDENTS.forEach((s) => {
      const att = attempts[s.id];
      if (att?.submitted) {
        completedCount++;
        if (att.passed) passCount++;
        totalScorePercent += att.percentage ?? 0;
      }
    });

    const avgScore =
      completedCount > 0 ? (totalScorePercent / completedCount).toFixed(1) : 'N/A';
    const passRate =
      completedCount > 0 ? Math.round((passCount / completedCount) * 100) : 0;

    let summaryText = `*SkillBridge Academy — Exam Cohort Summary*\n`;
    summaryText += `Programme: Systems & Network Administration\n`;
    summaryText += `Cohort: C1-2026 (Weeks 1–4 Systems Administration Assessment)\n`;
    summaryText += `Total Enrolled: ${totalStudents}\n`;
    summaryText += `Completed: ${completedCount} / ${totalStudents}\n`;
    summaryText += `Class Average: ${avgScore}%\n`;
    summaryText += `Pass Rate (>=50%): ${passRate}%\n\n`;
    summaryText += `*Candidate Records:*\n`;

    REGISTERED_STUDENTS.forEach((s) => {
      const att = attempts[s.id];
      if (att?.submitted) {
        summaryText += `• ${s.name} (${s.id}): ${att.percentage}% (${att.score}/40) — ${att.passed ? 'PASSED' : 'NOT YET COMPETENT'}\n`;
      } else if (att && !att.submitted) {
        summaryText += `• ${s.name} (${s.id}): In Progress\n`;
      } else {
        summaryText += `• ${s.name} (${s.id}): Not Started\n`;
      }
    });

    navigator.clipboard.writeText(summaryText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  // Metrics computation
  const totalEnrolled = REGISTERED_STUDENTS.length;
  const completedAttempts = Object.values(attempts).filter((a) => a.submitted);
  const inProgressAttempts = Object.values(attempts).filter((a) => !a.submitted);
  const completedCount = completedAttempts.length;
  const passedCount = completedAttempts.filter((a) => a.passed).length;
  const passRate = completedCount > 0 ? Math.round((passedCount / completedCount) * 100) : 0;
  const averagePercentage =
    completedCount > 0
      ? Math.round(
          completedAttempts.reduce((acc, curr) => acc + (curr.percentage ?? 0), 0) /
            completedCount
        )
      : 0;

  // Question bank filter
  const filteredQuestions = QUESTION_BANK.filter((q) => {
    const matchesWeek = weekFilter === 'all' || q.week === weekFilter;
    const matchesSearch =
      !searchQuery ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWeek && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#0E5C63] text-white flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Instructor Access Portal
            </h1>
            <p className="text-xs text-slate-500">
              Restricted to SkillBridge Academy authorized instructors and administrators.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Invalid instructor password. Try again or check course admin guide.</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Instructor Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter instructor password"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E5C63] text-sm"
                autoFocus
              />
              <span className="text-[11px] text-slate-400">
                Authorized access only · Contact course lead if you need assistance
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0E5C63] hover:bg-[#093E43] text-white font-semibold rounded-lg text-sm transition-colors cursor-pointer"
            >
              Unlock Instructor Console
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToPortal}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Return to Student Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Console Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4A017]">
            <span>SkillBridge Academy</span>
            <span>·</span>
            <span>Instructor Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Cohort C1-2026 Assessment Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Systems Administration (Weeks 1–4) · 12 Registered Candidates · Developed by <strong className="text-slate-700">Muhammad Abdullahi Muhammad</strong>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/exam-portal.html"
            download="SkillBridge_Systems_Admin_Exam_Portal.html"
            className="px-3.5 py-2 rounded-lg bg-[#D4A017] hover:bg-[#A57C0E] text-slate-950 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-xs"
            title="Download full portal as a single offline HTML file"
          >
            <Download className="w-4 h-4" />
            <span>Download Offline HTML App</span>
          </a>

          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 rounded-lg bg-[#0E5C63] hover:bg-[#093E43] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copySuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={onBackToPortal}
            className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Student Portal</span>
          </button>
        </div>
      </div>

      {/* Cohort KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Users className="w-4 h-4 text-[#0E5C63]" />
            <span>Enrolled Students</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {totalEnrolled}
          </div>
          <div className="text-[11px] text-slate-500">Cohort C1-2026 total</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Completed</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {completedCount} <span className="text-xs text-slate-400 font-normal">/ {totalEnrolled}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {inProgressAttempts.length > 0 ? `${inProgressAttempts.length} in progress` : '0 in progress'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Award className="w-4 h-4 text-[#D4A017]" />
            <span>Class Average</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {averagePercentage}%
          </div>
          <div className="text-[11px] text-slate-500">Among completed sittings</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Pass Rate (≥ 50%)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {passRate}%
          </div>
          <div className="text-[11px] text-slate-500">
            {passedCount} of {completedCount} passed
          </div>
        </div>
      </div>

      {/* Tabs: Candidate Roster vs Question Bank */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('roster')}
          className={`py-2.5 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'border-[#0E5C63] text-[#0E5C63]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Register & Attempts ({totalEnrolled})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`py-2.5 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'border-[#0E5C63] text-[#0E5C63]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Question Bank Inspector ({QUESTION_BANK.length})</span>
        </button>
      </div>

      {/* Tab 1: Candidate Roster Table */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Score</th>
                  <th className="py-3.5 px-4 text-center">Verdict</th>
                  <th className="py-3.5 px-4">Date / Time</th>
                  <th className="py-3.5 px-4 text-right">Instructor Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {REGISTERED_STUDENTS.map((student) => {
                  const attempt = attempts[student.id];
                  const isSubmitted = Boolean(attempt?.submitted);
                  const isInProgress = Boolean(attempt && !attempt.submitted);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="font-mono text-xs text-slate-500">{student.id}</div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4 text-slate-600 text-xs">
                        {student.email || <span className="text-slate-400 italic">None recorded</span>}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium text-xs">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Submitted</span>
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            <span>In Progress ({Object.keys(attempt.answers).length}/40)</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Not Started</span>
                        )}
                      </td>

                      {/* Score */}
                      <td className="py-3 px-4 text-center">
                        {isSubmitted ? (
                          <div>
                            <span className="font-bold text-slate-900 tabular-nums">
                              {attempt.percentage}%
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {attempt.score}/40
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Verdict */}
                      <td className="py-3 px-4 text-center">
                        {isSubmitted ? (
                          attempt.passed ? (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                              PASS
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                              NOT YET COMPETENT
                            </span>
                          )
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {isSubmitted && attempt.submittedAt ? (
                          <div>
                            <div>{new Date(attempt.submittedAt).toLocaleDateString()}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {new Date(attempt.submittedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Reset action */}
                      <td className="py-3 px-4 text-right">
                        {attempt ? (
                          <button
                            onClick={() => setSelectedStudentForReset(student.id)}
                            className="px-2.5 py-1.5 rounded text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Reset attempt to allow candidate to retake"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset Attempt</span>
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Question Bank Inspector */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official Systems Administration Question Bank
              </h2>
              <p className="text-xs text-slate-500">
                60 multiple-choice questions vetted for Weeks 1–4 curriculum scope.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search questions or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0E5C63]"
                />
              </div>

              {/* Week filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                {(['all', 1, 2, 3, 4] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeekFilter(w)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      weekFilter === w
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {w === 'all' ? 'All' : `W${w}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{q.id}</span>
                    <span>·</span>
                    <span className="font-semibold text-[#0E5C63]">Week {q.week}</span>
                    <span>·</span>
                    <span>{q.topic}</span>
                  </div>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Correct: {q.correct}
                  </span>
                </div>

                <div className="font-medium text-slate-900 text-sm">{q.question}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-slate-700">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                    <div
                      key={opt}
                      className={`p-2 rounded border flex items-center gap-2 ${
                        opt === q.correct
                          ? 'border-emerald-300 bg-emerald-50 font-medium text-emerald-950'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span className="font-bold text-slate-500 w-4">{opt}.</span>
                      <span>{q.options[opt]}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {selectedStudentForReset && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-rose-50 text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Reset Candidate Assessment?
                </h3>
                <p className="text-xs text-slate-600">
                  This will completely clear the assessment submission for candidate{' '}
                  <strong className="text-slate-900">
                    {REGISTERED_STUDENTS.find((s) => s.id === selectedStudentForReset)?.name}
                  </strong>{' '}
                  ({selectedStudentForReset}).
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              The student will be granted permission to log in and sit a fresh 40-question assessment.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedStudentForReset(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReset(selectedStudentForReset)}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

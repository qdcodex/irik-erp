"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { LMSContent, Quiz, QuizSubmission } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import SearchableSelect from "@/components/SearchableSelect";
import {
  MonitorPlay,
  BookOpen,
  FileText,
  Award,
  PlusCircle,
  Video,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  X,
  ShieldCheck,
  Check,
  FileCheck2,
} from "lucide-react";

export default function LMSPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isFaculty = user?.role === "faculty";
  const canUpload = isAdmin || isFaculty;

  const [activeTab, setActiveTab] = useState<"materials" | "quizzes" | "submissions">("materials");
  const [materials, setMaterials] = useState<LMSContent[]>(store.getLMSContent());
  const [quizzes, setQuizzes] = useState<Quiz[]>(store.getQuizzes());
  const [submissions, setSubmissions] = useState<QuizSubmission[]>(store.getQuizSubmissions());

  // Interactive Quiz Taking State
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    courseId: "7",
    courseName: "Pilot Training",
    title: "",
    type: "manual" as LMSContent["type"],
    fileUrl: "/content/aviation-sample.pdf",
    uploadedBy: user?.fullName || "Capt. Vikram Malhotra",
    uploadDate: new Date().toISOString().split("T")[0],
    size: "8.4 MB",
  });

  const handleStartQuiz = (q: Quiz) => {
    setSelectedQuiz(q);
    setUserAnswers({});
    setQuizResult(null);
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz) return;

    let correctCount = 0;
    selectedQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const marksPerQ = selectedQuiz.totalMarks / selectedQuiz.questions.length;
    const score = Math.round(correctCount * marksPerQ);
    const passed = score >= selectedQuiz.totalMarks * 0.6;

    const result = { score, total: selectedQuiz.totalMarks, passed };
    setQuizResult(result);

    store.addQuizSubmission({
      quizId: selectedQuiz.id,
      studentId: "1",
      studentName: user?.fullName || "Rajesh Kumar",
      score,
      totalMarks: selectedQuiz.totalMarks,
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      passed,
    });

    setSubmissions(store.getQuizSubmissions());
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpload) return;

    store.addLMSContent(newMaterial);
    setMaterials(store.getLMSContent());
    setNewMaterial({
      courseId: "7",
      courseName: "Pilot Training",
      title: "",
      type: "manual",
      fileUrl: "/content/aviation-sample.pdf",
      uploadedBy: user?.fullName || "Capt. Vikram Malhotra",
      uploadDate: new Date().toISOString().split("T")[0],
      size: "8.4 MB",
    });
    setShowUploadModal(false);
    setActiveTab("materials");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Modern Aviation Command Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-slate-800/80">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  DGCA Ground School & LMS
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
                  Digital Syllabus & Auto-Graded Exams
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <MonitorPlay className="w-6 h-6 text-blue-400" />
                E-Learning & Flight Theory LMS
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Aircraft flight manuals, cockpit checklists, DGCA Ground School video lectures, and online mock examinations.
              </p>
            </div>

            {/* Navigation & Role-Specific Upload Action */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner">
                <button
                  onClick={() => {
                    setSelectedQuiz(null);
                    setActiveTab("materials");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "materials" && !selectedQuiz
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Materials ({materials.length})</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedQuiz(null);
                    setActiveTab("quizzes");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "quizzes" || selectedQuiz
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Quizzes ({quizzes.length})</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedQuiz(null);
                    setActiveTab("submissions");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "submissions"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Scores</span>
                </button>
              </div>

              {/* ONLY Faculty & Admin can upload courseware */}
              {canUpload && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-900/30 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Upload Material</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab 1: Study Materials */}
        {activeTab === "materials" && !selectedQuiz && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {materials.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:shadow-md transition shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {m.courseName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{m.size}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{m.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <span>By {m.uploadedBy}</span>
                      <span>•</span>
                      <span>{m.uploadDate}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    {m.type === "video" ? "📹 Video Lecture" : "📄 PDF Manual"}
                  </span>
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Access Material</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Quizzes List or Active Quiz */}
        {activeTab === "quizzes" && !selectedQuiz && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:shadow-md transition shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {q.courseName}
                    </span>
                    <span className="text-xs font-bold text-slate-700 font-mono">
                      {q.totalMarks} Marks
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{q.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {q.questions.length} DGCA Theory Questions • 60% Passing Grade
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Timed: 15 Mins</span>
                  <button
                    onClick={() => handleStartQuiz(q)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer"
                  >
                    <span>Start Exam</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Quiz Taking View */}
        {selectedQuiz && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {selectedQuiz.courseName}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedQuiz.title}</h2>
              </div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                ← Exit Quiz
              </button>
            </div>

            {/* Quiz Result Banner */}
            {quizResult && (
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  quizResult.passed
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  {quizResult.passed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {quizResult.passed ? "Examination Passed!" : "Retake Recommended"}
                    </h4>
                    <p className="text-xs">
                      You scored {quizResult.score} / {quizResult.total} marks (Passing is 60%)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="px-4 py-1.5 bg-white text-xs font-bold rounded-lg border shadow-2xs"
                >
                  View All Scores
                </button>
              </div>
            )}

            {/* Questions Form */}
            <form onSubmit={handleSubmitQuiz} className="space-y-6">
              {selectedQuiz.questions.map((q, qIdx) => (
                <div key={q.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-3">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {qIdx + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, oIdx)}
                        className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border transition ${
                          userAnswers[qIdx] === oIdx
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {!quizResult && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Exam for Instant Evaluation</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab 3: Test Scores & Submissions */}
        {activeTab === "submissions" && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-900">Cadet Examination Roster</h3>
              <p className="text-xs text-slate-500">Auto-graded DGCA theory assessments & evaluation log</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Cadet Name</th>
                    <th className="py-3 px-4">Exam Module</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Date / Time</th>
                    <th className="py-3 px-4 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => {
                    const quiz = quizzes.find((q) => q.id === sub.quizId);
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">{sub.studentName}</td>
                        <td className="py-3 px-4 text-slate-700">{quiz?.title || "Theory Exam"}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {sub.score} / {sub.totalMarks}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{sub.submittedAt}</td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              sub.passed
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {sub.passed ? "Passed" : "Failed"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD COURSE CONTENT (FACULTY & ADMIN ONLY) */}
        {showUploadModal && canUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Upload Flight Courseware</h3>
                    <p className="text-[11px] text-slate-300">
                      Publish PDF manuals, cockpit checklists, or flight recordings
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Document / Syllabus Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DGCA CPL Radio Telephony Phraseology Guide"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <SearchableSelect
                      label="Aviation Course *"
                      value={newMaterial.courseName}
                      onChange={(val) => setNewMaterial({ ...newMaterial, courseName: val })}
                      options={[
                        { value: "Pilot Training", label: "Pilot Training (CPL)" },
                        { value: "BBA Aviation", label: "BBA Aviation Management" },
                        { value: "BSc Aviation", label: "BSc Aviation Science" },
                        { value: "Cabin Crew", label: "Cabin Safety & Crew" },
                      ]}
                      size="sm"
                    />
                  </div>

                  <div>
                    <SearchableSelect
                      label="Material Format *"
                      value={newMaterial.type}
                      onChange={(val) =>
                        setNewMaterial({ ...newMaterial, type: val as LMSContent["type"] })
                      }
                      options={[
                        { value: "manual", label: "Flight Manual (PDF)" },
                        { value: "notes", label: "Lecture Notes" },
                        { value: "video", label: "Simulator Video (MP4)" },
                        { value: "checklist", label: "Cockpit Checklist" },
                      ]}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newMaterial.uploadedBy}
                      onChange={(e) =>
                        setNewMaterial({ ...newMaterial, uploadedBy: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estimated Size
                    </label>
                    <input
                      type="text"
                      value={newMaterial.size}
                      onChange={(e) => setNewMaterial({ ...newMaterial, size: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-xs"
                  >
                    Publish to LMS
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { LMSContent, Quiz, QuizSubmission } from "@/lib/types";

export default function LMSPage() {
  const [activeTab, setActiveTab] = useState<"materials" | "quizzes" | "submissions" | "upload">("materials");
  const [materials, setMaterials] = useState<LMSContent[]>(store.getLMSContent());
  const [quizzes, setQuizzes] = useState<Quiz[]>(store.getQuizzes());
  const [submissions, setSubmissions] = useState<QuizSubmission[]>(store.getQuizSubmissions());

  // Interactive Quiz Taking State
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);

  // Upload Form State
  const [newMaterial, setNewMaterial] = useState({
    courseId: "7",
    courseName: "Pilot Training",
    title: "",
    type: "manual" as LMSContent["type"],
    fileUrl: "/content/aviation-sample.pdf",
    uploadedBy: "Capt. Vikram Malhotra",
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
      studentName: "Rajesh Kumar",
      score,
      totalMarks: selectedQuiz.totalMarks,
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      passed,
    });

    setSubmissions(store.getQuizSubmissions());
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addLMSContent(newMaterial);
    setMaterials(store.getLMSContent());
    setNewMaterial({
      courseId: "7",
      courseName: "Pilot Training",
      title: "",
      type: "manual",
      fileUrl: "/content/aviation-sample.pdf",
      uploadedBy: "Capt. Vikram Malhotra",
      uploadDate: new Date().toISOString().split("T")[0],
      size: "8.4 MB",
    });
    setActiveTab("materials");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-violet-950 via-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-violet-600/40 text-violet-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-violet-400/30">
                Irik.md Section 4.10
              </span>
              <h1 className="text-2xl font-bold mt-2">E-Learning & Aviation LMS Portal</h1>
              <p className="text-sm text-gray-300">
                Flight manuals, DGCA Ground School video lectures, navigation notes & interactive auto-grading quizzes
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedQuiz(null);
                  setActiveTab("materials");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "materials" && !selectedQuiz ? "bg-violet-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                📚 Study Materials ({materials.length})
              </button>
              <button
                onClick={() => {
                  setSelectedQuiz(null);
                  setActiveTab("quizzes");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "quizzes" || selectedQuiz ? "bg-violet-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                ✍️ Online Quizzes ({quizzes.length})
              </button>
              <button
                onClick={() => {
                  setSelectedQuiz(null);
                  setActiveTab("submissions");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "submissions" ? "bg-violet-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                🏆 Test Scores
              </button>
              <button
                onClick={() => {
                  setSelectedQuiz(null);
                  setActiveTab("upload");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "upload" ? "bg-violet-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                + Upload Content
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Study Materials */}
        {activeTab === "materials" && !selectedQuiz && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((m) => (
              <div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                      {m.courseName}
                    </span>
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                      {m.type === "video" ? "🎥 Video" : m.type === "manual" ? "📘 Manual" : "📄 " + m.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mt-2">{m.title}</h3>
                  <p className="text-xs text-gray-500 mt-2">
                    Uploaded by <span className="font-medium text-gray-700">{m.uploadedBy}</span> on {m.uploadDate}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-mono">{m.size}</span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading: ${m.title}`);
                    }}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition"
                  >
                    Download Resource →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Quizzes List & Live Quiz Taker */}
        {(activeTab === "quizzes" || selectedQuiz) && (
          <div>
            {!selectedQuiz ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((q) => (
                  <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs px-2.5 py-1 rounded bg-violet-50 text-violet-700 font-semibold">
                          {q.courseName}
                        </span>
                        <span className="text-xs bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded">
                          ⏱️ {q.durationMinutes} Minutes
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mt-2">{q.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {q.questions.length} Objective Questions • Total Marks: {q.totalMarks}
                      </p>
                    </div>
                    <div className="pt-4 mt-6 border-t flex justify-between items-center">
                      <span className="text-xs text-gray-500">Passing Grade: 60%</span>
                      <button
                        onClick={() => handleStartQuiz(q)}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
                      >
                        Start Test Now ⏱️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Live Quiz Taker */
              <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedQuiz.title}</h2>
                    <p className="text-xs text-gray-500">{selectedQuiz.courseName} • Total Marks: {selectedQuiz.totalMarks}</p>
                  </div>
                  <button
                    onClick={() => setSelectedQuiz(null)}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium px-3 py-1 bg-gray-100 rounded-lg"
                  >
                    ← Exit Quiz
                  </button>
                </div>

                {!quizResult ? (
                  <form onSubmit={handleSubmitQuiz} className="py-6 space-y-6">
                    {selectedQuiz.questions.map((q, qIdx) => (
                      <div key={q.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                        <p className="font-semibold text-gray-900 text-sm">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <label
                              key={optIdx}
                              className={`flex items-center p-3 rounded-lg border text-sm cursor-pointer transition ${
                                userAnswers[qIdx] === optIdx
                                  ? "bg-violet-50 border-violet-500 text-violet-900 font-medium"
                                  : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q_${qIdx}`}
                                checked={userAnswers[qIdx] === optIdx}
                                onChange={() => handleSelectOption(qIdx, optIdx)}
                                className="mr-3 text-violet-600 focus:ring-violet-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={Object.keys(userAnswers).length < selectedQuiz.questions.length}
                      className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl text-sm transition shadow"
                    >
                      Submit Answers & Auto-Grade Test
                    </button>
                  </form>
                ) : (
                  /* Quiz Result Screen */
                  <div className="py-8 text-center space-y-4">
                    <div
                      className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold ${
                        quizResult.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {quizResult.passed ? "✓" : "✗"}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {quizResult.passed ? "Congratulations! You Passed!" : "Test Needs Improvement"}
                    </h3>
                    <p className="text-base font-semibold text-gray-700">
                      Your Score: <span className="text-violet-700 text-xl font-bold">{quizResult.score}</span> / {quizResult.total} Marks
                    </p>
                    <p className="text-xs text-gray-500">
                      Your score has been officially logged to the student gradebook.
                    </p>
                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        onClick={() => setSelectedQuiz(null)}
                        className="px-6 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg"
                      >
                        Back to LMS Quizzes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Submissions */}
        {activeTab === "submissions" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Student Quiz Submissions & Auto-Graded Scores</h3>
              <p className="text-xs text-gray-500">Official log of DGCA theory test results and passing benchmarks</p>
            </div>
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold">Student Name</th>
                  <th className="px-6 py-3 font-semibold">Score</th>
                  <th className="px-6 py-3 font-semibold">Percentage</th>
                  <th className="px-6 py-3 font-semibold">Result</th>
                  <th className="px-6 py-3 font-semibold">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub) => {
                  const percent = Math.round((sub.score / sub.totalMarks) * 100);
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{sub.studentName}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{sub.score} / {sub.totalMarks}</td>
                      <td className="px-6 py-4">{percent}%</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            sub.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sub.passed ? "PASSED" : "FAILED"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{sub.submittedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Upload Content */}
        {activeTab === "upload" && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Upload Course Material</h3>
            <p className="text-xs text-gray-500 mb-5">Publish PDF flight notes, operating handbooks, or video links</p>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Document / Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DGCA CPL Radio Telephony Phraseology Guide"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Course</label>
                  <select
                    value={newMaterial.courseName}
                    onChange={(e) => setNewMaterial({ ...newMaterial, courseName: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  >
                    <option value="Pilot Training">Pilot Training (CPL)</option>
                    <option value="BBA Aviation">BBA Aviation Management</option>
                    <option value="BSc Aviation">BSc Aviation Technology</option>
                    <option value="Cabin Crew">Cabin Crew Training</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Material Type</label>
                  <select
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as LMSContent["type"] })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  >
                    <option value="manual">Manual / Handbook (PDF)</option>
                    <option value="notes">Lecture Notes</option>
                    <option value="video">Video Recording (MP4)</option>
                    <option value="checklist">Cockpit Checklist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Instructor Name</label>
                  <input
                    type="text"
                    required
                    value={newMaterial.uploadedBy}
                    onChange={(e) => setNewMaterial({ ...newMaterial, uploadedBy: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Estimated Size</label>
                  <input
                    type="text"
                    value={newMaterial.size}
                    onChange={(e) => setNewMaterial({ ...newMaterial, size: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-lg text-sm transition"
              >
                Upload & Publish to LMS
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

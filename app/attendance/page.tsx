"use client";

import { useState, useMemo } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { Attendance, Student } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import SearchableSelect from "@/components/SearchableSelect";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  Search,
  Filter,
  Download,
  Send,
  ShieldCheck,
  Plane,
  QrCode,
  BarChart3,
  UserCheck,
  Lock,
  User,
} from "lucide-react";

export default function AttendancePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isFaculty = user?.role === "faculty";
  const isStudent = user?.role === "student";

  const allStudents = store.getStudents();
  const courses = store.getCourses();
  const [attendance, setAttendance] = useState<Attendance[]>(store.getAttendance());

  // Resolve logged-in student
  const loggedInStudent = isStudent
    ? allStudents.find(
        (s) =>
          (user?.email && s.email.toLowerCase() === user.email.toLowerCase()) ||
          (user?.fullName && s.name.toLowerCase() === user.fullName.toLowerCase()) ||
          (user?.username && s.rollNo.toLowerCase() === user.username.toLowerCase()) ||
          (user?.username && s.name.toLowerCase().includes(user.username.toLowerCase()))
      ) || allStudents[0]
    : null;

  // Active Tab: if student, default to "analytics" or "history"
  const [activeTab, setActiveTab] = useState<"rollcall" | "analytics" | "history" | "kiosk">(
    isStudent ? "analytics" : "rollcall"
  );

  // Roll Call State (Faculty/Admin)
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "1");
  const [rollCallDate, setRollCallDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [sessionType, setSessionType] = useState<"Ground Theory" | "Flight Simulator" | "Solo Flight" | "Cabin Safety">("Ground Theory");
  const [rosterStatus, setRosterStatus] = useState<Record<string, "present" | "absent" | "late">>({});

  // Filters for analytics & history
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "present" | "absent" | "late">("all");
  const [filterDate, setFilterDate] = useState("");

  // Alert notification modal state
  const [alertModalStudent, setAlertModalStudent] = useState<{ student: Student; percentage: string } | null>(null);
  const [alertSuccessToast, setAlertSuccessToast] = useState<string | null>(null);

  // Kiosk Scanner Simulation State
  const [kioskStudentId, setKioskStudentId] = useState<string>(allStudents[0]?.id || "1");
  const [kioskStatusMessage, setKioskStatusMessage] = useState<string | null>(null);

  // Filter students list: if student role, only self
  const displayStudents = isStudent && loggedInStudent ? [loggedInStudent] : allStudents;

  // Relevant students for selected course
  const enrolledStudents = useMemo(() => {
    const course = courses.find((c) => c.id === selectedCourseId);
    if (!course) return displayStudents;
    const matched = displayStudents.filter((s) => s.course.toLowerCase().includes(course.name.toLowerCase().slice(0, 4)));
    return matched.length > 0 ? matched : displayStudents;
  }, [displayStudents, courses, selectedCourseId]);

  // Handle setting all in rollcall
  const handleSetAllStatus = (status: "present" | "absent" | "late") => {
    const next: Record<string, "present" | "absent" | "late"> = {};
    enrolledStudents.forEach((s) => {
      next[s.id] = status;
    });
    setRosterStatus(next);
  };

  // Toggle individual student
  const handleToggleStudent = (studentId: string, status: "present" | "absent" | "late") => {
    setRosterStatus((prev) => ({ ...prev, [studentId]: status }));
  };

  // Save Bulk Roll Call (Admin / Faculty only)
  const handleSaveRollCall = () => {
    if (isStudent) return;
    const recordsToSave = enrolledStudents.map((s) => ({
      studentId: s.id,
      courseId: selectedCourseId,
      date: rollCallDate,
      status: rosterStatus[s.id] || "present",
      semester: s.semester || 1,
    }));

    store.bulkAddAttendance(recordsToSave);
    setAttendance(store.getAttendance());
    setAlertSuccessToast(`Marked attendance for ${recordsToSave.length} cadets in ${sessionType}`);
    setTimeout(() => setAlertSuccessToast(null), 4000);
  };

  // Student Attendance Statistics
  const studentAttendanceStats = useMemo(() => {
    return displayStudents.map((student) => {
      const records = attendance.filter((a) => a.studentId === student.id);
      const present = records.filter((a) => a.status === "present").length;
      const late = records.filter((a) => a.status === "late").length;
      const absent = records.filter((a) => a.status === "absent").length;
      const total = records.length;
      const effectivePresent = present + late * 0.5;
      const percentage = total > 0 ? ((effectivePresent / total) * 100).toFixed(1) : "100.0";

      return { student, present, late, absent, total, percentage };
    });
  }, [displayStudents, attendance]);

  // Scoped Attendance Records
  const scopedAttendance = isStudent && loggedInStudent
    ? attendance.filter((a) => a.studentId === loggedInStudent.id)
    : attendance;

  // Overall KPIs
  const totalRecords = scopedAttendance.length;
  const presentRecords = scopedAttendance.filter((a) => a.status === "present").length;
  const lateRecords = scopedAttendance.filter((a) => a.status === "late").length;
  const absentRecords = scopedAttendance.filter((a) => a.status === "absent").length;
  const overallRate = totalRecords > 0 ? (((presentRecords + lateRecords * 0.5) / totalRecords) * 100).toFixed(1) : "95.0";
  const compliantCount = studentAttendanceStats.filter((s) => parseFloat(s.percentage) >= 75).length;
  const atRiskCount = studentAttendanceStats.filter((s) => parseFloat(s.percentage) < 75).length;

  // Filtered History
  const filteredHistory = useMemo(() => {
    return scopedAttendance.filter((a) => {
      const student = allStudents.find((s) => s.id === a.studentId);
      const course = courses.find((c) => c.id === a.courseId);

      const matchesSearch =
        !searchQuery ||
        student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student?.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse = filterCourse === "all" || a.courseId === filterCourse;
      const matchesStatus = filterStatus === "all" || a.status === filterStatus;
      const matchesDate = !filterDate || a.date === filterDate;

      return matchesSearch && matchesCourse && matchesStatus && matchesDate;
    });
  }, [scopedAttendance, allStudents, courses, searchQuery, filterCourse, filterStatus, filterDate]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = "Date,Roll No,Student Name,Course,Semester,Status\n";
    const rows = filteredHistory
      .map((a) => {
        const student = allStudents.find((s) => s.id === a.studentId);
        const course = courses.find((c) => c.id === a.courseId);
        return `"${a.date}","${student?.rollNo || ""}","${student?.name || ""}","${course?.name || ""}","${a.semester}","${a.status}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `IRIK_Attendance_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Toast */}
        {alertSuccessToast && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{alertSuccessToast}</span>
          </div>
        )}

        {/* Header Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold border border-indigo-400/30 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5" />
                  DGCA Flight & Ground Attendance System
                </span>
                {isAdmin ? (
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Admin Attendance Officer
                  </span>
                ) : isStudent ? (
                  <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-1 rounded-md font-medium border border-blue-500/30 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    Cadet Log: {loggedInStudent?.name} ({loggedInStudent?.rollNo})
                  </span>
                ) : (
                  <span className="bg-purple-500/20 text-purple-300 text-xs px-2.5 py-1 rounded-md font-medium border border-purple-500/30 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    Faculty Roll Call Mode
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {isStudent ? `Attendance Log: ${loggedInStudent?.name}` : "Attendance & Flight Line Check-In"}
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                {isStudent
                  ? "Track your DGCA 75% mandatory attendance compliance across flight simulators and ground classes."
                  : "Daily roll-call marking, real-time DGCA 75% threshold compliance monitoring, and automated low-attendance warnings."}
              </p>
            </div>

            {/* Navigation Tabs (Hide Roll Call & Kiosk for Student role) */}
            <div className="flex flex-wrap gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 shrink-0">
              {!isStudent && (
                <button
                  onClick={() => setActiveTab("rollcall")}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "rollcall"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Roll Call</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "analytics"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{isStudent ? "My DGCA Status" : "Compliance Audit"}</span>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "history"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Session Logs</span>
              </button>
              {!isStudent && (
                <button
                  onClick={() => setActiveTab("kiosk")}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "kiosk"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Gate Kiosk</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Metric KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isStudent ? "Overall Attendance" : "Overall Rate"}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{overallRate}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{totalRecords} logged sessions</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Present Sessions</p>
            <p className="text-2xl font-bold text-emerald-700 mt-2">{presentRecords}</p>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">Verified on-time</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Late Check-Ins</p>
            <p className="text-2xl font-bold text-amber-700 mt-2">{lateRecords}</p>
            <p className="text-[11px] text-amber-600/80 mt-0.5">0.5 session weightage</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">DGCA Compliance</p>
            <p className="text-2xl font-bold text-blue-700 mt-2">
              {parseFloat(overallRate) >= 75 ? "ELIGIBLE" : "AT RISK"}
            </p>
            <p className="text-[11px] text-blue-600/80 mt-0.5">Requirement: &gt; 75%</p>
          </div>
        </div>

        {/* TAB: COMPLIANCE AUDIT & STUDENT BREAKDOWN */}
        {activeTab === "analytics" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isStudent ? "My DGCA Attendance Breakdown" : "Cadet Attendance Breakdown & DGCA Eligibility"}
                </h3>
                <p className="text-xs text-slate-500">
                  Cadets falling below 75% are highlighted for DGCA flight simulator exam eligibility.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-5 py-3.5">Cadet</th>
                    <th className="px-4 py-3.5">Program</th>
                    <th className="px-4 py-3.5 text-center">Present</th>
                    <th className="px-4 py-3.5 text-center">Late</th>
                    <th className="px-4 py-3.5 text-center">Absent</th>
                    <th className="px-4 py-3.5 text-center">Total</th>
                    <th className="px-4 py-3.5 text-center">Rate (%)</th>
                    <th className="px-5 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {studentAttendanceStats.map((item) => {
                    const isCompliant = parseFloat(item.percentage) >= 75;

                    return (
                      <tr key={item.student.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          <p>{item.student.name}</p>
                          <p className="text-[11px] font-mono text-slate-400">{item.student.rollNo}</p>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-700">{item.student.course}</td>
                        <td className="px-4 py-3.5 text-center font-bold text-emerald-700">{item.present}</td>
                        <td className="px-4 py-3.5 text-center font-bold text-amber-700">{item.late}</td>
                        <td className="px-4 py-3.5 text-center font-bold text-rose-700">{item.absent}</td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-900">{item.total}</td>
                        <td className="px-4 py-3.5 text-center font-mono font-bold text-sm">
                          <span
                            className={`px-2.5 py-1 rounded-md border ${
                              isCompliant
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            {item.percentage}%
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {isCompliant ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Compliant
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              At Risk (&lt;75%)
                            </span>
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

        {/* TAB: SESSION LOGS */}
        {activeTab === "history" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Attendance Session Records</h3>
                <p className="text-xs text-slate-500">Historical logs of all attended lectures and simulator slots</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Cadet Name</th>
                    <th className="px-4 py-3.5">Course / Subject</th>
                    <th className="px-4 py-3.5">Semester</th>
                    <th className="px-5 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400 italic">
                        No session records logged for this account.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((a) => {
                      const student = allStudents.find((s) => s.id === a.studentId);
                      const course = courses.find((c) => c.id === a.courseId);

                      return (
                        <tr key={a.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-5 py-3.5 font-mono text-slate-900">{a.date}</td>
                          <td className="px-5 py-3.5 font-semibold text-slate-900">
                            {student?.name || "Cadet"}
                          </td>
                          <td className="px-4 py-3.5 text-slate-700">{course?.name || "Aviation Class"}</td>
                          <td className="px-4 py-3.5">Semester {a.semester}</td>
                          <td className="px-5 py-3.5 text-right">
                            {a.status === "present" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Present
                              </span>
                            ) : a.status === "late" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" /> Late
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                <XCircle className="w-3 h-3 text-rose-600" /> Absent
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ROLL CALL (Non-Student Only) */}
        {!isStudent && activeTab === "rollcall" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Interactive Flight & Lecture Roll Call</h3>
                <p className="text-xs text-slate-500">Record attendance for today's session</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSetAllStatus("present")}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition"
                >
                  Mark All Present
                </button>
                <button
                  onClick={handleSaveRollCall}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  Save Roll Call
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {enrolledStudents.map((s) => (
                <div key={s.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{s.name}</p>
                    <p className="text-[11px] text-slate-500">{s.rollNo}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleToggleStudent(s.id, "present")}
                      className={`px-2 py-1 rounded text-[11px] font-bold border transition ${
                        (rosterStatus[s.id] || "present") === "present"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      P
                    </button>
                    <button
                      onClick={() => handleToggleStudent(s.id, "late")}
                      className={`px-2 py-1 rounded text-[11px] font-bold border transition ${
                        rosterStatus[s.id] === "late"
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      L
                    </button>
                    <button
                      onClick={() => handleToggleStudent(s.id, "absent")}
                      className={`px-2 py-1 rounded text-[11px] font-bold border transition ${
                        rosterStatus[s.id] === "absent"
                          ? "bg-rose-600 text-white border-rose-600"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      A
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: GATE KIOSK (Non-Student Only) */}
        {!isStudent && activeTab === "kiosk" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-xl mx-auto space-y-4 text-center">
            <QrCode className="w-12 h-12 text-blue-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Airside & Aerodrome Gate Check-In Kiosk</h3>
            <p className="text-xs text-slate-500">Scan cadet RFID card or barcode to log immediate flight line entry</p>
            <div className="flex gap-2 items-center">
              <div className="flex-1 text-left">
                <SearchableSelect
                  value={kioskStudentId}
                  onChange={(val) => setKioskStudentId(val)}
                  options={allStudents.map((s) => ({
                    value: s.id,
                    label: `${s.name} (${s.rollNo})`,
                    sublabel: s.course,
                  }))}
                  size="sm"
                />
              </div>
              <button
                onClick={() => {
                  const s = allStudents.find((st) => st.id === kioskStudentId);
                  setKioskStatusMessage(`Verified gate entry for ${s?.name} (${s?.rollNo})`);
                  setTimeout(() => setKioskStatusMessage(null), 3000);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
              >
                Simulate Scan
              </button>
            </div>
            {kioskStatusMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{kioskStatusMessage}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

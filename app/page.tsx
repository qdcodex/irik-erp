"use client";

import { store } from "@/lib/store";
import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  GraduationCap,
  CreditCard,
  UserCheck,
  Calendar,
  Clock,
  Plane,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Send,
  Download,
  BookOpen,
  MapPin,
  User,
  Activity,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  FileCheck,
  BadgeCheck,
  HelpCircle,
  Laptop,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  // Data Sources
  const students = store.getStudents();
  const courses = store.getCourses();
  const fees = store.getFees();
  const admissions = store.getAdmissions();
  const timetables = store.getTimetables();
  const faculties = store.getFaculties();
  const assets = store.getAssets ? store.getAssets() : [];
  const auditLogs = store.getAuditLogs ? store.getAuditLogs() : [];
  const attendance = store.getAttendance ? store.getAttendance() : [];

  // Metrics Calculations
  const totalFeesPending = fees
    .filter((f) => f.status === "pending")
    .reduce((sum, f) => sum + f.amount, 0);

  const totalFeesCollected = fees
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);

  const pendingAdmissions = admissions.filter(
    (a) => a.status === "pending" || a.status === "under_review"
  ).length;

  const medicalClearedAdmissions = admissions.filter(
    (a) => a.status === "medical_verified"
  ).length;

  const enrolledAdmissions = admissions.filter(
    (a) => a.status === "approved"
  ).length;

  // Today's Date formatting
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayDateFormatted = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Today's Scheduled Slots (default to Monday/Friday for rich preview)
  const todaySlots = timetables
    .filter((t) => t.dayOfWeek === todayName || t.dayOfWeek === "Friday" || t.dayOfWeek === "Monday")
    .slice(0, 5);

  const getCourseName = (courseId: string) => {
    return courses.find((c) => c.id === courseId)?.name || "Aviation Class";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Executive Command Center Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold border border-indigo-400/30 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5" />
                  DGCA Approved Flight Training Organization
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  All Systems Operational
                </span>
                <span className="bg-slate-700/60 text-slate-300 text-xs px-2.5 py-1 rounded-md font-mono border border-slate-600/40">
                  FTO-2026/049
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {user?.fullName ? `Welcome, ${user.fullName}` : "Aviation Academy Command Center"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Master operational hub for flight simulator allocations, ground school syllabus, DGCA cadet admissions, and fee accounts.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href="/timetable"
                className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Flight Matrix</span>
              </Link>
              <Link
                href="/attendance"
                className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Attendance</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admissions"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Admissions CRM</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 4 High-Impact KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Cadets */}
          <Link
            href="/students"
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-sm transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Enrolled Cadets
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{students.length} Cadets</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +100%
                </span>
                <span>Active semester roster</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
              <span>View Cadets Directory</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
          </Link>

          {/* Card 2: Flight & Ground Sessions */}
          <Link
            href="/timetable"
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-sm transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Weekly Flight Slots
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
                <Plane className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{timetables.length} Sessions</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                <span className="text-indigo-600 font-semibold">SIM-01 & SIM-02</span>
                <span>Fully allocated</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
              <span>Inspect Timetable Matrix</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
          </Link>

          {/* Card 3: Admissions Pipeline */}
          <Link
            href="/admissions"
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-sm transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                Admissions Pipeline
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">{admissions.length} Applicants</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                <span className="text-amber-700 font-semibold">{pendingAdmissions} Pending</span>
                <span>• {medicalClearedAdmissions} Medically fit</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-amber-700 font-semibold">
              <span>Open Admissions CRM</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
          </Link>

          {/* Card 4: Fee Revenue & Accounts */}
          <Link
            href="/fees"
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-sm transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Fee Collection
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900">
                ₹{(totalFeesCollected / 100000).toFixed(1)}L
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                <span className="text-rose-600 font-semibold">
                  ₹{(totalFeesPending / 100000).toFixed(1)}L Due
                </span>
                <span>Term installments</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>View Fee Accounts</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
          </Link>
        </div>

        {/* Operational Center: Master Schedule & Admissions Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Master Flight & Ground Lecture Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Today's Flight & Ground Lecture Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  {todayName}, {todayDateFormatted} • Live Simulator & Aerodrome Bays
                </p>
              </div>
              <Link
                href="/timetable"
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>Full Weekly Matrix</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {todaySlots.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs italic">
                  No sessions scheduled for today.
                </div>
              ) : (
                todaySlots.map((slot) => {
                  const isSim = slot.classroom.includes("Simulator") || slot.classroom.includes("SIM");
                  const isFlight = slot.classroom.includes("Apron") || slot.classroom.includes("Flight");

                  return (
                    <div
                      key={slot.id}
                      className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                        isSim
                          ? "bg-indigo-50/60 border-indigo-200/80 hover:bg-indigo-50"
                          : isFlight
                          ? "bg-sky-50/60 border-sky-200/80 hover:bg-sky-50"
                          : "bg-slate-50/80 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-20 text-center p-2 rounded-lg bg-white border border-slate-200 shadow-2xs font-mono shrink-0">
                          <span className="text-xs font-bold text-slate-900 block">{slot.startTime}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{slot.endTime}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                              {slot.program}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              Sem {slot.semester}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 mt-1">
                            {getCourseName(slot.courseId)}
                          </h4>
                          <p className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{slot.classroom}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-center">
                        <div className="text-right text-xs">
                          <p className="font-semibold text-slate-900">{slot.instructor}</p>
                          <p className="text-[10px] text-slate-500">Instructor</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {slot.instructor.charAt(0)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right 1 Col: DGCA Candidate Admissions Pipeline */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    Admissions Pipeline
                  </h3>
                  <p className="text-xs text-slate-500">Recent Cadet Applications</p>
                </div>
                <Link
                  href="/admissions"
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3 pt-1">
                {admissions.slice(0, 4).map((adm) => (
                  <div
                    key={adm.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex justify-between items-center text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{adm.applicantName}</h4>
                      <p className="text-[11px] text-slate-500 truncate max-w-[170px]" title={adm.appliedCourse}>
                        {adm.appliedCourse}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {adm.marks ? `${adm.marks}% Merit` : "Direct"}
                        </span>
                        {adm.medicalFitnessStatus && (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {adm.medicalFitnessStatus}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Link
                        href="/admissions"
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded border border-slate-200 text-[11px] transition shadow-2xs block text-center"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/admissions"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg text-xs text-center transition block shadow-sm"
            >
              Open Candidate Intake Hub →
            </Link>
          </div>
        </div>

        {/* Fleet & Simulator Status + Dedicated Portal Launchpad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fleet & Simulator Airworthiness Status */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-indigo-600" />
                  Flight Fleet & Simulator Airworthiness Status
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time maintenance and DGCA compliance status for training aircraft & synthetic flight trainers
                </p>
              </div>
              <Link
                href="/assets"
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>Fleet Manager</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Device 1 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Flight Simulator SIM-01</h4>
                    <p className="text-[11px] text-slate-500 font-mono">Redbird FMX Motion Sim (VT-SIM-01)</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active & Airworthy
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Logged Simulator Hours:</span>
                    <span className="font-bold font-mono text-slate-900">1,420 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next DGCA Calibration:</span>
                    <span className="font-medium text-slate-700">15 Oct 2026</span>
                  </div>
                </div>
              </div>

              {/* Device 2 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Flight Simulator SIM-02</h4>
                    <p className="text-[11px] text-slate-500 font-mono">ALSIM ALX Multi-Engine Trainer</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active & Airworthy
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Logged Simulator Hours:</span>
                    <span className="font-bold font-mono text-slate-900">890 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next DGCA Calibration:</span>
                    <span className="font-medium text-slate-700">28 Nov 2026</span>
                  </div>
                </div>
              </div>

              {/* Device 3 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Cessna 172R Skyhawk</h4>
                    <p className="text-[11px] text-slate-500 font-mono">Tail: VT-IRK • Single Engine</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Flight Line Ready
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Total Airframe Hours:</span>
                    <span className="font-bold font-mono text-slate-900">3,120 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>100-Hr Mandatory Check:</span>
                    <span className="font-medium text-slate-700">Passed (Valid)</span>
                  </div>
                </div>
              </div>

              {/* Device 4 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Diamond DA42 Twin Star</h4>
                    <p className="text-[11px] text-slate-500 font-mono">Tail: VT-IRD • Multi Engine</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Scheduled Inspection
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Total Airframe Hours:</span>
                    <span className="font-bold font-mono text-slate-900">2,450 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AME Hangar Bay:</span>
                    <span className="font-medium text-amber-700">Hangar Bay 02</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Launchpad to Dedicated Portals */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Dedicated Role Portals
                </h3>
                <p className="text-xs text-slate-500">1-Click Fast Navigation</p>
              </div>

              <div className="space-y-2.5 pt-2">
                <Link
                  href="/student-portal"
                  className="p-3 bg-slate-50 hover:bg-blue-50/70 rounded-xl border border-slate-200 hover:border-blue-300 transition flex items-center justify-between group block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-700">
                        Student Self-Service Portal
                      </h4>
                      <p className="text-[10px] text-slate-500">Timetable, DGCA attendance & fee receipts</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  href="/parent-portal"
                  className="p-3 bg-slate-50 hover:bg-emerald-50/70 rounded-xl border border-slate-200 hover:border-emerald-300 transition flex items-center justify-between group block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                        Parent Guardian Portal
                      </h4>
                      <p className="text-[10px] text-slate-500">Attendance tracking & instant UPI fee payment</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  href="/instructor-portal"
                  className="p-3 bg-slate-50 hover:bg-indigo-50/70 rounded-xl border border-slate-200 hover:border-indigo-300 transition flex items-center justify-between group block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-700">
                        Flight Instructor Portal
                      </h4>
                      <p className="text-[10px] text-slate-500">Flight logs, simulator checklists & grading</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>IRIK ERP 2026 Enterprise Edition</span>
              </p>
              <p className="text-[10px] text-slate-300">
                Connected to DGCA eGCA flight ops API sync.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

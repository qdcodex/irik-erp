"use client";

import Link from "next/link";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth-context";
import {
  GraduationCap,
  CreditCard,
  Calendar,
  Clock,
  BookOpen,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  Plane,
  BadgeCheck,
} from "lucide-react";

export default function StudentPortalPage() {
  const { user } = useAuth();
  const allStudents = store.getStudents();

  // Find exact logged-in student by email, fullName, or username
  const student =
    allStudents.find(
      (s) =>
        (user?.email && s.email.toLowerCase() === user.email.toLowerCase()) ||
        (user?.fullName && s.name.toLowerCase() === user.fullName.toLowerCase()) ||
        (user?.username && s.rollNo.toLowerCase() === user.username.toLowerCase()) ||
        (user?.username && s.name.toLowerCase().includes(user.username.toLowerCase()))
    ) || allStudents[0];

  const fees = store.getFeesByStudent(student.id);
  const attendance = store.getAttendanceByStudent(student.id);
  const timetables = store
    .getTimetables()
    .filter((t) => t.program.toLowerCase() === student.course.toLowerCase() || t.semester === student.semester)
    .slice(0, 4);

  const materials = store.getLMSContent().slice(0, 3);
  const idCard = store.getIDCardByOwner(student.id) || store.getIDCards().find((c) => c.ownerId === student.id) || store.getIDCards()[0];

  const pendingFee = fees.find((f) => f.status === "pending")?.amount || 0;
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 94;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-indigo-400 flex items-center justify-center text-xl font-bold text-white shadow-sm">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider font-bold border border-indigo-400/30 flex items-center gap-1">
                    <Plane className="w-3 h-3" />
                    Student Self-Service Dossier
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded font-medium border border-emerald-500/30 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3 text-emerald-400" />
                    Active Cadet
                  </span>
                </div>
                <h1 className="text-2xl font-bold mt-1 text-white">{student.name}</h1>
                <p className="text-xs text-slate-300">
                  {student.course} • Semester {student.semester} • Roll: <span className="font-mono font-bold text-amber-300">{student.rollNo}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/id-cards"
                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                <span>My ID Card</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Today's Timetable Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Next Classes
              </span>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Semester {student.semester}
              </span>
            </div>
            <div className="space-y-2 pt-1">
              {timetables.length > 0 ? (
                timetables.slice(0, 2).map((t) => (
                  <div key={t.id} className="p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-100">
                    <p className="font-bold text-slate-900 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {t.startTime} - {t.endTime} ({t.dayOfWeek})
                    </p>
                    <p className="text-slate-600 mt-0.5">{t.classroom} • {t.instructor}</p>
                  </div>
                ))
              ) : (
                <div className="p-2.5 bg-blue-50/70 rounded-lg text-xs">
                  <p className="font-bold text-blue-950">09:00 - 10:30 AM</p>
                  <p className="text-blue-800">Ground School: Aviation Meteorology</p>
                </div>
              )}
            </div>
            <Link
              href="/timetable"
              className="text-xs text-blue-600 font-bold flex items-center gap-1 pt-1 hover:text-blue-700"
            >
              <span>Full Timetable View</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Attendance Gauge */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  My Attendance Rate
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  DGCA &gt;75%
                </span>
              </div>
              <div className="flex items-baseline space-x-2 mt-3">
                <span className="text-4xl font-black text-emerald-600">{attendanceRate}%</span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Eligible for Exams
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Present in {presentCount} of {attendance.length || 20} logged flight & ground sessions
              </p>
            </div>
            <Link
              href="/attendance"
              className="text-xs text-blue-600 font-bold flex items-center gap-1 pt-3 hover:text-blue-700"
            >
              <span>Detailed Attendance History</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Fee Balance & Pay */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                  Fee Dues
                </span>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Due: 30 Sep 2026
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-3">
                ₹{pendingFee > 0 ? pendingFee.toLocaleString() : "0"}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {pendingFee > 0 ? "Semester tuition & flight sim installment" : "All current semester dues cleared"}
              </p>
            </div>
            <Link
              href="/fees"
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-xs text-center transition shadow-sm block"
            >
              Pay Fee Online via Portal →
            </Link>
          </div>
        </div>

        {/* E-Learning Quick Access & ID Badge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* E-Learning Highlights */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Course Study Materials & Manuals
              </h3>
              <Link href="/lms" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
                <span>View All LMS</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {materials.map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900">{m.title}</h4>
                    <p className="text-[10px] text-slate-500">{m.uploadedBy} • {m.size}</p>
                  </div>
                  <button className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded border border-indigo-200 transition flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Digital ID Badge Quick Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-xl shadow-sm p-5 text-white flex flex-col justify-between border border-slate-800">
            <div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-amber-400">IRIK AVIATION ACADEMY</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono font-bold border border-white/20">
                  STUDENT BADGE
                </span>
              </div>
              <div className="py-4 flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-xl border-2 border-amber-300 shadow-sm">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">{student.name}</h4>
                  <p className="text-xs font-mono text-amber-300">{student.rollNo}</p>
                  <p className="text-xs text-slate-300">{student.course}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{student.email} • {student.phone}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-[11px] text-slate-400">Blood Group: O+ | Valid: 2028</span>
              <Link
                href="/id-cards"
                className="text-xs text-amber-300 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Full Digital ID</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

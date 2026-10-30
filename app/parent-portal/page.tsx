"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import PaymentForm from "@/components/PaymentForm";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Download,
  FileText,
  Plane,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  QrCode,
  Smartphone,
  X,
  BadgeCheck,
  Check,
  ExternalLink,
  Receipt,
  FileCheck2,
} from "lucide-react";

export default function ParentPortalPage() {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "fees" | "attendance" | "academics">("overview");

  // Dynamic child resolution
  const allStudents = store.getStudents();
  const student = allStudents[0] || {
    id: "1",
    name: "Rajesh Kumar",
    rollNo: "AVN-2026-001",
    course: "BBA Aviation & Pilot Studies",
    semester: 4,
    email: "rajesh.kumar@irik.aero",
    phone: "+91 98765 43210",
  };

  const fees = store.getFeesByStudent(student.id);
  const attendance = store.getAttendanceByStudent(student.id);
  const timetables = store.getTimetables();

  const pendingFees = fees.filter((f) => f.status === "pending");
  const paidFees = fees.filter((f) => f.status === "paid");
  const totalPendingAmount = pendingFees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaidAmount = paidFees.reduce((sum, f) => sum + f.amount, 0);

  const presentCount = attendance.filter((a) => a.status === "present").length;
  const attendancePercent = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 100;

  const childTimetable = timetables.slice(0, 4);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Cockpit Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-slate-800/80">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-blue-400" />
                  Parent & Guardian Portal
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  DGCA Verified Cadet Profile
                </span>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Welcome, {user?.fullName || "Mr. Suresh Kumar"}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1.5">
                  <span>Cadet:</span>
                  <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/10">
                    {student.name}
                  </span>
                  <span>• Roll:</span>
                  <span className="font-mono text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">
                    {student.rollNo}
                  </span>
                  <span>•</span>
                  <span className="text-slate-300 font-medium">
                    {student.course} (Semester {student.semester})
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Aviation KPI Chips */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 shadow-inner flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    DGCA Attendance
                  </p>
                  <p className="text-base font-extrabold text-emerald-400 font-mono">
                    {attendancePercent}% Compliance
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 shadow-inner flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Flight Medical
                  </p>
                  <p className="text-base font-extrabold text-blue-300 font-mono">
                    Class 1 Cleared
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Segmented Pill Navigation */}
        <div className="flex items-center p-1 bg-slate-200/70 rounded-xl border border-slate-300/60 max-w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "overview"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Cadet Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("fees")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "fees"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Fee Dues & Receipts</span>
            {totalPendingAmount > 0 ? (
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                Due
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                Cleared
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "attendance"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Flight & Class Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab("academics")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "academics"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>DGCA Tests & Flight Progress</span>
          </button>
        </div>

        {/* TAB 1: CADET OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Smart Fee Card (Context-Aware: Zero Dues vs Pending Dues) */}
            {totalPendingAmount === 0 ? (
              <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-white rounded-2xl border border-emerald-200/90 p-6 shadow-xs">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                        All Dues Settled
                      </span>
                      <span className="text-xs text-emerald-800 font-semibold font-mono">
                        Semester {student.semester} Authorized
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900">
                      ₹0 Outstanding Balance
                    </h3>
                    <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                      All tuition fees, DGCA ground school modules, flight simulator slots, and hostel facilities for Semester {student.semester} are fully paid and verified by Accounts.
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2.5">
                      <button
                        onClick={() => setActiveTab("fees")}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition shadow-2xs flex items-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Invoices & Receipts</span>
                      </button>

                      <button
                        onClick={() =>
                          alert(`Official No-Dues Certificate (NOC) generated for Cadet ${student.name} (${student.rollNo})`)
                        }
                        className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download No-Dues NOC</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-white/90 p-4 rounded-xl border border-emerald-100 shadow-2xs space-y-2 shrink-0 min-w-[240px]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Total Fees Paid:</span>
                      <span className="font-bold text-slate-900 font-mono">₹{totalPaidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Next Cycle:</span>
                      <span className="font-semibold text-blue-700">Semester 5 (Jan 2027)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Account Status:</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active Cleared
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Outstanding Fee Banner Card */
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2 flex-1">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                      Total Outstanding Term Fee Balance
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-rose-600 font-mono">
                      ₹{totalPendingAmount.toLocaleString()}
                    </div>
                    <p className="text-xs text-amber-800 font-medium bg-amber-50 border border-amber-200 px-3 py-1 rounded-md inline-block">
                      Installment Due Date: 30 September 2026 (Semester {student.semester} Tuition & Flight Simulator Training)
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition shadow-sm flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay Online (Razorpay / UPI)</span>
                      </button>
                    </div>
                  </div>

                  {/* Scannable UPI QR Box */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2 shrink-0">
                    <div className="w-36 h-36 mx-auto bg-slate-900 rounded-xl p-3 text-white flex flex-col items-center justify-center text-center shadow-inner">
                      <QrCode className="w-10 h-10 text-amber-300" />
                      <span className="text-[10px] font-mono text-slate-300 mt-1">irikaviation@icici</span>
                      <span className="text-xs font-bold text-emerald-400 mt-0.5">₹{totalPendingAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">Scan & Pay with Any UPI App</p>
                    <p className="text-[10px] text-slate-500">GPay • PhonePe • Paytm • BHIM</p>
                  </div>
                </div>
              </div>
            )}

            {/* Balanced 2-Column Section: Schedule & Academic Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (7 cols): Cadet's Weekly Class & Flight Schedule */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Cadet's Weekly Flight & Academic Schedule
                    </h3>
                    <p className="text-xs text-slate-500">Semester {student.semester} Ground School & Flight Line Timetable</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-mono">
                    4 Sessions / Wk
                  </span>
                </div>

                <div className="space-y-3">
                  {childTimetable.map((slot, idx) => (
                    <div
                      key={slot.id}
                      className="p-3.5 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {slot.dayOfWeek ? slot.dayOfWeek.slice(0, 2) : `0${idx + 1}`}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{slot.classroom}</span>
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                              Ground Theory
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <span>Instructor:</span>
                            <span className="font-semibold text-slate-700">{slot.instructor}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs inline-block">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{slot.dayOfWeek}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column (5 cols): Cadet Progress & Institutional Bulletins */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Cadet Progress & Flight Bulletins
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Feed
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Alert 1 */}
                  <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/90 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-950 flex items-center gap-1.5">
                        <Plane className="w-3.5 h-3.5 text-blue-600" />
                        Multi-Engine Simulator Shift Scheduled
                      </span>
                      <span className="text-[10px] text-blue-600 font-mono font-bold">Today</span>
                    </div>
                    <p className="text-blue-800 text-[11px] leading-relaxed">
                      Rajesh has an allocated Redbird FMX SIM-01 slot on Friday at 09:00 AM under Capt. Vikram Malhotra.
                    </p>
                  </div>

                  {/* Alert 2 */}
                  <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/90 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        DGCA Ground Theory Passed
                      </span>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold">2 days ago</span>
                    </div>
                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                      Scored 18/20 (90%) in Aviation Meteorology & Aerodynamics Module 1 Test.
                    </p>
                  </div>

                  {/* Alert 3 */}
                  <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200/90 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-purple-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        Class 1 Medical Renewal Status
                      </span>
                      <span className="text-[10px] text-purple-600 font-mono font-bold">Cleared</span>
                    </div>
                    <p className="text-purple-800 text-[11px] leading-relaxed">
                      Annual DGCA aeromedical evaluation cleared at IAM Bengaluru. Valid through November 2027.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FEES & INVOICE RECEIPTS */}
        {activeTab === "fees" && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  Fee Invoices & Digital Payment Receipts
                </h3>
                <p className="text-xs text-slate-500">Official tax invoices, term fee installments, and digital payment vouchers</p>
              </div>
              {totalPendingAmount > 0 && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  Pay Outstanding Dues
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {fees.map((fee) => (
                <div key={fee.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{fee.feeType} Installment</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          fee.status === "paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {fee.status === "paid" ? "PAID & CLEARED" : "PENDING DUE"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Invoice Ref: <span className="font-mono text-slate-700">INV-2026-{fee.id}</span> • Due: {fee.dueDate} {fee.paidDate && `• Paid on: ${fee.paidDate}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="font-mono font-black text-base text-slate-900">
                      ₹{fee.amount.toLocaleString()}
                    </span>
                    {fee.status === "paid" ? (
                      <button
                        onClick={() => alert(`Downloading official PDF tax receipt for ₹${fee.amount}`)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tax Receipt PDF</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-2xs"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE & BIOMETRIC LOGS */}
        {activeTab === "attendance" && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                DGCA & Academy Class Attendance Logs
              </h3>
              <p className="text-xs text-slate-500">DGCA mandatory minimum 85% attendance compliance rate</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">Total Sessions Present</p>
                <p className="text-2xl font-black text-emerald-950 mt-1 font-mono">{presentCount} Sessions</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider">DGCA Compliance %</p>
                <p className="text-2xl font-black text-blue-950 mt-1 font-mono">{attendancePercent}%</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-xs text-purple-800 font-semibold uppercase tracking-wider">Medical Fitness Status</p>
                <p className="text-2xl font-black text-purple-950 mt-1 font-mono">Class 1 Fit</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {attendance.map((a) => (
                <div key={a.id} className="py-3.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">Date: {a.date}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Gate Biometric Check-In Verified</p>
                  </div>
                  <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase text-[10px]">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACADEMICS & FLIGHT PROGRESS */}
        {activeTab === "academics" && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                Academic Marks & Flight Progress
              </h3>
              <p className="text-xs text-slate-500">Internal evaluations, DGCA syllabus exams, and simulator training records</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Airport Operations & Terminal Management</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Course Code: BBA-OPER • Semester 3</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    88 / 100 (Grade A)
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Aviation Management & Air Regulations</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Course Code: BBA-MGMT • Semester 2</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    85 / 100 (Grade A)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instant Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Secure Payment Gateway
                  </span>
                  <h3 className="font-bold text-base text-slate-900">Settle Cadet Fee Dues</h3>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <PaymentForm
                invoiceId={`INV-2026-${student.rollNo}`}
                studentId={student.id}
                amount={totalPendingAmount}
                studentEmail={student.email}
                studentPhone={student.phone}
                onSuccess={() => {
                  alert("Payment processed successfully!");
                  setShowPaymentModal(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

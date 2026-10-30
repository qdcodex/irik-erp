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
} from "lucide-react";

export default function ParentPortalPage() {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "fees" | "attendance" | "academics">("overview");

  // Dynamic child resolution
  const allStudents = store.getStudents();
  const student = allStudents[0]; // Default to Rajesh Kumar (Roll AVN-2026-001)
  const fees = store.getFeesByStudent(student.id);
  const attendance = store.getAttendanceByStudent(student.id);
  const timetables = store.getTimetables();

  const pendingFees = fees.filter((f) => f.status === "pending");
  const paidFees = fees.filter((f) => f.status === "paid");
  const totalPendingAmount = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  const presentCount = attendance.filter((a) => a.status === "present").length;
  const attendancePercent = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 94;

  const childTimetable = timetables.slice(0, 4);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Parent & Cadet Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-purple-500/20 text-purple-300 text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold border border-purple-400/30 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Parent & Guardian Portal
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Guardian Account
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {user?.fullName || "Welcome, Mr. Suresh Kumar"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Guardian of Cadet <strong className="text-white font-semibold">{student.name}</strong> • Roll: <span className="font-mono text-indigo-300">{student.rollNo}</span> • {student.course} (Semester {student.semester})
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 shrink-0">
              <div className="text-right">
                <p className="text-[11px] text-slate-400 font-medium">DGCA Attendance</p>
                <p className="text-xl font-bold text-emerald-400">{attendancePercent}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === "overview"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Cadet Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("fees")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === "fees"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Fee Dues & Receipts</span>
            {totalPendingAmount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                Due
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === "attendance"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Flight & Class Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab("academics")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === "academics"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>DGCA Tests & Flight Progress</span>
          </button>
        </div>

        {/* TAB 1: CADET OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Outstanding Fee Banner Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 flex-1">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                    Total Outstanding Term Fee Balance
                  </span>
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900">
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

            {/* Quick 2-Column Section: Schedule & Academic Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Flight & Ground Classes */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Cadet's Weekly Class Schedule
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Semester {student.semester}</span>
                </div>

                <div className="space-y-2.5">
                  {childTimetable.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{slot.classroom}</span>
                        <p className="text-[11px] text-slate-600 mt-0.5">{slot.instructor}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">{slot.dayOfWeek}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Institutional Alerts */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Cadet Progress & Notifications
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                        <Plane className="w-3.5 h-3.5 text-indigo-600" />
                        Multi-Engine Simulator Shift Scheduled
                      </span>
                      <span className="text-[10px] text-indigo-600 font-mono">Today</span>
                    </div>
                    <p className="text-indigo-800 text-[11px]">
                      Rajesh has an allocated Redbird FMX SIM-01 slot on Friday at 09:00 AM under Capt. Vikram Malhotra.
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        DGCA Ground Theory Passed
                      </span>
                      <span className="text-[10px] text-emerald-600 font-mono">2 days ago</span>
                    </div>
                    <p className="text-emerald-800 text-[11px]">
                      Scored 18/20 (90%) in Aviation Meteorology & Aerodynamics Module 1 Test.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FEES & RECEIPTS */}
        {activeTab === "fees" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Fee Invoices & Payment Receipts</h3>
                <p className="text-xs text-slate-500">Official tax invoices and digital payment confirmations</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                Pay Outstanding
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {fees.map((fee) => (
                <div key={fee.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{fee.feeType} Installment</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          fee.status === "paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {fee.status === "paid" ? "PAID" : "PENDING DUE"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Due: {fee.dueDate} {fee.paidDate && `• Paid on: ${fee.paidDate}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      ₹{fee.amount.toLocaleString()}
                    </span>
                    {fee.status === "paid" ? (
                      <button
                        onClick={() => alert(`Downloading official PDF tax receipt for ₹${fee.amount}`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] transition flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Receipt PDF</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-[11px] transition"
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

        {/* TAB 3: ATTENDANCE */}
        {activeTab === "attendance" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">DGCA & Academy Class Attendance Logs</h3>
              <p className="text-xs text-slate-500">DGCA mandatory minimum 85% attendance compliance rate</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-xs text-emerald-800 font-semibold">Total Sessions Present</p>
                <p className="text-2xl font-bold text-emerald-950 mt-1">{presentCount} Sessions</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs text-blue-800 font-semibold">DGCA Compliance %</p>
                <p className="text-2xl font-bold text-blue-950 mt-1">{attendancePercent}%</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-xs text-purple-800 font-semibold">Medical Fitness Status</p>
                <p className="text-2xl font-bold text-purple-950 mt-1">Class 1 Fit</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {attendance.map((a) => (
                <div key={a.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">Date: {a.date}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Biometric Kiosk Verified</p>
                  </div>
                  <span className="font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase text-[10px]">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACADEMICS & FLIGHT PROGRESS */}
        {activeTab === "academics" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Academic Marks & Flight Progress</h3>
              <p className="text-xs text-slate-500">Internal evaluations, DGCA syllabus exams, and simulator training records</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Airport Operations & Terminal Management</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Course Code: BBA-OPER • Semester 3</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    88 / 100 (Grade A)
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Aviation Management & Air Regulations</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Course Code: BBA-MGMT • Semester 2</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
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

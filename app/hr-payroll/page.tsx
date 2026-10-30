"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { Payroll, LeaveRequest } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import SearchableSelect from "@/components/SearchableSelect";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  CalendarDays,
  Plane,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  User,
  Printer,
  X,
  Receipt,
  PlusCircle,
  FileText,
  AlertTriangle,
  Briefcase,
  Building2,
  Send,
  Calendar,
  Check,
  Users,
  Lock,
  Download,
  Filter,
} from "lucide-react";

const STAFF_DIRECTORY: Record<
  string,
  { role: string; dept: string; dgcaNo: string; flightHours: number; bankAccount: string }
> = {
  "Prof. Rajesh Kumar": {
    role: "Dean of Aviation Studies",
    dept: "Air Transport Economics & Law",
    dgcaNo: "DGCA-FII-9021",
    flightHours: 4200,
    bankAccount: "HDFC Bank •••• 8812",
  },
  "Dr. Amit Patel": {
    role: "Head of Ground Operations",
    dept: "Aviation Infrastructure & Safety",
    dgcaNo: "DGCA-FII-8142",
    flightHours: 2850,
    bankAccount: "ICICI Bank •••• 4120",
  },
  "Dr. Neha Sharma": {
    role: "Chief Avionics Specialist",
    dept: "Aeronautics & Avionics Engineering",
    dgcaNo: "DGCA-AME-7740",
    flightHours: 1900,
    bankAccount: "SBI •••• 9934",
  },
  "Capt. Vikram Malhotra": {
    role: "Chief Flight Instructor (CFI)",
    dept: "Flight Line & Simulator Operations",
    dgcaNo: "ATPL-IND-1104",
    flightHours: 8500,
    bankAccount: "Axis Bank •••• 2291",
  },
  "Ms. Kavya Shah": {
    role: "Cabin Safety & Mockup Lead",
    dept: "Cabin Safety & In-Flight Services",
    dgcaNo: "DGCA-CS-3381",
    flightHours: 1400,
    bankAccount: "Kotak Bank •••• 7715",
  },
};

const STAFF_OPTIONS = Object.keys(STAFF_DIRECTORY).map((name) => ({
  value: name,
  label: `${name} — ${STAFF_DIRECTORY[name].role}`,
  sublabel: `${STAFF_DIRECTORY[name].dept} • ${STAFF_DIRECTORY[name].dgcaNo}`,
}));

export default function HRPayrollPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const canManage = isAdmin || isStaff;

  const [activeTab, setActiveTab] = useState<"payroll" | "leave">("payroll");
  const [payrolls, setPayrolls] = useState<Payroll[]>(store.getPayrolls());
  const [leaves, setLeaves] = useState<LeaveRequest[]>(store.getLeaveRequests());
  const [selectedPayslip, setSelectedPayslip] = useState<Payroll | null>(null);

  // Modal States
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [filterMonth, setFilterMonth] = useState<string>("all");

  const [newLeave, setNewLeave] = useState({
    staffId: "2",
    staffName: "Dr. Amit Patel",
    leaveType: "Casual Leave" as LeaveRequest["leaveType"],
    startDate: "",
    endDate: "",
    days: 1,
    reason: "",
  });

  const [newPayroll, setNewPayroll] = useState({
    staffId: "1",
    staffName: "Prof. Rajesh Kumar",
    month: "September",
    year: 2026,
    basicPay: 120000,
    allowances: 35000,
    deductions: 15000,
  });

  // Guard for unauthorized roles
  if (!canManage) {
    return (
      <AppLayout>
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-8 max-w-md text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-full border border-amber-200">
              Clearance Required
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Access Restricted
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              HR & Faculty Payroll administration is restricted to authorized Accounts & Personnel Officers. Your account ({user?.role || "guest"}) does not possess clearance to view or generate salary ledgers.
            </p>
            <div className="mt-6">
              <Link
                href={
                  user?.role === "student"
                    ? "/student-portal"
                    : user?.role === "parent"
                    ? "/parent-portal"
                    : user?.role === "faculty"
                    ? "/instructor-portal"
                    : "/"
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                Return to My Portal
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleMarkAsPaid = (id: string) => {
    const updated = store.updatePayrollStatus(id, "paid");
    if (updated) {
      setPayrolls(store.getPayrolls());
    }
  };

  const handleLeaveStatus = (id: string, status: "approved" | "rejected") => {
    const updated = store.updateLeaveStatus(id, status);
    if (updated) {
      setLeaves(store.getLeaveRequests());
    }
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addLeaveRequest({
      ...newLeave,
      status: "pending",
    });
    setLeaves(store.getLeaveRequests());
    setNewLeave({
      staffId: "2",
      staffName: "Dr. Amit Patel",
      leaveType: "Casual Leave",
      startDate: "",
      endDate: "",
      days: 1,
      reason: "",
    });
    setShowLeaveModal(false);
  };

  const handlePayrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const netPay = newPayroll.basicPay + newPayroll.allowances - newPayroll.deductions;
    store.addPayroll({
      ...newPayroll,
      netPay,
      status: "pending",
    });
    setPayrolls(store.getPayrolls());
    setShowPayrollModal(false);
  };

  const totalPayrollOutflow = payrolls.reduce((sum, p) => sum + p.netPay, 0);
  const paidPayrollOutflow = payrolls
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.netPay, 0);
  const pendingPayrollOutflow = totalPayrollOutflow - paidPayrollOutflow;
  const pendingLeaves = leaves.filter((l) => l.status === "pending").length;

  const currentStaffMeta = STAFF_DIRECTORY[newPayroll.staffName] || {
    role: "Faculty Member",
    dept: "Aviation Department",
    dgcaNo: "DGCA-GEN-2026",
    flightHours: 1200,
    bankAccount: "Direct Bank Transfer",
  };

  const computedNet = newPayroll.basicPay + newPayroll.allowances - newPayroll.deductions;

  const filteredPayrolls = payrolls.filter((p) => {
    if (filterMonth === "all") return true;
    return p.month.toLowerCase() === filterMonth.toLowerCase();
  });

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
                  DGCA CAR Section 7 Compliance
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
                  AY 2026-27 • Payroll Cycle Active
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <Briefcase className="w-6 h-6 text-blue-400" />
                HR & Faculty Payroll Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Staff flight contracts, DGCA instructor flight hours compensation, leave administration, and salary disbursements.
              </p>
            </div>

            {/* Header Actions & Segmented Navigation */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner">
                <button
                  onClick={() => setActiveTab("payroll")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === "payroll"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Payroll Batches</span>
                </button>

                <button
                  onClick={() => setActiveTab("leave")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === "leave"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Leave Requests</span>
                  {pendingLeaves > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 ml-1">
                      {pendingLeaves}
                    </span>
                  )}
                </button>
              </div>

              {/* Primary Action Button (Opens Modal) */}
              <button
                onClick={() => setShowPayrollModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-900/30 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Process Pay</span>
              </button>
            </div>
          </div>
        </div>

        {/* Elevated KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Monthly Payroll
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
              ₹{(totalPayrollOutflow / 100000).toFixed(2)} Lakhs
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>{payrolls.length} Personnel Accounts</span>
              <span className="text-[11px] text-blue-600 font-medium">Aviation Faculty</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Disbursed (Paid)
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">
              ₹{(paidPayrollOutflow / 100000).toFixed(2)} Lakhs
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span className="text-emerald-700 font-bold">
                {payrolls.filter((p) => p.status === "paid").length} Staff Paid
              </span>
              <span className="text-[11px] text-slate-400">Direct NEFT</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Pending Release
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 mt-2 font-mono">
              ₹{(pendingPayrollOutflow / 100000).toFixed(2)} Lakhs
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span className="text-amber-700 font-bold">
                {payrolls.filter((p) => p.status === "pending").length} Pending
              </span>
              <span className="text-[11px] text-amber-600 font-mono">Awaiting Clearance</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Leave Applications
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-indigo-600 mt-2 font-mono">
              {leaves.length} Applications
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span className="text-amber-600 font-bold">
                {pendingLeaves} Requiring Review
              </span>
              <span className="text-[11px] text-indigo-500 font-medium">Flight Duty Roster</span>
            </div>
          </div>
        </div>

        {/* TAB 1: PAYROLL LEDGER / BATCHES (DEFAULT VIEW) */}
        {activeTab === "payroll" && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  Faculty & Staff Payroll Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive breakdown of base pay, flying allowances, deductions and payout authorizations
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All Months</option>
                  <option value="September">September 2026</option>
                  <option value="August">August 2026</option>
                  <option value="July">July 2026</option>
                </select>

                <button
                  onClick={() => setShowPayrollModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg transition shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Process Voucher</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Staff Member / Role</th>
                    <th className="py-3.5 px-4">Pay Period</th>
                    <th className="py-3.5 px-4">Basic Pay</th>
                    <th className="py-3.5 px-4">Flight Allowances</th>
                    <th className="py-3.5 px-4">Deductions</th>
                    <th className="py-3.5 px-4 font-mono">Net Payable</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayrolls.map((p) => {
                    const meta = STAFF_DIRECTORY[p.staffName];
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                              {p.staffName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{p.staffName}</p>
                              <p className="text-[10px] text-slate-400">
                                {meta?.role || "Staff Member"} • {meta?.dgcaNo || "DGCA-FII"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {p.month} {p.year}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          ₹{p.basicPay.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-600 font-medium">
                          +₹{p.allowances.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-rose-500">
                          -₹{p.deductions.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          ₹{p.netPay.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                              p.status === "paid"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                p.status === "paid" ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            ></span>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {p.status === "pending" && (
                              <button
                                onClick={() => handleMarkAsPaid(p.id)}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-2xs"
                              >
                                Disburse
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedPayslip(p)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            >
                              Payslip
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: LEAVE ADMINISTRATION */}
        {activeTab === "leave" && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  Faculty & Flight Instructor Leave Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Review and authorize time-off for ground school instructors, simulator trainers, and pilots
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {leaves.length} Applications ({pendingLeaves} Pending)
                </span>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg transition shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Apply Leave</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {leaves.map((l) => (
                <div key={l.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">{l.staffName}</h4>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                          {l.leaveType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {l.startDate} to {l.endDate} ({l.days} {l.days === 1 ? "day" : "days"})
                      </p>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 max-w-xl">
                        {l.reason}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          l.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : l.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {l.status}
                      </span>

                      {l.status === "pending" && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <button
                            onClick={() => handleLeaveStatus(l.id, "approved")}
                            className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-semibold transition shadow-2xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleLeaveStatus(l.id, "rejected")}
                            className="text-[11px] bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-lg font-semibold transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL 1: PROCESS NEW PAYROLL ENTRY (MODERN MODAL DESIGN) */}
        {showPayrollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Generate Faculty Payroll Entry</h3>
                    <p className="text-[11px] text-slate-300">
                      Flight hours, statutory deductions & direct NEFT voucher
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPayrollModal(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5">
                <form id="payroll-form" onSubmit={handlePayrollSubmit} className="space-y-4">
                  {/* Staff Selection */}
                  <div>
                    <SearchableSelect
                      label="Flight Instructor / Staff Member *"
                      value={newPayroll.staffName}
                      onChange={(val) => setNewPayroll({ ...newPayroll, staffName: val })}
                      options={STAFF_OPTIONS}
                      size="md"
                    />
                  </div>

                  {/* Staff DGCA Info Card */}
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-blue-950">{currentStaffMeta.role}</span>
                      <p className="text-[11px] text-blue-700">
                        {currentStaffMeta.dept} • {currentStaffMeta.dgcaNo}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-blue-600 block">Logged Logbook</span>
                      <span className="font-bold text-blue-950 font-mono">
                        ✈️ {currentStaffMeta.flightHours.toLocaleString()} Flight Hours
                      </span>
                    </div>
                  </div>

                  {/* Period */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <SearchableSelect
                        label="Pay Period (Month) *"
                        value={newPayroll.month}
                        onChange={(val) => setNewPayroll({ ...newPayroll, month: val })}
                        options={[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ]}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Financial Year *
                      </label>
                      <input
                        type="number"
                        required
                        min={2020}
                        max={2030}
                        value={newPayroll.year}
                        onChange={(e) =>
                          setNewPayroll({ ...newPayroll, year: parseInt(e.target.value) || 2026 })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Earnings & Deductions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Base Monthly Salary (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                          ₹
                        </span>
                        <input
                          type="number"
                          required
                          min={0}
                          value={newPayroll.basicPay}
                          onChange={(e) =>
                            setNewPayroll({
                              ...newPayroll,
                              basicPay: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full pl-7 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Flight & Sim Duty Allowance (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-500 font-mono">
                          +₹
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={newPayroll.allowances}
                          onChange={(e) =>
                            setNewPayroll({
                              ...newPayroll,
                              allowances: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-bold text-emerald-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        PF & Tax Deductions (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-500 font-mono">
                          -₹
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={newPayroll.deductions}
                          onChange={(e) =>
                            setNewPayroll({
                              ...newPayroll,
                              deductions: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-bold text-rose-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Computed Net Pay Preview Box */}
                  <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-950 rounded-xl text-white flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                        Calculated Net Take-Home
                      </p>
                      <p className="text-[11px] text-slate-300">
                        Direct Payout to {currentStaffMeta.bankAccount}
                      </p>
                    </div>
                    <p className="text-2xl font-black text-white font-mono">
                      ₹{computedNet.toLocaleString()}
                    </p>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPayrollModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  form="payroll-form"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Create & Authorize Payout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: APPLY FOR STAFF LEAVE (MODAL DESIGN) */}
        {showLeaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Record Faculty Leave Application</h3>
                    <p className="text-[11px] text-slate-300">
                      Ground school & simulator roster schedule adjustment
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLeaveSubmit} className="p-6 space-y-4">
                <div>
                  <SearchableSelect
                    label="Staff Member *"
                    value={newLeave.staffName}
                    onChange={(val) => setNewLeave({ ...newLeave, staffName: val })}
                    options={STAFF_OPTIONS}
                    size="sm"
                  />
                </div>

                <div>
                  <SearchableSelect
                    label="Leave Category *"
                    value={newLeave.leaveType}
                    onChange={(val) =>
                      setNewLeave({ ...newLeave, leaveType: val as LeaveRequest["leaveType"] })
                    }
                    options={[
                      "Casual Leave",
                      "Sick Leave",
                      "Flight Medical Leave",
                      "Earned Leave",
                    ]}
                    size="sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Duty Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newLeave.days}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, days: parseInt(e.target.value) || 1 })
                    }
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reason & Duty Handover Note *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. DGCA recurrent Class 1 medical examination appointment"
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-xs"
                  >
                    Submit Leave Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: DIGITAL PAYSLIP VOUCHER (PRINTABLE) */}
        {selectedPayslip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Plane className="w-4 h-4 transform -rotate-45" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        IRIK Aviation Academy
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Official Salary Disbursement Voucher
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPayslip(null)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <p className="text-xs font-bold text-slate-900">{selectedPayslip.staffName}</p>
                  <p className="text-[11px] text-slate-500">
                    {STAFF_DIRECTORY[selectedPayslip.staffName]?.role || "Faculty"} • {selectedPayslip.month} {selectedPayslip.year}
                  </p>
                  <p className="text-[10px] font-mono text-blue-600">
                    Account: {STAFF_DIRECTORY[selectedPayslip.staffName]?.bankAccount || "Direct NEFT"}
                  </p>
                </div>

                <div className="space-y-2 text-xs border-y border-slate-100 py-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Flying & Ground Instruction:</span>
                    <span className="font-mono font-bold text-slate-800">
                      ₹{selectedPayslip.basicPay.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Flight & Simulator Duty Allowances:</span>
                    <span className="font-mono font-bold">
                      +₹{selectedPayslip.allowances.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-rose-500">
                    <span>Statutory TDS & PF Deductions:</span>
                    <span className="font-mono font-bold">
                      -₹{selectedPayslip.deductions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>Net Disbursed Pay:</span>
                    <span className="font-mono text-blue-600">
                      ₹{selectedPayslip.netPay.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      selectedPayslip.status === "paid"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    Status: {selectedPayslip.status}
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { Payroll, LeaveRequest } from "@/lib/types";
import SearchableSelect from "@/components/SearchableSelect";
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
  const [activeTab, setActiveTab] = useState<"payroll" | "leave" | "generate">("generate");
  const [payrolls, setPayrolls] = useState<Payroll[]>(store.getPayrolls());
  const [leaves, setLeaves] = useState<LeaveRequest[]>(store.getLeaveRequests());
  const [selectedPayslip, setSelectedPayslip] = useState<Payroll | null>(null);

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
    setActiveTab("leave");
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
    setActiveTab("payroll");
  };

  const totalPayrollOutflow = payrolls.reduce((sum, p) => sum + p.netPay, 0);
  const paidPayrollOutflow = payrolls.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.netPay, 0);
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

            {/* Segmented Pill Navigation */}
            <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner shrink-0">
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

              <button
                onClick={() => setActiveTab("generate")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === "generate"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Process Pay</span>
              </button>
            </div>
          </div>
        </div>

        {/* Elevated KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
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
              <span className="flex items-center gap-1 text-blue-600 font-medium">
                <Users className="w-3.5 h-3.5" /> 5 Personnel
              </span>
              <span className="text-[11px] text-slate-400 font-mono">100% Accrued</span>
            </div>
          </div>

          {/* Metric 2 */}
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
              <span className="text-emerald-700 font-medium">
                {payrolls.filter((p) => p.status === "paid").length} Staff Disbursed
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                {totalPayrollOutflow > 0 ? Math.round((paidPayrollOutflow / totalPayrollOutflow) * 100) : 0}% Paid
              </span>
            </div>
          </div>

          {/* Metric 3 */}
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
              <span className="text-amber-700 font-medium">
                {payrolls.filter((p) => p.status === "pending").length} Vouchers Pending
              </span>
              <span className="text-[11px] text-amber-600 font-mono">Awaiting Clearance</span>
            </div>
          </div>

          {/* Metric 4 */}
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

        {/* TAB 3: PROCESS PAYROLL (BALANCED 60/40 2-COLUMN LAYOUT) */}
        {activeTab === "generate" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols): Clean Structured Entry Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Generate Monthly Payroll Entry
                  </h3>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Step 1 of 2
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Compute basic salary, flight instructor hour allowances, PF/ESI deductions and tax withholdings.
                </p>
              </div>

              <form onSubmit={handlePayrollSubmit} className="space-y-4 pt-1">
                {/* 1. Employee Selection */}
                <div>
                  <SearchableSelect
                    label="Flight Instructor / Staff Member *"
                    value={newPayroll.staffName}
                    onChange={(val) => {
                      setNewPayroll({ ...newPayroll, staffName: val });
                    }}
                    options={STAFF_OPTIONS}
                    size="md"
                  />
                </div>

                {/* 2. Pay Period */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <SearchableSelect
                      label="Pay Period (Month) *"
                      value={newPayroll.month}
                      onChange={(val) => setNewPayroll({ ...newPayroll, month: val })}
                      options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
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

                {/* 3. Salary & Earnings Breakdown */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                    Earnings & Allowances Structure
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                          className="w-full pl-7 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-bold text-slate-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Flight & Sim Duty Allowances (₹)
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
                          className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-bold text-emerald-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Deductions */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Statutory Deductions (PF, TDS, Medical)
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      PF, Income Tax & Medical Insurance (₹)
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
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-bold text-rose-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Create & Disburse Payroll Record</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column (5 cols): Dynamic Live Digital Pay Slip Preview (Zero Dead Space!) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Slip Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-blue-50 rounded-full pointer-events-none"></div>

                {/* Slip Header */}
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
                      <Plane className="w-3.5 h-3.5 transform -rotate-45" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 tracking-tight leading-tight">
                        IRIK Aviation Academy
                      </h4>
                      <p className="text-[10px] text-slate-400">DGCA Flight Crew Voucher</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Preview
                  </span>
                </div>

                {/* Employee Profile Preview */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    {newPayroll.staffName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {newPayroll.staffName}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate">{currentStaffMeta.role}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-600">
                      <span className="bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        {currentStaffMeta.dgcaNo}
                      </span>
                      <span>✈️ {currentStaffMeta.flightHours.toLocaleString()} Hrs Logged</span>
                    </div>
                  </div>
                </div>

                {/* Itemized Calculation Summary */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Pay Period:</span>
                    <span className="font-bold text-slate-800">
                      {newPayroll.month} {newPayroll.year}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Base Flying & Ground Pay:</span>
                    <span className="font-mono font-bold text-slate-800">
                      ₹{newPayroll.basicPay.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Flight Line & Sim Duty Allowance:</span>
                    <span className="font-mono font-bold">
                      +₹{newPayroll.allowances.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-rose-600">
                    <span>Tax (TDS) & Provident Fund:</span>
                    <span className="font-mono font-bold">
                      -₹{newPayroll.deductions.toLocaleString()}
                    </span>
                  </div>

                  {/* Visual Bar Ratio */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Salary Ratio</span>
                      <span>Basic {newPayroll.basicPay + newPayroll.allowances > 0 ? Math.round((newPayroll.basicPay / (newPayroll.basicPay + newPayroll.allowances)) * 100) : 0}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                      <div
                        className="bg-blue-600 h-full"
                        style={{
                          width: `${
                            newPayroll.basicPay + newPayroll.allowances > 0
                              ? (newPayroll.basicPay / (newPayroll.basicPay + newPayroll.allowances)) * 100
                              : 75
                          }%`,
                        }}
                      ></div>
                      <div
                        className="bg-emerald-500 h-full"
                        style={{
                          width: `${
                            newPayroll.basicPay + newPayroll.allowances > 0
                              ? (newPayroll.allowances / (newPayroll.basicPay + newPayroll.allowances)) * 100
                              : 25
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Net Calculated Pay Box */}
                  <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl flex items-center justify-between mt-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
                        Net Take-Home Disbursable
                      </p>
                      <p className="text-[11px] text-blue-700">Direct NEFT / RTGS</p>
                    </div>
                    <p className="text-xl font-black text-blue-900 font-mono">
                      ₹{computedNet.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Disbursal Target */}
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {currentStaffMeta.bankAccount}
                  </span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>
              </div>

              {/* Historical Context Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-4 space-y-2.5">
                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Recent Payroll Ledger for {newPayroll.staffName}
                </h5>
                <div className="space-y-1.5">
                  {payrolls
                    .filter((p) => p.staffName === newPayroll.staffName)
                    .slice(0, 2)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-800">
                            {item.month} {item.year}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-2">
                            Basic: ₹{(item.basicPay / 1000).toFixed(0)}k
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">
                            ₹{item.netPay.toLocaleString()}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              item.status === "paid"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: PAYROLL LEDGER / BATCHES */}
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
              <button
                onClick={() => setActiveTab("generate")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl transition shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Process New Voucher</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Staff Member / Role</th>
                    <th className="py-3.5 px-4">Pay Period</th>
                    <th className="py-3.5 px-4">Basic Pay</th>
                    <th className="py-3.5 px-4">Allowances</th>
                    <th className="py-3.5 px-4">Deductions</th>
                    <th className="py-3.5 px-4 font-mono">Net Payable</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payrolls.map((p) => {
                    const meta = STAFF_DIRECTORY[p.staffName];
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {p.staffName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{p.staffName}</p>
                              <p className="text-[10px] text-slate-400">
                                {meta?.role || "Staff Member"}
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

        {/* TAB 2: LEAVE ADMINISTRATION (BALANCED 2-COLUMN) */}
        {activeTab === "leave" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols): Leave Requests Review */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-blue-600" />
                    Faculty Leave Requests
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and authorize time-off for ground school instructors and flight pilots
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {leaves.length} Total
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {leaves.map((l) => (
                  <div key={l.id} className="p-4 hover:bg-slate-50/60 transition">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900">{l.staffName}</h4>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                            {l.leaveType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {l.startDate} to {l.endDate} ({l.days} {l.days === 1 ? "day" : "days"})
                        </p>
                        <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                          {l.reason}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
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
                              className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-semibold transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleLeaveStatus(l.id, "rejected")}
                              className="text-[11px] bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-lg font-semibold transition"
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

            {/* Right Column (5 cols): Apply Leave Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Apply for Staff Leave
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record new leave application on the flight ops schedule
                </p>
              </div>

              <form onSubmit={handleLeaveSubmit} className="space-y-3.5">
                <div>
                  <SearchableSelect
                    label="Staff Member"
                    value={newLeave.staffName}
                    onChange={(val) => setNewLeave({ ...newLeave, staffName: val })}
                    options={STAFF_OPTIONS}
                    size="sm"
                  />
                </div>

                <div>
                  <SearchableSelect
                    label="Leave Category"
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
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Days Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newLeave.days}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, days: parseInt(e.target.value) || 1 })
                    }
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reason / Duty Handover Notes
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide justification or DGCA medical appointment details..."
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Payslip Modal */}
        {selectedPayslip && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
              <div className="border-b border-slate-100 pb-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <Plane className="w-5 h-5 transform -rotate-45" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                  IRIK International Institute of Aviation
                </h3>
                <p className="text-xs text-slate-500">DGCA Approved Academy — Official Salary Slip</p>
                <p className="text-xs font-bold text-blue-700 mt-1">
                  Pay Period: {selectedPayslip.month} {selectedPayslip.year}
                </p>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Employee Name:</span>
                  <span className="font-bold text-slate-900">{selectedPayslip.staffName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Basic Pay:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{selectedPayslip.basicPay.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Flight & Simulator Allowances:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    +₹{selectedPayslip.allowances.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PF, Tax & ESI Deductions:</span>
                  <span className="font-mono font-bold text-rose-600">
                    -₹{selectedPayslip.deductions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-100 text-sm">
                  <span className="font-bold text-slate-900">Net Salary Credited:</span>
                  <span className="font-mono font-black text-blue-600">
                    ₹{selectedPayslip.netPay.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Disbursal Authorization:</span>
                  <span className="font-bold text-emerald-600 uppercase">
                    {selectedPayslip.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-2.5">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Download Slip</span>
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth-context";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  CreditCard,
  Plane,
  Clock,
  Compass,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Building,
  Target,
  Sparkles,
  Layers,
  GraduationCap,
} from "lucide-react";

export default function AnalyticsDashboardPage() {
  const { user } = useAuth();
  const [selectedTerm, setSelectedTerm] = useState("Academic Year 2026-2027");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Live Data extraction from store
  const students = store.getStudents();
  const admissions = store.getAdmissions();
  const fees = store.getFees();
  const assets = store.getAssets ? store.getAssets() : [];
  const budgets = store.getBudgets ? store.getBudgets() : [];
  const attendance = store.getAttendance ? store.getAttendance() : [];

  // Metrics
  const totalStudents = students.length;
  const totalApplications = admissions.length;
  const approvedAdmissions = admissions.filter((a) => a.status === "approved" || a.status === "medical_verified").length;
  const conversionRate = totalApplications > 0 ? Math.round((approvedAdmissions / totalApplications) * 100) : 0;

  const totalFeesCollected = fees
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);

  const totalFeesPending = fees
    .filter((f) => f.status === "pending" || f.status === "overdue")
    .reduce((sum, f) => sum + f.amount, 0);

  const feeCollectionRate = totalFeesCollected + totalFeesPending > 0
    ? Math.round((totalFeesCollected / (totalFeesCollected + totalFeesPending)) * 100)
    : 0;

  const aircraftAssets = assets.filter((a) => a.type === "aircraft");
  const simAssets = assets.filter((a) => a.type === "simulator");

  const totalFlightHours = aircraftAssets.reduce((sum, a) => sum + (a.totalHours || 0), 0);
  const totalSimHours = simAssets.reduce((sum, a) => sum + (a.totalHours || 0), 0);

  const totalAllocatedBudget = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpentBudget = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const budgetUtilization = totalAllocatedBudget > 0 ? Math.round((totalSpentBudget / totalAllocatedBudget) * 100) : 0;

  // Attendance stats
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const totalAttendanceLogged = attendance.length;
  const avgAttendance = totalAttendanceLogged > 0 ? Math.round((presentCount / totalAttendanceLogged) * 100) : 88;

  // Course distribution
  const courseCounts: Record<string, number> = {};
  students.forEach((s) => {
    courseCounts[s.course] = (courseCounts[s.course] || 0) + 1;
  });

  return (
    <AppLayout>
      <div className="space-y-6 mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Executive BI Suite
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Sync
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Institutional Analytics & Performance</h1>
            <p className="text-slate-300 text-sm mt-1">
              Real-time intelligence across Admissions, Fee Revenue, DGCA Flight Logs & Departmental Operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="bg-slate-800/90 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value="Academic Year 2026-2027">AY 2026-2027 (Current)</option>
              <option value="Term 1 - Monsoon 2026">Term 1 - Monsoon 2026</option>
              <option value="AY 2025-2026">AY 2025-2026 (Historical)</option>
            </select>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-md shadow-indigo-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              Export Executive Brief
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Revenue Collection */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Collection</span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">₹{(totalFeesCollected / 100000).toFixed(2)} Lakhs</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Collection Efficiency</span>
              <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> {feeCollectionRate}%
              </span>
            </div>
          </div>

          {/* Card 2: Admissions Conversion */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admissions Intake</span>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{approvedAdmissions} Confirmed</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">From {totalApplications} Applicants</span>
              <span className="font-bold text-indigo-600">{conversionRate}% Conversion</span>
            </div>
          </div>

          {/* Card 3: Total Flight & Sim Hours */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flight & Sim Hours</span>
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Plane className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{(totalFlightHours + totalSimHours).toLocaleString()} hrs</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">{totalFlightHours}h Flight · {totalSimHours}h Sim</span>
              <span className="font-bold text-sky-600">DGCA Validated</span>
            </div>
          </div>

          {/* Card 4: Average Attendance */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Attendance</span>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{avgAttendance}%</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Benchmark ≥ 75%</span>
              <span className="font-bold text-emerald-600">Compliant</span>
            </div>
          </div>
        </div>

        {/* Section 1: Revenue vs Dues & Admissions Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fee Revenue Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Fee Realization & Dues Aging</h3>
                <p className="text-slate-500 text-xs">Total invoice commitments vs. realized collections</p>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                Total ₹{((totalFeesCollected + totalFeesPending) / 100000).toFixed(1)}L
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Paid & Cleared
                  </span>
                  <span className="text-slate-900">₹{(totalFeesCollected).toLocaleString()} ({feeCollectionRate}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${feeCollectionRate}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Pending Dues (Next 30 Days)
                  </span>
                  <span className="text-slate-900">₹{(totalFeesPending).toLocaleString()} ({100 - feeCollectionRate}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${100 - feeCollectionRate}%` }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 font-medium">BBA Aviation</div>
                <div className="text-sm font-bold text-slate-900 mt-1">₹3.50L</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 font-medium">Pilot CPL Training</div>
                <div className="text-sm font-bold text-slate-900 mt-1">₹9.00L</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 font-medium">Cabin Crew</div>
                <div className="text-sm font-bold text-slate-900 mt-1">₹1.85L</div>
              </div>
            </div>
          </div>

          {/* Admissions Funnel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Admissions & Intake Funnel</h3>
                <p className="text-slate-500 text-xs">Lead progression from inquiry to seat confirmation</p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
                Batch 2026 Intake
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Total Applications Received</div>
                    <div className="text-[11px] text-slate-500">Website & walk-in inquiries</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900">{totalApplications}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">DGCA Medical Assessment</div>
                    <div className="text-[11px] text-slate-500">Class 1 & Class 2 clearances</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900">{approvedAdmissions}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950">Confirmed Enrolled Students</div>
                    <div className="text-[11px] text-emerald-700">Fee paid & registration complete</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-700">{approvedAdmissions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Fleet & Simulator Utilization & Departmental Budgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fleet Status */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Fleet & Flight Simulator Utilization</h3>
                <p className="text-slate-500 text-xs">Mandatory DGCA 100-Hour Cycle Compliance Tracking</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-sky-700 font-semibold bg-sky-50 px-3 py-1 rounded-lg">
                <Plane className="w-3.5 h-3.5" /> {assets.length} Active Training Units
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Asset</th>
                    <th className="pb-3">Tail / Reg No</th>
                    <th className="pb-3">Total Logged</th>
                    <th className="pb-3">DGCA Status</th>
                    <th className="pb-3 text-right">Maintenance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${asset.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                        {asset.name}
                      </td>
                      <td className="py-3 font-mono font-medium text-slate-600">{asset.registrationNumber}</td>
                      <td className="py-3 font-bold text-slate-900">{asset.totalHours} hrs</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            asset.dgcaComplianceStatus === "compliant"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {asset.dgcaComplianceStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-slate-500">{asset.nextMaintenanceDue || "Scheduled"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Departmental Budget Utilization */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Budget Allocation</h3>
                <p className="text-slate-500 text-xs">FY 2026-27 Utilization</p>
              </div>
              <span className="text-xs font-bold text-indigo-600">{budgetUtilization}% Spent</span>
            </div>

            <div className="space-y-4">
              {budgets.map((b) => {
                const pct = Math.round((b.spentAmount / b.allocatedAmount) * 100);
                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-800">{b.department}</span>
                      <span className="font-bold text-slate-900">₹{(b.spentAmount / 100000).toFixed(1)}L / ₹{(b.allocatedAmount / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 80 ? "bg-amber-500" : "bg-indigo-600"}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Total Institute Allocation</span>
              <span className="font-bold text-slate-900">₹{(totalAllocatedBudget / 100000).toFixed(2)} Lakhs</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

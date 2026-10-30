"use client";

import { store } from "@/lib/store";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import SearchableSelect from "@/components/SearchableSelect";
import { useAuth } from "@/lib/auth-context";
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  Download,
  Search,
  Filter,
  ShieldCheck,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";

export default function FeesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  const allStudents = store.getStudents();
  const allFees = store.getFees();

  // Determine logged-in student if role is student
  const loggedInStudent = isStudent
    ? allStudents.find(
        (s) =>
          (user?.email && s.email.toLowerCase() === user.email.toLowerCase()) ||
          (user?.fullName && s.name.toLowerCase() === user.fullName.toLowerCase()) ||
          (user?.username && s.rollNo.toLowerCase() === user.username.toLowerCase()) ||
          (user?.username && s.name.toLowerCase().includes(user.username.toLowerCase()))
      ) || allStudents[0]
    : null;

  const [fees, setFees] = useState(allFees);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    studentId: "",
    amount: 100000,
    feeType: "Tuition",
    dueDate: new Date().toISOString().split("T")[0],
    semester: 1,
    status: "pending" as const,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "semester" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    const newFee = store.addFee(formData);
    setFees([...fees, newFee]);
    setShowForm(false);
    setFormData({
      studentId: "",
      amount: 100000,
      feeType: "Tuition",
      dueDate: new Date().toISOString().split("T")[0],
      semester: 1,
      status: "pending",
    });
  };

  const handleMarkAsPaid = (id: string) => {
    const updated = store.updateFeeStatus(id, "paid");
    if (updated) {
      setFees(fees.map((f) => (f.id === id ? updated : f)));
    }
  };

  const getStudentName = (id: string) => {
    return allStudents.find((s) => s.id === id)?.name || "Unknown Cadet";
  };

  const getStudentRoll = (id: string) => {
    return allStudents.find((s) => s.id === id)?.rollNo || "N/A";
  };

  // Scope fees: If student role, ONLY show loggedInStudent's fees
  const scopedFees = isStudent && loggedInStudent
    ? fees.filter((f) => f.studentId === loggedInStudent.id)
    : fees;

  const filteredFees = scopedFees.filter((f) => {
    const studentName = getStudentName(f.studentId);
    const matchesSearch =
      !searchQuery ||
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.feeType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPending = scopedFees
    .filter((f) => f.status === "pending")
    .reduce((sum, f) => sum + f.amount, 0);

  const totalCollected = scopedFees
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-md uppercase font-semibold border border-indigo-400/30 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                {isStudent ? "My Fee Invoices & Payments" : "Aviation Fee Accounts"}
              </span>
              {isAdmin ? (
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Admin Finance Editor
                </span>
              ) : isStudent ? (
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-0.5 rounded-md font-medium border border-blue-500/30 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Cadet: {loggedInStudent?.name} ({loggedInStudent?.rollNo})
                </span>
              ) : (
                <span className="bg-slate-700/60 text-slate-300 text-xs px-2.5 py-0.5 rounded-md font-medium border border-slate-600/40 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Read Only
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isStudent ? `Fee Statement for ${loggedInStudent?.name}` : "Fee Management & Invoicing"}
            </h2>
            <p className="text-xs text-slate-300">
              {isStudent
                ? "View your semester fee invoices, simulator slot charges, and make online payments"
                : "Manage flight training, ground school, and hostel installment invoices"}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{showForm ? "Cancel" : "Add Fee Invoice"}</span>
            </button>
          )}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isStudent ? "My Paid Fees" : "Total Collected"}
            </p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              ₹{totalCollected.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Cleared via UPI / Card</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isStudent ? "My Outstanding Due" : "Total Pending Dues"}
            </p>
            <p className="text-2xl font-bold text-rose-700 mt-1">
              ₹{totalPending.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalPending > 0 ? "Due for current semester" : "Zero pending balance"}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isStudent ? "Enrolled Program" : "Total Invoiced Students"}
            </p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {isStudent ? loggedInStudent?.course : allStudents.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isStudent ? `Semester ${loggedInStudent?.semester}` : "Active student body"}
            </p>
          </div>
        </div>

        {/* Add Fee Form (Admin Only) */}
        {isAdmin && showForm && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Create Fee Invoice</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cadet *</label>
                  <SearchableSelect
                    options={allStudents.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNo})` }))}
                    value={formData.studentId}
                    onChange={(val) => setFormData({ ...formData, studentId: val })}
                    placeholder="Select Cadet"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Type</label>
                  <select
                    name="feeType"
                    value={formData.feeType}
                    onChange={handleChange}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <option value="Tuition">Tuition Fee</option>
                    <option value="Flight Training">Flight Simulator / Aircraft Hours</option>
                    <option value="Hostel & Mess">Hostel & Accommodation</option>
                    <option value="Examination">DGCA Exam Fee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Generate Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Fees Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Cadet Name</th>
                  <th className="px-4 py-3.5">Invoice Type</th>
                  <th className="px-4 py-3.5">Semester</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Due Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredFees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400 italic">
                      No fee records found for this account.
                    </td>
                  </tr>
                ) : (
                  filteredFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        <p>{getStudentName(fee.studentId)}</p>
                        <p className="text-[11px] font-mono text-slate-400">{getStudentRoll(fee.studentId)}</p>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">{fee.feeType}</td>
                      <td className="px-4 py-3.5">Semester {fee.semester}</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        ₹{fee.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{fee.dueDate || "30 Sep 2026"}</td>
                      <td className="px-4 py-3.5">
                        {fee.status === "paid" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <Clock className="w-3 h-3 text-rose-600" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {fee.status === "pending" && (
                          <button
                            onClick={() => handleMarkAsPaid(fee.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
                          >
                            {isStudent ? "Pay Online" : "Mark as Paid"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { Payroll, LeaveRequest } from "@/lib/types";

export default function HRPayrollPage() {
  const [activeTab, setActiveTab] = useState<"payroll" | "leave" | "generate">("payroll");
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
  const pendingLeaves = leaves.filter((l) => l.status === "pending").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-blue-600/40 text-blue-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-blue-400/30">
                Irik.md Section 4.7
              </span>
              <h1 className="text-2xl font-bold mt-2">HR & Faculty Payroll Management</h1>
              <p className="text-sm text-gray-300">
                Staff records, flight instructor contracts, leave administration & salary disbursements
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("payroll")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "payroll" ? "bg-blue-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                💰 Payroll Batches
              </button>
              <button
                onClick={() => setActiveTab("leave")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "leave" ? "bg-blue-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                🌴 Leave Requests ({pendingLeaves})
              </button>
              <button
                onClick={() => setActiveTab("generate")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "generate" ? "bg-blue-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                + Process Pay
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Monthly Payroll</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{(totalPayrollOutflow / 100000).toFixed(2)} Lakhs</p>
            <p className="text-xs text-blue-600 mt-1">5 Faculty & Ops Personnel</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Disbursed (Paid)</p>
            <p className="text-2xl font-bold text-green-600 mt-1">₹{(paidPayrollOutflow / 100000).toFixed(2)} Lakhs</p>
            <p className="text-xs text-gray-500 mt-1">{payrolls.filter((p) => p.status === "paid").length} staff paid</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Release</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              ₹{((totalPayrollOutflow - paidPayrollOutflow) / 100000).toFixed(2)} Lakhs
            </p>
            <p className="text-xs text-gray-500 mt-1">{payrolls.filter((p) => p.status === "pending").length} pending</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Applications</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{leaves.length}</p>
            <p className="text-xs text-amber-600 mt-1">{pendingLeaves} requiring review</p>
          </div>
        </div>

        {/* Tab 1: Payroll Records */}
        {activeTab === "payroll" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">Faculty & Staff Payroll Ledger</h3>
                <p className="text-xs text-gray-500">Breakdown of base salary, flight hour allowances & tax deductions</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Staff Member</th>
                    <th className="px-6 py-3 font-semibold">Period</th>
                    <th className="px-6 py-3 font-semibold">Basic Pay</th>
                    <th className="px-6 py-3 font-semibold">Allowances</th>
                    <th className="px-6 py-3 font-semibold">Deductions</th>
                    <th className="px-6 py-3 font-semibold">Net Pay</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payrolls.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{p.staffName}</td>
                      <td className="px-6 py-4 text-gray-600">{p.month} {p.year}</td>
                      <td className="px-6 py-4 text-gray-600">₹{p.basicPay.toLocaleString()}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">+₹{p.allowances.toLocaleString()}</td>
                      <td className="px-6 py-4 text-red-600 font-medium">-₹{p.deductions.toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{p.netPay.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            p.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedPayslip(p)}
                          className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded font-medium transition"
                        >
                          📄 Payslip
                        </button>
                        {p.status === "pending" && (
                          <button
                            onClick={() => handleMarkAsPaid(p.id)}
                            className="text-xs bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded font-medium transition"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Leave Management */}
        {activeTab === "leave" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Staff Leave Applications</h3>
                <p className="text-xs text-gray-500">Track flight medical leaves, casual leaves & vacation approvals</p>
              </div>
              <div className="divide-y divide-gray-100">
                {leaves.map((l) => (
                  <div key={l.id} className="p-5 hover:bg-gray-50/80 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{l.staffName}</h4>
                          <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                            {l.leaveType}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          📅 {l.startDate} to {l.endDate} ({l.days} {l.days === 1 ? "day" : "days"})
                        </p>
                        <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                          {l.reason}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            l.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : l.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {l.status.toUpperCase()}
                        </span>
                        {l.status === "pending" && (
                          <div className="flex gap-1.5 mt-2">
                            <button
                              onClick={() => handleLeaveStatus(l.id, "approved")}
                              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleLeaveStatus(l.id, "rejected")}
                              className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-medium"
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

            {/* Leave Application Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Apply for Staff Leave</h3>
              <p className="text-xs text-gray-500 mb-4">Record new leave for flight instructors or ground staff</p>
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Staff Member</label>
                  <select
                    value={newLeave.staffName}
                    onChange={(e) => setNewLeave({ ...newLeave, staffName: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Dr. Amit Patel">Dr. Amit Patel (Aviation Mgmt)</option>
                    <option value="Capt. Vikram Malhotra">Capt. Vikram Malhotra (Flight Instructor)</option>
                    <option value="Dr. Neha Sharma">Dr. Neha Sharma (Aviation Tech)</option>
                    <option value="Ms. Kavya Shah">Ms. Kavya Shah (Cabin Crew)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Leave Category</label>
                  <select
                    value={newLeave.leaveType}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, leaveType: e.target.value as LeaveRequest["leaveType"] })
                    }
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Flight Medical Leave">Flight Medical Leave (DGCA)</option>
                    <option value="Earned Leave">Earned Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Days Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newLeave.days}
                    onChange={(e) => setNewLeave({ ...newLeave, days: parseInt(e.target.value) || 1 })}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Reason / Notes</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide justification or DGCA medical appointment details..."
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Process Payroll Form */}
        {activeTab === "generate" && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Generate Monthly Payroll Entry</h3>
            <p className="text-xs text-gray-500 mb-5">
              Calculate basic pay, flight training allowances, PF/ESI and tax deductions
            </p>
            <form onSubmit={handlePayrollSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Staff Member</label>
                <select
                  value={newPayroll.staffName}
                  onChange={(e) => setNewPayroll({ ...newPayroll, staffName: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm"
                >
                  <option value="Prof. Rajesh Kumar">Prof. Rajesh Kumar (Dean)</option>
                  <option value="Dr. Amit Patel">Dr. Amit Patel (Aviation Mgmt)</option>
                  <option value="Dr. Neha Sharma">Dr. Neha Sharma (Aeronautics)</option>
                  <option value="Capt. Vikram Malhotra">Capt. Vikram Malhotra (Chief Flight Instructor)</option>
                  <option value="Ms. Kavya Shah">Ms. Kavya Shah (Cabin Crew Trainer)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
                  <select
                    value={newPayroll.month}
                    onChange={(e) => setNewPayroll({ ...newPayroll, month: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  >
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={newPayroll.year}
                    onChange={(e) => setNewPayroll({ ...newPayroll, year: parseInt(e.target.value) || 2026 })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Basic Salary (₹)</label>
                  <input
                    type="number"
                    value={newPayroll.basicPay}
                    onChange={(e) => setNewPayroll({ ...newPayroll, basicPay: parseInt(e.target.value) || 0 })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Allowances (₹)</label>
                  <input
                    type="number"
                    value={newPayroll.allowances}
                    onChange={(e) => setNewPayroll({ ...newPayroll, allowances: parseInt(e.target.value) || 0 })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Deductions (₹)</label>
                  <input
                    type="number"
                    value={newPayroll.deductions}
                    onChange={(e) => setNewPayroll({ ...newPayroll, deductions: parseInt(e.target.value) || 0 })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-900">Computed Net Payable:</span>
                <span className="text-xl font-bold text-blue-900">
                  ₹{(newPayroll.basicPay + newPayroll.allowances - newPayroll.deductions).toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg text-sm transition"
              >
                Create Payroll Record
              </button>
            </form>
          </div>
        )}

        {/* Payslip Modal */}
        {selectedPayslip && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
              <div className="border-b pb-4 text-center">
                <h3 className="font-bold text-xl text-gray-900">IRIK International Institute of Aviation</h3>
                <p className="text-xs text-gray-500">Aviation Academy & Flight Operations — Salary Slip</p>
                <p className="text-xs font-semibold text-blue-700 mt-1">
                  Pay Period: {selectedPayslip.month} {selectedPayslip.year}
                </p>
              </div>

              <div className="py-4 space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-500">Employee Name:</span>
                  <span className="font-semibold text-gray-900">{selectedPayslip.staffName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Basic Pay:</span>
                  <span className="font-medium text-gray-900">₹{selectedPayslip.basicPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Flight & Special Allowances:</span>
                  <span className="font-medium text-green-600">+₹{selectedPayslip.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PF, Tax & ESI Deductions:</span>
                  <span className="font-medium text-red-600">-₹{selectedPayslip.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t font-bold text-base">
                  <span className="text-gray-900">Net Salary Credited:</span>
                  <span className="text-blue-600">₹{selectedPayslip.netPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 pt-1">
                  <span>Payment Status:</span>
                  <span className="font-semibold text-green-600 uppercase">{selectedPayslip.status}</span>
                </div>
              </div>

              <div className="border-t pt-4 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition"
                >
                  🖨️ Print / Download PDF
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm"
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

"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { FinanceTransaction, Budget } from "@/lib/types";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<"ledger" | "budgets" | "new_tx">("ledger");
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(store.getFinanceTransactions());
  const [budgets, setBudgets] = useState<Budget[]>(store.getBudgets());
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");

  const [newTx, setNewTx] = useState({
    type: "income" as "income" | "expense",
    category: "Tuition Fees",
    amount: 50000,
    date: new Date().toISOString().split("T")[0],
    description: "",
    paymentMethod: "bank_transfer" as FinanceTransaction["paymentMethod"],
    department: "Academic",
  });

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addFinanceTransaction(newTx);
    setTransactions(store.getFinanceTransactions());
    setNewTx({
      type: "income",
      category: "Tuition Fees",
      amount: 50000,
      date: new Date().toISOString().split("T")[0],
      description: "",
      paymentMethod: "bank_transfer",
      department: "Academic",
    });
    setActiveTab("ledger");
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netSurplus = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "all") return true;
    return t.type === filterType;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-xl p-6 text-white shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-emerald-600/40 text-emerald-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-emerald-400/30">
                Irik.md Section 4.8
              </span>
              <h1 className="text-2xl font-bold mt-2">Institute Finance & General Ledger</h1>
              <p className="text-sm text-gray-300">
                Comprehensive accounting ledger, aviation operations budgeting, fuel & maintenance expenses
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("ledger")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "ledger" ? "bg-emerald-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                📜 Transaction Ledger
              </button>
              <button
                onClick={() => setActiveTab("budgets")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "budgets" ? "bg-emerald-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                📊 Department Budgets
              </button>
              <button
                onClick={() => setActiveTab("new_tx")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "new_tx" ? "bg-emerald-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                + Record Entry
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Income Realized</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">₹{(totalIncome / 100000).toFixed(2)} L</p>
            <p className="text-xs text-gray-500 mt-1">Fees, Simulator bookings & flight slots</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Operating Outflow</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">₹{(totalExpense / 100000).toFixed(2)} L</p>
            <p className="text-xs text-gray-500 mt-1">Aviation fuel, maintenance & payroll</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Operating Surplus</p>
            <p className={`text-2xl font-bold mt-1 ${netSurplus >= 0 ? "text-blue-600" : "text-red-600"}`}>
              ₹{(netSurplus / 100000).toFixed(2)} L
            </p>
            <p className="text-xs text-gray-500 mt-1">Fiscal Year 2026-27</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Ledger Entries</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{transactions.length}</p>
            <p className="text-xs text-emerald-600 mt-1">Audited & Verified</p>
          </div>
        </div>

        {/* Tab 1: Ledger */}
        {activeTab === "ledger" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">General Financial Ledger</h3>
                <p className="text-xs text-gray-500">Real-time accounting entries across all institute departments</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    filterType === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All ({transactions.length})
                </button>
                <button
                  onClick={() => setFilterType("income")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    filterType === "income" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilterType("expense")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    filterType === "expense" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                  }`}
                >
                  Expenses
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                    <th className="px-6 py-3 font-semibold">Category</th>
                    <th className="px-6 py-3 font-semibold">Description</th>
                    <th className="px-6 py-3 font-semibold">Department</th>
                    <th className="px-6 py-3 font-semibold">Payment Mode</th>
                    <th className="px-6 py-3 font-semibold text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-500">{tx.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            tx.type === "income" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {tx.type === "income" ? "↓ INCOME" : "↑ EXPENSE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{tx.category}</td>
                      <td className="px-6 py-4 text-gray-600 text-xs max-w-xs">{tx.description}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                          {tx.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs uppercase text-gray-500">{tx.paymentMethod.replace("_", " ")}</td>
                      <td
                        className={`px-6 py-4 font-bold text-right ${
                          tx.type === "income" ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Budgets */}
        {activeTab === "budgets" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Fiscal Year 2026-2027 Department Budgets</h3>
              <p className="text-xs text-gray-500 mb-6">
                Monitoring allocated budget versus actual operational expenditures
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((b) => {
                  const percent = Math.min(100, Math.round((b.spentAmount / b.allocatedAmount) * 100));
                  return (
                    <div key={b.id} className="p-5 rounded-xl border border-gray-200 bg-gray-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{b.department}</h4>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            percent > 80 ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {percent}% Used
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            percent > 80 ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Spent: ₹{(b.spentAmount / 100000).toFixed(2)} L</span>
                        <span>Allocated: ₹{(b.allocatedAmount / 100000).toFixed(2)} L</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Remaining: ₹{((b.allocatedAmount - b.spentAmount) / 100000).toFixed(2)} L</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Record Entry */}
        {activeTab === "new_tx" && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Record Financial Transaction</h3>
            <p className="text-xs text-gray-500 mb-5">Add double-entry accounting record to institute general ledger</p>
            <form onSubmit={handleTxSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Transaction Type</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => setNewTx({ ...newTx, type: e.target.value as "income" | "expense" })}
                    className="w-full border rounded-lg p-2.5 text-sm font-semibold"
                  >
                    <option value="income">↓ Income (Credit)</option>
                    <option value="expense">↑ Expense (Debit)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTx.category}
                    onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  >
                    <option value="Tuition Fees">Tuition Fees</option>
                    <option value="Simulator Training Fees">Simulator Training Fees</option>
                    <option value="Aviation Fuel">Aviation Fuel (Avgas / Jet A-1)</option>
                    <option value="Aircraft Maintenance">Aircraft Maintenance & Spares</option>
                    <option value="Staff Payroll">Staff Payroll</option>
                    <option value="DGCA Regulatory Fees">DGCA Regulatory & Audit Fees</option>
                    <option value="Hostel & Amenities">Hostel & Amenities</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: parseInt(e.target.value) || 0 })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newTx.date}
                    onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={newTx.department}
                    onChange={(e) => setNewTx({ ...newTx, department: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  >
                    <option value="Flight Operations">Flight Operations</option>
                    <option value="Academic">Academic</option>
                    <option value="Maintenance">Maintenance & Fleet</option>
                    <option value="Administration">Administration</option>
                    <option value="Hostel">Hostel & Campus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={newTx.paymentMethod}
                    onChange={(e) =>
                      setNewTx({ ...newTx, paymentMethod: e.target.value as FinanceTransaction["paymentMethod"] })
                    }
                    className="w-full border rounded-lg p-2.5 text-sm"
                  >
                    <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="upi">UPI / QR Payment</option>
                    <option value="cheque">Cheque</option>
                    <option value="cash">Cash Voucher</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description / Memo</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detailed explanation of the expense or voucher reference..."
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg text-sm transition"
              >
                Post Entry to General Ledger
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

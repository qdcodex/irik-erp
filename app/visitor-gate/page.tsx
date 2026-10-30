"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { VisitorLog } from "@/lib/types";
import SearchableSelect from "@/components/SearchableSelect";

export default function VisitorGatePage() {
  const [visitors, setVisitors] = useState<VisitorLog[]>(store.getVisitorLogs());
  const [filterArea, setFilterArea] = useState<string>("all");

  const [newVisitor, setNewVisitor] = useState({
    visitorName: "",
    phone: "",
    purpose: "",
    hostStaffName: "Dr. Amit Patel",
    areaAccessed: "General Campus" as VisitorLog["areaAccessed"],
    entryTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    badgeNumber: "VIS-2026-" + Math.floor(Math.random() * 900 + 100),
  });

  const handleRegisterVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    store.addVisitorLog({
      ...newVisitor,
      status: "inside",
    });
    setVisitors(store.getVisitorLogs());
    setNewVisitor({
      visitorName: "",
      phone: "",
      purpose: "",
      hostStaffName: "Dr. Amit Patel",
      areaAccessed: "General Campus",
      entryTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      badgeNumber: "VIS-2026-" + Math.floor(Math.random() * 900 + 100),
    });
    alert("Visitor Pass Issued & Gate Check-in Completed!");
  };

  const handleCheckout = (id: string) => {
    const updated = store.checkoutVisitor(id);
    if (updated) {
      setVisitors(store.getVisitorLogs());
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    if (filterArea === "all") return true;
    return v.areaAccessed === filterArea;
  });

  const visitorsInside = visitors.filter((v) => v.status === "inside").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-950 rounded-xl p-6 text-white shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-amber-500/30 text-amber-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-amber-400/30">
                Irik.md Section 4.17
              </span>
              <h1 className="text-2xl font-bold mt-2">Campus Security & Aviation Gate Management</h1>
              <p className="text-sm text-gray-300">
                Visitor entry/exit tracking, restricted hangar & apron airside zone access authorization
              </p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl text-center border border-white/10">
              <span className="text-xs text-gray-300 block">Current Campus Visitors</span>
              <span className="text-xl font-bold text-amber-400">{visitorsInside} Persons Inside</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visitor Log Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Live Campus & Airside Entry Log</h3>
                  <p className="text-xs text-gray-500">Security clearance records and host staff verification</p>
                </div>
                <div className="min-w-[190px]">
                  <SearchableSelect
                    value={filterArea}
                    onChange={(val) => setFilterArea(val)}
                    options={[
                      { value: "all", label: "All Zones" },
                      { value: "Flight Hangar", label: "Flight Hangar (Restricted)" },
                      { value: "Apron Zone", label: "Apron Zone (Restricted)" },
                      { value: "Simulator Complex", label: "Simulator Complex" },
                      { value: "Admin Office", label: "Admin Office" },
                      { value: "General Campus", label: "General Campus" },
                    ]}
                    size="sm"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Badge & Visitor</th>
                      <th className="px-6 py-3 font-semibold">Purpose</th>
                      <th className="px-6 py-3 font-semibold">Zone Accessed</th>
                      <th className="px-6 py-3 font-semibold">Host Staff</th>
                      <th className="px-6 py-3 font-semibold">Time</th>
                      <th className="px-6 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredVisitors.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{v.visitorName}</p>
                          <p className="text-xs font-mono text-gray-500">{v.badgeNumber} • {v.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-700 max-w-xs">{v.purpose}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded font-semibold ${
                              v.areaAccessed === "Flight Hangar" || v.areaAccessed === "Apron Zone"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : v.areaAccessed === "Simulator Complex"
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {v.areaAccessed}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-800">{v.hostStaffName}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          In: {v.entryTime}
                          {v.exitTime && <span className="block text-green-700 font-semibold">Out: {v.exitTime}</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {v.status === "inside" ? (
                            <button
                              onClick={() => handleCheckout(v.id)}
                              className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-medium transition"
                            >
                              Check Out
                            </button>
                          ) : (
                            <span className="text-xs text-green-600 font-bold">✓ Departed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* New Gate Pass Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <h3 className="font-semibold text-gray-900 mb-1">Issue Visitor Gate Pass</h3>
            <p className="text-xs text-gray-500 mb-4">Register visitor ID & assign security airside area clearance</p>
            <form onSubmit={handleRegisterVisitor} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Visitor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DGCA Inspector, Vendor, Parent"
                  value={newVisitor.visitorName}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitorName: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 00000"
                  value={newVisitor.phone}
                  onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>

              <div>
                <SearchableSelect
                  label="Area / Security Zone"
                  value={newVisitor.areaAccessed}
                  onChange={(val) =>
                    setNewVisitor({ ...newVisitor, areaAccessed: val as VisitorLog["areaAccessed"] })
                  }
                  options={[
                    { value: "General Campus", label: "General Campus / Reception" },
                    { value: "Admin Office", label: "Admin & Accounts Office" },
                    { value: "Simulator Complex", label: "Simulator Complex" },
                    { value: "Flight Hangar", label: "Flight Hangar (Restricted Airside)" },
                    { value: "Apron Zone", label: "Apron Zone (High Security Airside)" },
                  ]}
                />
              </div>

              <div>
                <SearchableSelect
                  label="Host Staff Member"
                  value={newVisitor.hostStaffName}
                  onChange={(val) => setNewVisitor({ ...newVisitor, hostStaffName: val })}
                  options={[
                    { value: "Dr. Amit Patel", label: "Dr. Amit Patel (Aviation Mgmt)" },
                    { value: "Capt. Vikram Malhotra", label: "Capt. Vikram Malhotra (Chief Flight Instructor)" },
                    { value: "Prof. Rajesh Kumar", label: "Prof. Rajesh Kumar (Academic Dean)" },
                    { value: "Admissions & Accounts Office", label: "Admissions & Accounts Office" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Purpose of Visit</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Official audit, simulator inspection, parent counseling..."
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-sm transition shadow"
              >
                Issue Digital Gate Pass & Check In
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

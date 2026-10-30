"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { Asset, MaintenanceLog } from "@/lib/types";

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState<"fleet" | "maintenance" | "log_hours">("fleet");
  const [assets, setAssets] = useState<Asset[]>(store.getAssets());
  const [logs, setLogs] = useState<MaintenanceLog[]>(store.getMaintenanceLogs());

  const [selectedAssetId, setSelectedAssetId] = useState("1");
  const [hoursToAdd, setHoursToAdd] = useState(2.5);

  const [newLog, setNewLog] = useState({
    assetId: "1",
    assetName: "Cessna 172 Skyhawk (VT-IRK)",
    description: "",
    performedBy: "Chief AME",
    date: new Date().toISOString().split("T")[0],
    cost: 15000,
    nextDueDate: "",
  });

  const handleAddHours = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateAssetHours(selectedAssetId, hoursToAdd);
    setAssets(store.getAssets());
    alert(`Logged ${hoursToAdd} flight/sim hours successfully!`);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addMaintenanceLog(newLog);
    setLogs(store.getMaintenanceLogs());
    setNewLog({
      assetId: "1",
      assetName: "Cessna 172 Skyhawk (VT-IRK)",
      description: "",
      performedBy: "Chief AME",
      date: new Date().toISOString().split("T")[0],
      cost: 15000,
      nextDueDate: "",
    });
    setActiveTab("maintenance");
  };

  const totalFlightHours = assets
    .filter((a) => a.type === "aircraft")
    .reduce((sum, a) => sum + a.totalHours, 0);

  const totalSimHours = assets
    .filter((a) => a.type === "simulator")
    .reduce((sum, a) => sum + a.totalHours, 0);

  const totalActiveFleet = assets.filter((a) => a.status === "active").length;
  const inspectionDueCount = assets.filter((a) => a.dgcaComplianceStatus === "inspection_due").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-blue-950 rounded-xl p-6 text-white shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-sky-500/30 text-sky-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-sky-400/30">
                Irik.md Section 4.9
              </span>
              <h1 className="text-2xl font-bold mt-2">Aircraft Fleet, Simulators & DGCA Compliance</h1>
              <p className="text-sm text-gray-300">
                Airframe utilization meters, 50/100-hour maintenance scheduling & airworthiness compliance tracking
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("fleet")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "fleet" ? "bg-sky-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                ✈️ Fleet Inventory
              </button>
              <button
                onClick={() => setActiveTab("maintenance")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "maintenance" ? "bg-sky-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                🛠️ Maintenance Logs
              </button>
              <button
                onClick={() => setActiveTab("log_hours")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "log_hours" ? "bg-sky-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
              >
                ⏱️ Log Hours
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Fleet & Simulators</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalActiveFleet} / {assets.length} Units</p>
            <p className="text-xs text-green-600 mt-1">Operational readiness: {Math.round((totalActiveFleet/assets.length)*100)}%</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Aircraft Flight Hours</p>
            <p className="text-2xl font-bold text-sky-600 mt-1">{totalFlightHours.toLocaleString()} Hrs</p>
            <p className="text-xs text-gray-500 mt-1">Cessna 172 & Piper PA-28 fleet</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Simulator Training Hours</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{totalSimHours.toLocaleString()} Hrs</p>
            <p className="text-xs text-gray-500 mt-1">Redbird FMX & ALSIM ALX</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">DGCA Compliance Status</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">Compliant</p>
            <p className="text-xs text-amber-600 mt-1">{inspectionDueCount} inspection due soon</p>
          </div>
        </div>

        {/* Tab 1: Fleet Inventory */}
        {activeTab === "fleet" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs px-2.5 py-1 rounded bg-slate-100 font-mono text-slate-800 font-bold">
                      {asset.registrationNumber}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        asset.status === "active"
                          ? "bg-green-100 text-green-800"
                          : asset.status === "maintenance"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {asset.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{asset.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">{asset.type} Training Resource</p>

                  <div className="my-4 p-3 bg-gray-50 rounded-lg space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Logged Operating Time:</span>
                      <span className="font-bold text-gray-900">{asset.totalHours.toLocaleString()} Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Overhaul:</span>
                      <span className="text-gray-700">{asset.lastMaintenanceDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Next Mandatory Due:</span>
                      <span className="font-semibold text-blue-700">{asset.nextMaintenanceDue}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-between items-center text-xs">
                  <span className="text-gray-500">DGCA Compliance:</span>
                  <span
                    className={`font-semibold ${
                      asset.dgcaComplianceStatus === "compliant"
                        ? "text-green-600"
                        : "text-amber-600 font-bold"
                    }`}
                  >
                    ● {asset.dgcaComplianceStatus === "compliant" ? "Airworthy / Certified" : "Inspection Due"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Maintenance Logs */}
        {activeTab === "maintenance" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Aircraft & Simulator Maintenance Audit Trail</h3>
                <p className="text-xs text-gray-500">Records of 50-hr, 100-hr, avionics calibrations and AME sign-offs</p>
              </div>
              <div className="divide-y divide-gray-100">
                {logs.map((l) => (
                  <div key={l.id} className="p-5 hover:bg-gray-50/80 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{l.assetName}</h4>
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                            ₹{l.cost.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          📅 Service Date: {l.date} | Certified by: <span className="font-medium text-gray-800">{l.performedBy}</span>
                        </p>
                        <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                          {l.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">Next Service Due:</span>
                        <span className="text-xs font-bold text-blue-700">{l.nextDueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Log Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Record Maintenance Action</h3>
              <p className="text-xs text-gray-500 mb-4">Log AME service inspection or simulator repair</p>
              <form onSubmit={handleLogSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Asset</label>
                  <select
                    value={newLog.assetName}
                    onChange={(e) => setNewLog({ ...newLog, assetName: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option value="Cessna 172 Skyhawk (VT-IRK)">Cessna 172 Skyhawk (VT-IRK)</option>
                    <option value="Piper PA-28 Archer (VT-IRA)">Piper PA-28 Archer (VT-IRA)</option>
                    <option value="Redbird FMX Multi-Engine Simulator (SIM-01)">Redbird FMX Sim (SIM-01)</option>
                    <option value="ALSIM ALX FNPT II Simulator (SIM-02)">ALSIM ALX Sim (SIM-02)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Service Description</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Details of inspection, parts replaced, avionics testing..."
                    value={newLog.description}
                    onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Certified AME / Tech</label>
                  <input
                    type="text"
                    required
                    value={newLog.performedBy}
                    onChange={(e) => setNewLog({ ...newLog, performedBy: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Service Date</label>
                    <input
                      type="date"
                      required
                      value={newLog.date}
                      onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Next Due Date</label>
                    <input
                      type="date"
                      required
                      value={newLog.nextDueDate}
                      onChange={(e) => setNewLog({ ...newLog, nextDueDate: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    value={newLog.cost}
                    onChange={(e) => setNewLog({ ...newLog, cost: parseInt(e.target.value) || 0 })}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
                >
                  Save Maintenance Record
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Log Hours */}
        {activeTab === "log_hours" && (
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Log Daily Flight & Simulator Hours</h3>
            <p className="text-xs text-gray-500 mb-5">
              Automatically updates asset tachometer/Hobbs meters and triggers maintenance alert warnings
            </p>
            <form onSubmit={handleAddHours} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Select Aircraft / Simulator</label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.registrationNumber}) — Current: {a.totalHours} hrs
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Hours Flown / Trained Today</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={hoursToAdd}
                  onChange={(e) => setHoursToAdd(parseFloat(e.target.value) || 0)}
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
              </div>
              <div className="p-4 bg-sky-50 rounded-lg text-xs text-sky-800 space-y-1">
                <p className="font-semibold">⚠️ Airworthiness Threshold Notice:</p>
                <p>Mandatory DGCA inspection alert triggers every 50 hours of recorded flight time.</p>
              </div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-lg text-sm transition"
              >
                Log Flight Hours to Meter
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

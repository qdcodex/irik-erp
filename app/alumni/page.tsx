"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { AlumniRecord } from "@/lib/types";
import SearchableSelect from "@/components/SearchableSelect";

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<AlumniRecord[]>(store.getAlumniRecords());
  const [filterBatch, setFilterBatch] = useState<string>("all");

  const [newAlumni, setNewAlumni] = useState({
    name: "",
    rollNo: "",
    course: "Pilot Training / CPL",
    graduationYear: 2025,
    currentCompany: "IndiGo Airlines",
    designation: "First Officer",
    location: "Bangalore",
    referralOptIn: true,
    email: "",
    phone: "",
  });

  const handleAddAlumni = (e: React.FormEvent) => {
    e.preventDefault();
    store.addAlumniRecord(newAlumni);
    setAlumni(store.getAlumniRecords());
    setNewAlumni({
      name: "",
      rollNo: "",
      course: "Pilot Training / CPL",
      graduationYear: 2025,
      currentCompany: "IndiGo Airlines",
      designation: "First Officer",
      location: "Bangalore",
      referralOptIn: true,
      email: "",
      phone: "",
    });
    alert("New graduate added to Alumni Network!");
  };

  const filteredAlumni = alumni.filter((a) => {
    if (filterBatch === "all") return true;
    return a.graduationYear.toString() === filterBatch;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-xl p-6 text-white shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-blue-500/30 text-blue-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-blue-400/30">
                Irik.md Section 4.13
              </span>
              <h1 className="text-2xl font-bold mt-2">Alumni Network & Airline Placements</h1>
              <p className="text-sm text-gray-300">
                Graduate airline career tracking (IndiGo, Air India, Emirates, SpiceJet), mentorship & job referrals
              </p>
            </div>
            <div className="flex items-center space-x-2 min-w-[170px]">
              <SearchableSelect
                value={filterBatch}
                onChange={(val) => setFilterBatch(val)}
                options={[
                  { value: "all", label: "All Batches" },
                  { value: "2024", label: "2024 Batch" },
                  { value: "2023", label: "2023 Batch" },
                  { value: "2022", label: "2022 Batch" },
                ]}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Airline Placement Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Placement Rate</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">94.8%</p>
            <p className="text-xs text-gray-500 mt-1">Commercial Airlines & Airports</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Alumni</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{alumni.length} Registered</p>
            <p className="text-xs text-green-600 mt-1">100% available for mentorship</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top Airline Partner</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">IndiGo & Air India</p>
            <p className="text-xs text-gray-500 mt-1">42 First Officers & Cabin Crew</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">International Postings</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">Emirates & Qatar</p>
            <p className="text-xs text-gray-500 mt-1">Dubai, Doha & Singapore</p>
          </div>
        </div>

        {/* Alumni Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 font-bold font-mono">
                    Class of {a.graduationYear}
                  </span>
                  {a.referralOptIn && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                      ✓ Open to Referrals
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 my-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {a.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{a.name}</h3>
                    <p className="text-xs text-gray-500">{a.course}</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg space-y-1.5 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Airline/Company:</span>
                    <span className="font-bold text-blue-900">{a.currentCompany}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Designation:</span>
                    <span className="font-semibold text-gray-900">{a.designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base / Hub:</span>
                    <span className="font-medium text-gray-700">{a.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t flex justify-between items-center text-xs">
                <span className="text-gray-500">{a.email}</span>
                <a
                  href={`mailto:${a.email}`}
                  className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition"
                >
                  Contact Alumni →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Register New Alumni */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
          <h3 className="font-bold text-gray-900 mb-1">Add Graduate to Alumni & Placement Registry</h3>
          <p className="text-xs text-gray-500 mb-4">Record new airline hires and placement offers</p>
          <form onSubmit={handleAddAlumni} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Graduate Name</label>
                <input
                  type="text"
                  required
                  value={newAlumni.name}
                  onChange={(e) => setNewAlumni({ ...newAlumni, name: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Roll / Batch ID</label>
                <input
                  type="text"
                  required
                  value={newAlumni.rollNo}
                  onChange={(e) => setNewAlumni({ ...newAlumni, rollNo: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Graduation Year</label>
                <input
                  type="number"
                  required
                  value={newAlumni.graduationYear}
                  onChange={(e) => setNewAlumni({ ...newAlumni, graduationYear: parseInt(e.target.value) || 2026 })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Hired By Airline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IndiGo, Air India"
                  value={newAlumni.currentCompany}
                  onChange={(e) => setNewAlumni({ ...newAlumni, currentCompany: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First Officer"
                  value={newAlumni.designation}
                  onChange={(e) => setNewAlumni({ ...newAlumni, designation: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newAlumni.email}
                  onChange={(e) => setNewAlumni({ ...newAlumni, email: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Airport Base Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore (BLR)"
                  value={newAlumni.location}
                  onChange={(e) => setNewAlumni({ ...newAlumni, location: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              Add to Placement Record
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

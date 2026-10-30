"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { AlumniRecord } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import SearchableSelect from "@/components/SearchableSelect";
import {
  Award,
  PlusCircle,
  Search,
  Briefcase,
  Plane,
  Building2,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Users,
  X,
  Send,
  Lock,
  Sparkles,
} from "lucide-react";

export default function AlumniPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const canManage = isAdmin || isStaff;

  const [alumni, setAlumni] = useState<AlumniRecord[]>(store.getAlumniRecords());
  const [filterBatch, setFilterBatch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAlumni, setNewAlumni] = useState({
    name: "",
    rollNo: "",
    course: "Pilot Training / CPL",
    graduationYear: 2025,
    currentCompany: "IndiGo Airlines",
    designation: "First Officer",
    location: "Bangalore (BLR)",
    referralOptIn: true,
    email: "",
    phone: "",
  });

  const handleAddAlumni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    store.addAlumniRecord(newAlumni);
    setAlumni(store.getAlumniRecords());
    setNewAlumni({
      name: "",
      rollNo: "",
      course: "Pilot Training / CPL",
      graduationYear: 2025,
      currentCompany: "IndiGo Airlines",
      designation: "First Officer",
      location: "Bangalore (BLR)",
      referralOptIn: true,
      email: "",
      phone: "",
    });
    setShowAddModal(false);
  };

  const filteredAlumni = alumni.filter((a) => {
    const matchesBatch = filterBatch === "all" || a.graduationYear.toString() === filterBatch;
    const matchesSearch =
      !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  const getAirlineBadge = (company: string) => {
    const c = company.toLowerCase();
    if (c.includes("indigo")) {
      return "bg-blue-50 text-blue-800 border-blue-200";
    }
    if (c.includes("air india")) {
      return "bg-rose-50 text-rose-800 border-rose-200";
    }
    if (c.includes("emirates") || c.includes("qatar")) {
      return "bg-amber-50 text-amber-900 border-amber-200";
    }
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Cockpit Command Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-slate-800/80">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-blue-400" />
                  Alumni & Corporate Placement Registry
                </span>

                {/* Role-Based Indicator Badge */}
                {canManage ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Placement Officer Access
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-400" />
                    Cadet Mentorship Network
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                <Plane className="w-6 h-6 text-blue-400 transform -rotate-45" />
                Alumni Network & Airline Placements
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Graduate airline career tracking across IndiGo, Air India, Emirates, SpiceJet, active mentorship & fast-track pilot referrals.
              </p>
            </div>

            {/* Header Controls: Search, Batch Filter & Role-Restricted Add CTA */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div className="min-w-[150px]">
                <SearchableSelect
                  value={filterBatch}
                  onChange={(val) => setFilterBatch(val)}
                  options={[
                    { value: "all", label: "All Batches" },
                    { value: "2025", label: "Class of 2025" },
                    { value: "2024", label: "Class of 2024" },
                    { value: "2023", label: "Class of 2023" },
                    { value: "2022", label: "Class of 2022" },
                  ]}
                  size="sm"
                />
              </div>

              {/* Add Graduate Button — HIDDEN FOR STUDENTS/PARENTS */}
              {canManage && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Register Placement</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Airline Placement KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Placement Success Rate
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">94.8%</p>
            <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              Commercial Airlines & Aerodromes
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Active Alumni Network
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-blue-600 mt-2 font-mono">{alumni.length} Aviators</p>
            <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Available for Cadet Mentorship</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Top Domestic Partners
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
                <Plane className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-black text-slate-900 mt-2 truncate">IndiGo & Air India</p>
            <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              42 First Officers & Senior Cabin Crew
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                International Carriers
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-black text-slate-900 mt-2 truncate">Emirates & Qatar</p>
            <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
              Dubai, Doha & Singapore Hubs
            </p>
          </div>
        </div>

        {/* Search Bar & Filter Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by alumni name, airline, designation, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredAlumni.length}</strong> verified graduates
          </div>
        </div>

        {/* Alumni Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Batch & Referral Status */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold font-mono border border-slate-200">
                    Class of {a.graduationYear}
                  </span>

                  {a.referralOptIn && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Open to Referrals
                    </span>
                  )}
                </div>

                {/* Profile Header */}
                <div className="flex items-center gap-3 my-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
                    {a.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition">
                      {a.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">{a.course}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Roll: {a.rollNo}</p>
                  </div>
                </div>

                {/* Employment Details Box */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2 text-xs mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Airline / Employer:</span>
                    <span
                      className={`font-bold px-2 py-0.2 rounded text-[11px] border ${getAirlineBadge(
                        a.currentCompany
                      )}`}
                    >
                      {a.currentCompany}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Current Designation:</span>
                    <span className="font-semibold text-slate-800">{a.designation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Base / Airport:</span>
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {a.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Action & Contact */}
              <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">
                  {a.email}
                </span>

                <a
                  href={`mailto:${a.email}?subject=IRIK%20Aviation%20Academy%20Mentorship%20Inquiry`}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition flex items-center gap-1 shadow-2xs"
                >
                  <Mail className="w-3 h-3" />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredAlumni.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No graduates found</h4>
            <p className="text-xs text-slate-400">
              Try adjusting your batch filter or search keywords.
            </p>
          </div>
        )}

        {/* ROLE-PROTECTED MODAL: ADD GRADUATE (ONLY ACCESSIBLE TO ADMIN / STAFF) */}
        {canManage && showAddModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight">Register Graduate Placement</h3>
                    <p className="text-[11px] text-slate-300">Add corporate placement record to alumni directory</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleAddAlumni} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Graduate Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Das"
                      value={newAlumni.name}
                      onChange={(e) => setNewAlumni({ ...newAlumni, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Roll / Batch ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CPL-2024-042"
                      value={newAlumni.rollNo}
                      onChange={(e) => setNewAlumni({ ...newAlumni, rollNo: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Graduation Year *
                    </label>
                    <input
                      type="number"
                      required
                      min={2018}
                      max={2030}
                      value={newAlumni.graduationYear}
                      onChange={(e) =>
                        setNewAlumni({ ...newAlumni, graduationYear: parseInt(e.target.value) || 2025 })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hired By Airline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IndiGo Airlines"
                      value={newAlumni.currentCompany}
                      onChange={(e) => setNewAlumni({ ...newAlumni, currentCompany: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Designation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. First Officer (A320)"
                      value={newAlumni.designation}
                      onChange={(e) => setNewAlumni({ ...newAlumni, designation: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="graduate@airline.com"
                      value={newAlumni.email}
                      onChange={(e) => setNewAlumni({ ...newAlumni, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Airport Base Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bangalore (BLR)"
                      value={newAlumni.location}
                      onChange={(e) => setNewAlumni({ ...newAlumni, location: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Open to Cadet Mentorship & Referrals</p>
                    <p className="text-[11px] text-slate-500">Allows active flight students to reach out for interview prep</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newAlumni.referralOptIn}
                    onChange={(e) => setNewAlumni({ ...newAlumni, referralOptIn: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save to Placement Record</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

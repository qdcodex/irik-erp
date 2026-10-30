"use client";

import { useState, useMemo } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import {
  InstituteSettings,
  AuditLog,
  Course,
  TrainingVenue,
  AcademicProgram,
  FeeCategoryHead,
} from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import SearchableSelect from "@/components/SearchableSelect";
import {
  Building2,
  Bell,
  CreditCard,
  ShieldCheck,
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  BookOpen,
  MapPin,
  GraduationCap,
  DollarSign,
  Layers,
  Plane,
  Lock,
  Save,
  Check,
  ChevronRight,
  Database,
  Sliders,
  Settings,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [activeMainTab, setActiveMainTab] = useState<"master_data" | "profile" | "notifications" | "payments" | "audit">("master_data");
  const [activeMasterSubTab, setActiveMasterSubTab] = useState<"subjects" | "venues" | "programs" | "fee_heads">("subjects");

  // Master Data States
  const [courses, setCourses] = useState<Course[]>(store.getCourses());
  const [venues, setVenues] = useState<TrainingVenue[]>(store.getVenues());
  const [programs, setPrograms] = useState<AcademicProgram[]>(store.getPrograms());
  const [feeHeads, setFeeHeads] = useState<FeeCategoryHead[]>(store.getFeeHeads());

  // Institutional Settings State
  const [settings, setSettings] = useState<InstituteSettings>(store.getInstituteSettings());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(store.getAuditLogs());
  const [searchAudit, setSearchAudit] = useState("");
  const [masterSearch, setMasterSearch] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; name: string; type: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Forms State
  const [newSubject, setNewSubject] = useState({
    code: "",
    name: "",
    credits: 4,
    semester: 1,
    instructor: "Capt. Vikram Malhotra",
    department: "Flight Operations & Training",
    courseType: "Theory" as Course["courseType"],
    totalHours: 45,
  });

  const [newVenue, setNewVenue] = useState({
    code: "",
    name: "",
    type: "Lecture Hall" as TrainingVenue["type"],
    capacity: 40,
    building: "Academic Block A",
    status: "Active" as TrainingVenue["status"],
    equippedDevice: "",
  });

  const [newProgram, setNewProgram] = useState({
    code: "",
    name: "",
    cadre: "Flight Operations",
    durationSemesters: 4,
    dgcaApproved: true,
    intakeCapacity: 40,
  });

  const [newFeeHead, setNewFeeHead] = useState({
    code: "",
    name: "",
    applicableProgram: "All Programs",
    defaultAmount: 50000,
    frequency: "Per Semester" as FeeCategoryHead["frequency"],
    refundable: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Profile Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    store.updateInstituteSettings(settings);
    store.addAuditLog({
      user: user?.username || "admin",
      action: "UPDATE",
      module: "Settings",
      details: "Updated institute configurations & communication channel parameters",
    });
    setAuditLogs(store.getAuditLogs());
    showToast("Institute Settings and Parameters Saved Successfully!");
  };

  // SUBJECT HANDLERS
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    const created = store.addCourse(newSubject);
    setCourses(store.getCourses());
    setShowAddModal(false);
    showToast(`Subject ${created.name} (${created.code}) created successfully`);
    setNewSubject({
      code: "",
      name: "",
      credits: 4,
      semester: 1,
      instructor: "Capt. Vikram Malhotra",
      department: "Flight Operations & Training",
      courseType: "Theory",
      totalHours: 45,
    });
  };

  const handleUpdateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingItem) return;

    store.updateCourse(editingItem.id, editingItem);
    setCourses(store.getCourses());
    setEditingItem(null);
    showToast(`Subject ${editingItem.name} updated`);
  };

  // VENUE HANDLERS
  const handleAddVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    const created = store.addVenue(newVenue);
    setVenues(store.getVenues());
    setShowAddModal(false);
    showToast(`Venue ${created.name} added`);
  };

  const handleUpdateVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingItem) return;

    store.updateVenue(editingItem.id, editingItem);
    setVenues(store.getVenues());
    setEditingItem(null);
    showToast(`Venue ${editingItem.name} updated`);
  };

  // PROGRAM HANDLERS
  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    const created = store.addProgram(newProgram);
    setPrograms(store.getPrograms());
    setShowAddModal(false);
    showToast(`Academic Program ${created.name} added`);
  };

  const handleUpdateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingItem) return;

    store.updateProgram(editingItem.id, editingItem);
    setPrograms(store.getPrograms());
    setEditingItem(null);
    showToast(`Program ${editingItem.name} updated`);
  };

  // FEE HEAD HANDLERS
  const handleAddFeeHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    const created = store.addFeeHead(newFeeHead);
    setFeeHeads(store.getFeeHeads());
    setShowAddModal(false);
    showToast(`Fee Head ${created.name} added`);
  };

  const handleUpdateFeeHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingItem) return;

    store.updateFeeHead(editingItem.id, editingItem);
    setFeeHeads(store.getFeeHeads());
    setEditingItem(null);
    showToast(`Fee Head ${editingItem.name} updated`);
  };

  // DELETE DISPATCHER
  const handleConfirmDelete = () => {
    if (!isAdmin || !deleteConfirmItem) return;

    if (deleteConfirmItem.type === "subject") {
      store.deleteCourse(deleteConfirmItem.id);
      setCourses(store.getCourses());
    } else if (deleteConfirmItem.type === "venue") {
      store.deleteVenue(deleteConfirmItem.id);
      setVenues(store.getVenues());
    } else if (deleteConfirmItem.type === "program") {
      store.deleteProgram(deleteConfirmItem.id);
      setPrograms(store.getPrograms());
    } else if (deleteConfirmItem.type === "fee_head") {
      store.deleteFeeHead(deleteConfirmItem.id);
      setFeeHeads(store.getFeeHeads());
    }

    setDeleteConfirmItem(null);
    showToast(`Removed master data item successfully`);
  };

  // Filtered lists for Master Data
  const filteredCourses = useMemo(() => {
    return courses.filter(
      (c) =>
        !masterSearch ||
        c.name.toLowerCase().includes(masterSearch.toLowerCase()) ||
        c.code.toLowerCase().includes(masterSearch.toLowerCase()) ||
        c.instructor.toLowerCase().includes(masterSearch.toLowerCase())
    );
  }, [courses, masterSearch]);

  const filteredVenues = useMemo(() => {
    return venues.filter(
      (v) =>
        !masterSearch ||
        v.name.toLowerCase().includes(masterSearch.toLowerCase()) ||
        v.code.toLowerCase().includes(masterSearch.toLowerCase()) ||
        v.type.toLowerCase().includes(masterSearch.toLowerCase())
    );
  }, [venues, masterSearch]);

  const filteredPrograms = useMemo(() => {
    return programs.filter(
      (p) =>
        !masterSearch ||
        p.name.toLowerCase().includes(masterSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(masterSearch.toLowerCase()) ||
        p.cadre.toLowerCase().includes(masterSearch.toLowerCase())
    );
  }, [programs, masterSearch]);

  const filteredFeeHeads = useMemo(() => {
    return feeHeads.filter(
      (f) =>
        !masterSearch ||
        f.name.toLowerCase().includes(masterSearch.toLowerCase()) ||
        f.code.toLowerCase().includes(masterSearch.toLowerCase())
    );
  }, [feeHeads, masterSearch]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(
      (log) =>
        !searchAudit ||
        log.module.toLowerCase().includes(searchAudit.toLowerCase()) ||
        log.details.toLowerCase().includes(searchAudit.toLowerCase()) ||
        log.user.toLowerCase().includes(searchAudit.toLowerCase())
    );
  }, [auditLogs, searchAudit]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Top Header Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold border border-indigo-400/30 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  System Master Setup & Institutional Controls
                </span>
                {isAdmin ? (
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Admin Access
                  </span>
                ) : (
                  <span className="bg-slate-700/60 text-slate-300 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-600/40 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Read Only
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Master Data Setup & Academy Configuration
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                Configure syllabus subjects, flight simulator bays, academic programs, tuition fee heads, payment gateways, and system parameters.
              </p>
            </div>

            {/* Main Navigation Tabs */}
            <div className="flex flex-wrap gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 shrink-0">
              <button
                onClick={() => setActiveMainTab("master_data")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeMainTab === "master_data"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Master Data Setup</span>
              </button>
              <button
                onClick={() => setActiveMainTab("profile")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeMainTab === "profile"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Academy Profile</span>
              </button>
              <button
                onClick={() => setActiveMainTab("notifications")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeMainTab === "notifications"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveMainTab("payments")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeMainTab === "payments"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payment Gateway</span>
              </button>
              <button
                onClick={() => setActiveMainTab("audit")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeMainTab === "audit"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Audit Logs</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN TAB 1: MASTER DATA SETUP */}
        {activeMainTab === "master_data" && (
          <div className="space-y-5">
            {/* Master Data Sub-Nav Pills + Unified Control Bar */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Sub-Nav Selector */}
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => {
                    setActiveMasterSubTab("subjects");
                    setMasterSearch("");
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeMasterSubTab === "subjects"
                      ? "bg-white text-blue-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Subjects Master ({courses.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveMasterSubTab("venues");
                    setMasterSearch("");
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeMasterSubTab === "venues"
                      ? "bg-white text-blue-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Venues & Simulators ({venues.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveMasterSubTab("programs");
                    setMasterSearch("");
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeMasterSubTab === "programs"
                      ? "bg-white text-blue-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Programs Master ({programs.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveMasterSubTab("fee_heads");
                    setMasterSearch("");
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeMasterSubTab === "fee_heads"
                      ? "bg-white text-blue-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Fee Category Heads ({feeHeads.length})</span>
                </button>
              </div>

              {/* Actions & Search */}
              <div className="flex items-center gap-2.5">
                <div className="relative min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search master data..."
                    value={masterSearch}
                    onChange={(e) => setMasterSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {isAdmin && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                )}
              </div>
            </div>

            {/* SUB-TAB 1: SUBJECTS MASTER TABLE */}
            {activeMasterSubTab === "subjects" && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Academic Subjects & Syllabus Master</h3>
                    <p className="text-xs text-slate-500">
                      Standard course codes, credit weightages, semester levels, and assigned instructors
                    </p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    {filteredCourses.length} Subjects Defined
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                        <th className="px-5 py-3.5">Subject Code</th>
                        <th className="px-5 py-3.5">Subject Name</th>
                        <th className="px-4 py-3.5">Credits</th>
                        <th className="px-4 py-3.5">Semester</th>
                        <th className="px-4 py-3.5">Assigned Instructor / Dept</th>
                        {isAdmin && <th className="px-5 py-3.5 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {filteredCourses.length === 0 ? (
                        <tr>
                          <td colSpan={isAdmin ? 6 : 5} className="text-center py-10 text-slate-400 italic">
                            No subjects found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredCourses.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/80 transition">
                            <td className="px-5 py-3.5 font-mono font-bold text-blue-700">
                              {c.code}
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-slate-900">
                              {c.name}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                                {c.credits} Credits
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium border border-blue-200">
                                Semester {c.semester}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 font-medium">
                              {c.instructor}
                            </td>
                            {isAdmin && (
                              <td className="px-5 py-3.5 text-right space-x-1">
                                <button
                                  onClick={() => setEditingItem({ ...c, _type: "subject" })}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                  title="Edit Subject"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmItem({ id: c.id, name: c.name, type: "subject" })}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                                  title="Delete Subject"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: VENUES & SIMULATOR BAYS MASTER */}
            {activeMasterSubTab === "venues" && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Training Venues, Hangar Bays & Simulators</h3>
                    <p className="text-xs text-slate-500">
                      Physical lecture halls, synthetic flight trainers, and aerodrome airside line staging
                    </p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                    {filteredVenues.length} Venues Configured
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                        <th className="px-5 py-3.5">Venue Code</th>
                        <th className="px-5 py-3.5">Facility Name</th>
                        <th className="px-4 py-3.5">Facility Type</th>
                        <th className="px-4 py-3.5">Capacity</th>
                        <th className="px-4 py-3.5">Building Location</th>
                        <th className="px-4 py-3.5">Status</th>
                        {isAdmin && <th className="px-5 py-3.5 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {filteredVenues.length === 0 ? (
                        <tr>
                          <td colSpan={isAdmin ? 7 : 6} className="text-center py-10 text-slate-400 italic">
                            No training facilities found.
                          </td>
                        </tr>
                      ) : (
                        filteredVenues.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-50/80 transition">
                            <td className="px-5 py-3.5 font-mono font-bold text-indigo-700">
                              {v.code}
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="font-bold text-slate-900">{v.name}</p>
                              {v.equippedDevice && (
                                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{v.equippedDevice}</p>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                                {v.type}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-900">
                              {v.capacity} Seats / Cadets
                            </td>
                            <td className="px-4 py-3.5 text-slate-600">
                              {v.building}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                {v.status}
                              </span>
                            </td>
                            {isAdmin && (
                              <td className="px-5 py-3.5 text-right space-x-1">
                                <button
                                  onClick={() => setEditingItem({ ...v, _type: "venue" })}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                  title="Edit Venue"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmItem({ id: v.id, name: v.name, type: "venue" })}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                                  title="Delete Venue"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: ACADEMIC PROGRAMS MASTER */}
            {activeMasterSubTab === "programs" && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Aviation Programs & Cadres Master</h3>
                    <p className="text-xs text-slate-500">
                      Approved degree courses, pilot flight licenses, and cabin crew diploma frameworks
                    </p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                    {filteredPrograms.length} Programs
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                        <th className="px-5 py-3.5">Program Code</th>
                        <th className="px-5 py-3.5">Program Name</th>
                        <th className="px-4 py-3.5">Cadre Stream</th>
                        <th className="px-4 py-3.5">Duration</th>
                        <th className="px-4 py-3.5">Intake Limit</th>
                        <th className="px-4 py-3.5">DGCA Approved</th>
                        {isAdmin && <th className="px-5 py-3.5 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {filteredPrograms.length === 0 ? (
                        <tr>
                          <td colSpan={isAdmin ? 7 : 6} className="text-center py-10 text-slate-400 italic">
                            No academic programs found.
                          </td>
                        </tr>
                      ) : (
                        filteredPrograms.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition">
                            <td className="px-5 py-3.5 font-mono font-bold text-purple-700">
                              {p.code}
                            </td>
                            <td className="px-5 py-3.5 font-bold text-slate-900">
                              {p.name}
                            </td>
                            <td className="px-4 py-3.5 text-slate-700 font-medium">
                              {p.cadre}
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-900">
                              {p.durationSemesters} Semesters
                            </td>
                            <td className="px-4 py-3.5 font-mono text-slate-700">
                              {p.intakeCapacity} Cadets / Batch
                            </td>
                            <td className="px-4 py-3.5">
                              {p.dgcaApproved ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  DGCA Approved
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  University Only
                                </span>
                              )}
                            </td>
                            {isAdmin && (
                              <td className="px-5 py-3.5 text-right space-x-1">
                                <button
                                  onClick={() => setEditingItem({ ...p, _type: "program" })}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                  title="Edit Program"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmItem({ id: p.id, name: p.name, type: "program" })}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                                  title="Delete Program"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: FEE HEADS & BILLING CATEGORIES */}
            {activeMasterSubTab === "fee_heads" && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Fee Category Heads & Billing Master</h3>
                    <p className="text-xs text-slate-500">
                      Standard fee heads applied across student accounts, simulator bookings, and flight hour logs
                    </p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    {filteredFeeHeads.length} Fee Heads
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                        <th className="px-5 py-3.5">Fee Head Code</th>
                        <th className="px-5 py-3.5">Category Name</th>
                        <th className="px-4 py-3.5">Applicable Program</th>
                        <th className="px-4 py-3.5">Default Amount</th>
                        <th className="px-4 py-3.5">Billing Frequency</th>
                        <th className="px-4 py-3.5">Refundable</th>
                        {isAdmin && <th className="px-5 py-3.5 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {filteredFeeHeads.length === 0 ? (
                        <tr>
                          <td colSpan={isAdmin ? 7 : 6} className="text-center py-10 text-slate-400 italic">
                            No fee heads found.
                          </td>
                        </tr>
                      ) : (
                        filteredFeeHeads.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50/80 transition">
                            <td className="px-5 py-3.5 font-mono font-bold text-emerald-700">
                              {f.code}
                            </td>
                            <td className="px-5 py-3.5 font-bold text-slate-900">
                              {f.name}
                            </td>
                            <td className="px-4 py-3.5 text-slate-700 font-medium">
                              {f.applicableProgram}
                            </td>
                            <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                              ₹{f.defaultAmount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                                {f.frequency}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              {f.refundable ? (
                                <span className="text-[11px] font-semibold text-emerald-700">Yes</span>
                              ) : (
                                <span className="text-[11px] text-slate-400">Non-Refundable</span>
                              )}
                            </td>
                            {isAdmin && (
                              <td className="px-5 py-3.5 text-right space-x-1">
                                <button
                                  onClick={() => setEditingItem({ ...f, _type: "fee_head" })}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                  title="Edit Fee Head"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmItem({ id: f.id, name: f.name, type: "fee_head" })}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                                  title="Delete Fee Head"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MAIN TAB 2: ACADEMY PROFILE & ACCREDITATION */}
        {activeMainTab === "profile" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-3xl space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Institute Profile & Regulatory Accreditation</h3>
              <p className="text-xs text-slate-500">Parameters stamped on student transcripts, ID badges, and flight certificates</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institute Legal Name</label>
                <input
                  type="text"
                  required
                  value={settings.instituteName}
                  onChange={(e) => setSettings({ ...settings, instituteName: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Tagline / Motto</label>
                <input
                  type="text"
                  value={settings.tagLine}
                  onChange={(e) => setSettings({ ...settings, tagLine: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DGCA Approval / FTO Accreditation No</label>
                  <input
                    type="text"
                    value={settings.dgcaApprovalNumber}
                    onChange={(e) => setSettings({ ...settings, dgcaApprovalNumber: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-blue-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Active Academic Year</label>
                  <input
                    type="text"
                    value={settings.academicYear}
                    onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Contact Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Helpdesk Phone</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Physical Address</label>
                <textarea
                  rows={2}
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              {isAdmin && (
                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition shadow-sm flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Institutional Profile</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* MAIN TAB 3: NOTIFICATIONS */}
        {activeMainTab === "notifications" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Communication Channels & Alerts</h3>
              <p className="text-xs text-slate-500">Configure automated dispatch gateways for attendance warnings & exam schedules</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">SMS Gateway Integration</h4>
                  <p className="text-[11px] text-slate-500">Send instant flight cancellation & DGCA schedule SMS alerts</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.smsEnabled}
                  onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">WhatsApp Business API Dispatcher</h4>
                  <p className="text-[11px] text-slate-500">Send fee receipts & candidate admission offers via WhatsApp</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.whatsappEnabled}
                  onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">SMTP Email Server</h4>
                  <p className="text-[11px] text-slate-500">Official notifications from admissions@irik.edu.in</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifEnabled}
                  onChange={(e) => setSettings({ ...settings, emailNotifEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
              >
                Save Preferences
              </button>
            )}
          </div>
        )}

        {/* MAIN TAB 4: PAYMENTS */}
        {activeMainTab === "payments" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Payment Gateway & Merchant Accounts</h3>
              <p className="text-xs text-slate-500">Setup online fee collection parameters for student & parent self-service</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official UPI VPA Handle</label>
                <input
                  type="text"
                  value={settings.upiId}
                  onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-indigo-700"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Razorpay Payment Gateway (Live Cards/Netbanking)</h4>
                  <p className="text-[11px] text-slate-500">Allow parents & students to pay online via Razorpay</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.paymentGatewayEnabled}
                  onChange={(e) => setSettings({ ...settings, paymentGatewayEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
              >
                Save Payment Settings
              </button>
            )}
          </div>
        )}

        {/* MAIN TAB 5: AUDIT LOGS */}
        {activeMainTab === "audit" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">System Security & Operations Audit Trail</h3>
                <p className="text-xs text-slate-500">Immutable ledger of administrative actions and transaction logs</p>
              </div>
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter audit events..."
                  value={searchAudit}
                  onChange={(e) => setSearchAudit(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-bold">
                        {log.module}
                      </span>
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-[11px] text-slate-500">by {log.user}</span>
                    </div>
                    <p className="text-slate-700">{log.details}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD MASTER DATA MODAL */}
        {isAdmin && showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Master Data Entry
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">
                    {activeMasterSubTab === "subjects" && "Add New Subject / Syllabus Course"}
                    {activeMasterSubTab === "venues" && "Add New Training Venue / Simulator Bay"}
                    {activeMasterSubTab === "programs" && "Add New Aviation Program"}
                    {activeMasterSubTab === "fee_heads" && "Add New Fee Category Head"}
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subject Form */}
              {activeMasterSubTab === "subjects" && (
                <form onSubmit={handleAddSubject} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CPL-MET-01"
                        value={newSubject.code}
                        onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Credits</label>
                      <input
                        type="number"
                        min={1}
                        max={24}
                        value={newSubject.credits}
                        onChange={(e) => setNewSubject({ ...newSubject, credits: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aviation Meteorology & Synoptic Charts"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={newSubject.semester}
                        onChange={(e) => setNewSubject({ ...newSubject, semester: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <SearchableSelect
                        label="Course Type"
                        value={newSubject.courseType}
                        onChange={(val) => setNewSubject({ ...newSubject, courseType: val as any })}
                        options={[
                          { value: "Theory", label: "Ground Theory" },
                          { value: "Simulator Lab", label: "Simulator Lab" },
                          { value: "Flight Practical", label: "Flight Practical" },
                          { value: "Cabin Safety", label: "Cabin Safety" }
                        ]}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Instructor / Dept</label>
                    <input
                      type="text"
                      value={newSubject.instructor}
                      onChange={(e) => setNewSubject({ ...newSubject, instructor: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="pt-3 flex gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                    >
                      Create Subject
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Venue Form */}
              {activeMasterSubTab === "venues" && (
                <form onSubmit={handleAddVenue} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Venue Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SIM-BAY-03"
                        value={newVenue.code}
                        onChange={(e) => setNewVenue({ ...newVenue, code: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (Persons)</label>
                      <input
                        type="number"
                        min={1}
                        value={newVenue.capacity}
                        onChange={(e) => setNewVenue({ ...newVenue, capacity: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Diamond DA42 Simulator Bay"
                      value={newVenue.name}
                      onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <SearchableSelect
                        label="Facility Type"
                        value={newVenue.type}
                        onChange={(val) => setNewVenue({ ...newVenue, type: val as any })}
                        options={["Lecture Hall", "Flight Simulator Bay", "Apron / Flight Line", "Cabin Mockup Hall", "Avionics Lab"]}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Building Location</label>
                      <input
                        type="text"
                        value={newVenue.building}
                        onChange={(e) => setNewVenue({ ...newVenue, building: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Equipped Hardware / Model</label>
                    <input
                      type="text"
                      placeholder="e.g. Frasca 142 Multi-Engine Flight Trainer"
                      value={newVenue.equippedDevice}
                      onChange={(e) => setNewVenue({ ...newVenue, equippedDevice: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="pt-3 flex gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                    >
                      Add Venue
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Program Form */}
              {activeMasterSubTab === "programs" && (
                <form onSubmit={handleAddProgram} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Program Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ATPL-INT-01"
                        value={newProgram.code}
                        onChange={(e) => setNewProgram({ ...newProgram, code: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Semesters)</label>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={newProgram.durationSemesters}
                        onChange={(e) => setNewProgram({ ...newProgram, durationSemesters: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Program Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Integrated Airline Transport Pilot License"
                      value={newProgram.name}
                      onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Cadre Stream</label>
                      <input
                        type="text"
                        value={newProgram.cadre}
                        onChange={(e) => setNewProgram({ ...newProgram, cadre: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Intake Capacity</label>
                      <input
                        type="number"
                        min={1}
                        value={newProgram.intakeCapacity}
                        onChange={(e) => setNewProgram({ ...newProgram, intakeCapacity: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                    >
                      Create Program
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Fee Head Form */}
              {activeMasterSubTab === "fee_heads" && (
                <form onSubmit={handleAddFeeHead} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. FEE-AVN-MED"
                        value={newFeeHead.code}
                        onChange={(e) => setNewFeeHead({ ...newFeeHead, code: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Default Amount (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={newFeeHead.defaultAmount}
                        onChange={(e) => setNewFeeHead({ ...newFeeHead, defaultAmount: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DGCA Class 1 Medical Renewal Fee"
                      value={newFeeHead.name}
                      onChange={(e) => setNewFeeHead({ ...newFeeHead, name: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <SearchableSelect
                        label="Billing Frequency"
                        value={newFeeHead.frequency}
                        onChange={(val) => setNewFeeHead({ ...newFeeHead, frequency: val as any })}
                        options={["Per Semester", "One-Time", "Per Flying Hour", "Annual"]}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Applicable Program</label>
                      <input
                        type="text"
                        value={newFeeHead.applicableProgram}
                        onChange={(e) => setNewFeeHead({ ...newFeeHead, applicableProgram: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                    >
                      Save Fee Head
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* EDIT MASTER DATA MODAL */}
        {isAdmin && editingItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Update Master Data
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">Edit {editingItem.name}</h3>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editingItem._type === "subject" && (
                <form onSubmit={handleUpdateSubject} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Code</label>
                      <input
                        type="text"
                        required
                        value={editingItem.code}
                        onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Credits</label>
                      <input
                        type="number"
                        min={1}
                        value={editingItem.credits}
                        onChange={(e) => setEditingItem({ ...editingItem, credits: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Title</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                      <input
                        type="number"
                        min={1}
                        value={editingItem.semester}
                        onChange={(e) => setEditingItem({ ...editingItem, semester: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Instructor</label>
                      <input
                        type="text"
                        value={editingItem.instructor}
                        onChange={(e) => setEditingItem({ ...editingItem, instructor: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {editingItem._type === "venue" && (
                <form onSubmit={handleUpdateVenue} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Venue Code</label>
                      <input
                        type="text"
                        required
                        value={editingItem.code}
                        onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity</label>
                      <input
                        type="number"
                        min={1}
                        value={editingItem.capacity}
                        onChange={(e) => setEditingItem({ ...editingItem, capacity: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <SearchableSelect
                        label="Facility Type"
                        value={editingItem.type}
                        onChange={(val) => setEditingItem({ ...editingItem, type: val as any })}
                        options={["Lecture Hall", "Flight Simulator Bay", "Apron / Flight Line", "Cabin Mockup Hall", "Avionics Lab"]}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Building</label>
                      <input
                        type="text"
                        value={editingItem.building}
                        onChange={(e) => setEditingItem({ ...editingItem, building: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {editingItem._type === "program" && (
                <form onSubmit={handleUpdateProgram} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Program Code</label>
                      <input
                        type="text"
                        required
                        value={editingItem.code}
                        onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Semesters)</label>
                      <input
                        type="number"
                        min={1}
                        value={editingItem.durationSemesters}
                        onChange={(e) => setEditingItem({ ...editingItem, durationSemesters: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Program Name</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="pt-3 flex gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {editingItem._type === "fee_head" && (
                <form onSubmit={handleUpdateFeeHead} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Code</label>
                      <input
                        type="text"
                        required
                        value={editingItem.code}
                        onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Default Amount (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={editingItem.defaultAmount}
                        onChange={(e) => setEditingItem({ ...editingItem, defaultAmount: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Head Title</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="pt-3 flex gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {isAdmin && deleteConfirmItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">Delete Master Record?</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove <strong className="text-slate-800">{deleteConfirmItem.name}</strong> from master data?
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-xs"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirmItem(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

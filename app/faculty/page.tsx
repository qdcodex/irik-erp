"use client";

import { useState, useMemo } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { Faculty } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  Award,
  Plane,
  ShieldCheck,
  Star,
  BookOpen,
  Clock,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  BadgeCheck,
  Lock,
  Layers,
  ChevronRight,
  User,
  GraduationCap,
  MapPin,
} from "lucide-react";

const DEPARTMENTS = [
  "Flight Operations & Training",
  "Aviation Management",
  "Cabin Safety & In-Flight Services",
  "Aeronautics & Avionics",
  "Air Traffic Management & Law",
];

const QUALIFICATIONS = [
  "ATPL / DGCA Chief Flight Instructor (CFI)",
  "Senior Flight Instructor (SFI)",
  "Ph.D. in Air Transport Economics",
  "Ph.D. in Aerospace Engineering",
  "M.Tech in Airspace Navigation",
  "Lead DGCA Cabin Safety Auditor",
  "Master of Aviation Law",
];

export default function FacultyPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [faculties, setFaculties] = useState<Faculty[]>(store.getFaculties());
  const [activeTab, setActiveTab] = useState<"directory" | "flight_cadre" | "workload">("directory");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals & State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deleteConfirmFaculty, setDeleteConfirmFaculty] = useState<Faculty | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Faculty Form
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    phone: "+91 ",
    department: DEPARTMENTS[0],
    qualification: QUALIFICATIONS[0],
    designation: "Flight Instructor",
    dgcaLicenseNo: "DGCA-FI-",
    flightHours: 1200,
    typeRating: "Cessna 172R",
    specialization: "Ab-Initio Ground & Flight Training",
    status: "Active" as Faculty["status"],
    rating: 4.8,
    assignedCourses: ["Pilot Training"],
    joiningDate: new Date().toISOString().split("T")[0],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered List
  const filteredFaculties = useMemo(() => {
    return faculties.filter((f) => {
      const matchesSearch =
        !searchQuery ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.phone.includes(searchQuery) ||
        (f.dgcaLicenseNo && f.dgcaLicenseNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.designation && f.designation.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDept = selectedDept === "all" || f.department === selectedDept;
      const matchesStatus = statusFilter === "all" || f.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [faculties, searchQuery, selectedDept, statusFilter]);

  // Counts
  const totalFaculty = faculties.length;
  const flightInstructorsCount = faculties.filter(
    (f) => f.department.includes("Flight") || (f.flightHours && f.flightHours > 1000)
  ).length;
  const activeDutyCount = faculties.filter((f) => f.status === "Active" || f.status === "Flight Line").length;

  // Add Faculty (Admin only)
  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    const created = store.addFaculty(newFaculty);
    setFaculties(store.getFaculties());
    setShowAddModal(false);
    showToast(`Added ${created.name} to Faculty & Flight Cadre`);

    // Reset
    setNewFaculty({
      name: "",
      email: "",
      phone: "+91 ",
      department: DEPARTMENTS[0],
      qualification: QUALIFICATIONS[0],
      designation: "Flight Instructor",
      dgcaLicenseNo: "DGCA-FI-",
      flightHours: 1200,
      typeRating: "Cessna 172R",
      specialization: "Ab-Initio Ground & Flight Training",
      status: "Active",
      rating: 4.8,
      assignedCourses: ["Pilot Training"],
      joiningDate: new Date().toISOString().split("T")[0],
    });
  };

  // Update Faculty (Admin only)
  const handleUpdateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingFaculty) return;

    store.updateFaculty(editingFaculty.id, editingFaculty);
    setFaculties(store.getFaculties());
    setEditingFaculty(null);
    setSelectedFaculty(null);
    showToast(`Faculty profile updated for ${editingFaculty.name}`);
  };

  // Delete Faculty (Admin only)
  const handleDeleteFaculty = () => {
    if (!isAdmin || !deleteConfirmFaculty) return;

    store.deleteFaculty(deleteConfirmFaculty.id);
    setFaculties(store.getFaculties());
    setDeleteConfirmFaculty(null);
    setSelectedFaculty(null);
    showToast(`Removed faculty member from academy records`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "Name,Designation,Department,Email,Phone,Qualification,DGCA License,Flight Hours,Rating,Status\n";
    const rows = filteredFaculties
      .map((f) => {
        return `"${f.name}","${f.designation || ""}","${f.department}","${f.email}","${f.phone}","${f.qualification}","${f.dgcaLicenseNo || "N/A"}","${f.flightHours || 0} hrs","${f.rating || 4.8}/5.0","${f.status || "Active"}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `IRIK_Faculty_Roster_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Badge Helper
  const getStatusBadge = (status?: Faculty["status"]) => {
    switch (status) {
      case "Flight Line":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            <Plane className="w-3 h-3 text-sky-600" />
            Flight Line
          </span>
        );
      case "Simulator Shift":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            <Clock className="w-3 h-3 text-indigo-600" />
            Simulator Shift
          </span>
        );
      case "On Leave":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            On Leave
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Active
          </span>
        );
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Toast */}
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
                  <Plane className="w-3.5 h-3.5" />
                  Flight Instructors & Academic Faculty
                </span>
                {isAdmin ? (
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Admin Staff Manager
                  </span>
                ) : (
                  <span className="bg-slate-700/60 text-slate-300 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-600/40 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Read Only Access
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Faculty & Flight Instructor Management
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                Directory of DGCA certified Chief Flight Instructors (CFI), Simulator Instructors (SFI), Aviation Professors, and Cabin Crew Trainers.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 shrink-0">
              <button
                onClick={() => setActiveTab("directory")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "directory"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>All Faculty ({totalFaculty})</span>
              </button>
              <button
                onClick={() => setActiveTab("flight_cadre")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "flight_cadre"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Flight Instructors & SFI ({flightInstructorsCount})</span>
              </button>
              <button
                onClick={() => setActiveTab("workload")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "workload"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Teaching Load & Ratings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Academic Staff</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalFaculty}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Across 5 departments</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Flight Instructors</p>
            <p className="text-2xl font-bold text-indigo-700 mt-2">{flightInstructorsCount}</p>
            <p className="text-[11px] text-indigo-600/80 mt-0.5">CFI & SFI DGCA rated</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">On Active Duty</p>
            <p className="text-2xl font-bold text-emerald-700 mt-2">{activeDutyCount}</p>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">Ground & simulator shifts</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Student Feedback</p>
            <p className="text-2xl font-bold text-amber-700 mt-2 flex items-center gap-1">
              <span>4.85</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </p>
            <p className="text-[11px] text-amber-600/80 mt-0.5">Average instructor rating</p>
          </div>
        </div>

        {/* Unified Search & Control Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search faculty name, license, designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            <div className="relative min-w-[200px]">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-xs font-medium bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none cursor-pointer"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Flight Line">Flight Line</option>
                <option value="Simulator Shift">Simulator Shift</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Faculty</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: ALL FACULTY DIRECTORY (Interactive Cards) */}
        {activeTab === "directory" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFaculties.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs italic bg-white rounded-xl border border-slate-200">
                No faculty members found matching your search.
              </div>
            ) : (
              filteredFaculties.map((faculty) => (
                <div
                  key={faculty.id}
                  onClick={() => setSelectedFaculty(faculty)}
                  className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between space-y-4 relative group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                          {faculty.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                            {faculty.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {faculty.designation || faculty.department}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(faculty.status)}
                    </div>

                    <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 text-xs space-y-1.5">
                      <p className="text-slate-700 flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{faculty.email}</span>
                      </p>
                      <p className="text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{faculty.phone}</span>
                      </p>
                      {faculty.dgcaLicenseNo && (
                        <p className="text-slate-700 flex items-center gap-1.5 font-mono text-[11px]">
                          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>License: {faculty.dgcaLicenseNo}</span>
                        </p>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800 truncate">
                        {faculty.qualification}
                      </p>
                      {faculty.specialization && (
                        <p className="text-slate-500 line-clamp-1 text-[10px]">
                          Spec: {faculty.specialization}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      Joined {faculty.joiningDate}
                    </span>
                    <span className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <span>View Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: FLIGHT INSTRUCTORS & SFI CADRE */}
        {activeTab === "flight_cadre" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-900">DGCA Flight & Simulator Instructor Cadre</h3>
                <p className="text-xs text-slate-500">
                  Certified flight instructors with logged flight hours and type ratings for Redbird / ALSIM / Cessna 172
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                DGCA Approved Training Cadre
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th className="px-5 py-3.5">Instructor Name</th>
                    <th className="px-4 py-3.5">DGCA License No</th>
                    <th className="px-4 py-3.5">Flight Hours</th>
                    <th className="px-4 py-3.5">Aircraft / Sim Type Rating</th>
                    <th className="px-4 py-3.5">Current Duty</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {faculties
                    .filter((f) => f.flightHours || f.dgcaLicenseNo)
                    .map((f) => (
                      <tr
                        key={f.id}
                        onClick={() => setSelectedFaculty(f)}
                        className="hover:bg-slate-50/80 transition cursor-pointer"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-slate-900">{f.name}</p>
                          <p className="text-[11px] text-slate-500">{f.designation}</p>
                        </td>
                        <td className="px-4 py-3.5 font-mono font-bold text-blue-700">
                          {f.dgcaLicenseNo || "DGCA-PENDING"}
                        </td>
                        <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                          {f.flightHours ? `${f.flightHours.toLocaleString()} hrs` : "N/A"}
                        </td>
                        <td className="px-4 py-3.5 text-slate-700 font-medium max-w-[220px] truncate" title={f.typeRating}>
                          {f.typeRating || "Single Engine Land"}
                        </td>
                        <td className="px-4 py-3.5">
                          {getStatusBadge(f.status)}
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedFaculty(f)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TEACHING LOAD & RATINGS */}
        {activeTab === "workload" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {faculties.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFaculty(f)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-slate-300 transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{f.name}</h4>
                    <p className="text-xs text-slate-500">{f.department}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-1 rounded border border-amber-200 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{f.rating || 4.8} / 5.0</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Assigned Syllabus Subjects:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {f.assignedCourses && f.assignedCourses.length > 0 ? (
                      f.assignedCourses.map((c, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-[11px] font-medium px-2.5 py-1 rounded border border-blue-200">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="bg-slate-100 text-slate-600 text-[11px] px-2.5 py-1 rounded">
                        Ground Lecture Series
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span>Weekly Commitment: ~14 Hours</span>
                  <span className="text-blue-600 font-semibold">Inspect Full Profile →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Faculty Dossier Modal */}
        {selectedFaculty && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                    {selectedFaculty.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      Faculty Dossier
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-0.5">{selectedFaculty.name}</h3>
                    <p className="text-xs text-slate-500">{selectedFaculty.designation}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Department</span>
                  <span className="font-semibold text-slate-900">{selectedFaculty.department}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Academic Qualification</span>
                  <span className="font-semibold text-slate-900">{selectedFaculty.qualification}</span>
                </div>
                {selectedFaculty.dgcaLicenseNo && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">DGCA License No</span>
                    <span className="font-mono font-bold text-blue-700">{selectedFaculty.dgcaLicenseNo}</span>
                  </div>
                )}
                {selectedFaculty.flightHours && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Logged Flight Hours</span>
                    <span className="font-mono font-bold text-slate-900">{selectedFaculty.flightHours.toLocaleString()} Hours</span>
                  </div>
                )}
                {selectedFaculty.typeRating && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Type Ratings</span>
                    <span className="font-medium text-slate-900">{selectedFaculty.typeRating}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Contact Details</span>
                  <span className="font-semibold text-slate-900">{selectedFaculty.email} • {selectedFaculty.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Joining Date</span>
                  <span className="font-semibold text-slate-900">{selectedFaculty.joiningDate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Cadet Satisfaction Rating</span>
                  <span className="font-bold text-amber-600">{selectedFaculty.rating || 4.8} / 5.0 (Excellent)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => {
                        const f = selectedFaculty;
                        setSelectedFaculty(null);
                        setEditingFaculty(f);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        const f = selectedFaculty;
                        setSelectedFaculty(null);
                        setDeleteConfirmFaculty(f);
                      }}
                      className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-xs transition border border-rose-200 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => setSelectedFaculty(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedFaculty(null)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                  >
                    Close Dossier
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Faculty Modal (Admin Only) */}
        {isAdmin && showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    New Recruitment
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">Add Faculty / Flight Instructor</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddFaculty} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Capt. Ananya Roy"
                    value={newFaculty.name}
                    onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="ananya.roy@irik.edu"
                      value={newFaculty.email}
                      onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={newFaculty.phone}
                      onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                    <select
                      value={newFaculty.department}
                      onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={newFaculty.designation}
                      onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Qualification</label>
                  <select
                    value={newFaculty.qualification}
                    onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                  >
                    {QUALIFICATIONS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">DGCA License No</label>
                    <input
                      type="text"
                      value={newFaculty.dgcaLicenseNo}
                      onChange={(e) => setNewFaculty({ ...newFaculty, dgcaLicenseNo: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Logged Flight Hours</label>
                    <input
                      type="number"
                      value={newFaculty.flightHours}
                      onChange={(e) => setNewFaculty({ ...newFaculty, flightHours: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Type Rating / Aircraft</label>
                    <input
                      type="text"
                      value={newFaculty.typeRating}
                      onChange={(e) => setNewFaculty({ ...newFaculty, typeRating: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Duty Status</label>
                    <select
                      value={newFaculty.status}
                      onChange={(e) => setNewFaculty({ ...newFaculty, status: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                    >
                      <option value="Active">Active</option>
                      <option value="Flight Line">Flight Line</option>
                      <option value="Simulator Shift">Simulator Shift</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                  >
                    Confirm & Add Member
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
            </div>
          </div>
        )}

        {/* Edit Faculty Modal (Admin Only) */}
        {isAdmin && editingFaculty && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Profile Editor
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">Edit Faculty Profile</h3>
                </div>
                <button
                  onClick={() => setEditingFaculty(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateFaculty} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingFaculty.name}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={editingFaculty.email}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={editingFaculty.phone}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                    <select
                      value={editingFaculty.department}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, department: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={editingFaculty.status || "Active"}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, status: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                    >
                      <option value="Active">Active</option>
                      <option value="Flight Line">Flight Line</option>
                      <option value="Simulator Shift">Simulator Shift</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">DGCA License No</label>
                    <input
                      type="text"
                      value={editingFaculty.dgcaLicenseNo || ""}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, dgcaLicenseNo: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Flight Hours</label>
                    <input
                      type="number"
                      value={editingFaculty.flightHours || 0}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, flightHours: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
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
                    onClick={() => setEditingFaculty(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal (Admin Only) */}
        {isAdmin && deleteConfirmFaculty && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">Remove Faculty Member?</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove <strong className="text-slate-800">{deleteConfirmFaculty.name}</strong> from the academy directory?
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleDeleteFaculty}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-xs"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirmFaculty(null)}
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

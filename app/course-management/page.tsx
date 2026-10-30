"use client";

import { useState, useMemo } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { Course } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Sliders,
  Plane,
  GraduationCap,
  Sparkles,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Download,
  Calendar,
  User,
  Users,
  ShieldCheck,
  Building2,
  X,
  FileText,
  Lock,
} from "lucide-react";

export default function CourseManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [courses, setCourses] = useState<Course[]>(store.getCourses());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSemester, setSelectedSemester] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals & States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedDossierCourse, setSelectedDossierCourse] = useState<Course | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Course Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    credits: 4,
    semester: 1,
    instructor: "Capt. Vikram Malhotra",
    department: "Flight Operations & Training",
    courseType: "Theory" as Course["courseType"],
    totalHours: 45,
  });

  const categories = [
    { id: "All", label: "All Modules", count: courses.length },
    {
      id: "Flight Training",
      label: "Flight & Pilot Training",
      count: courses.filter((c) => c.code.startsWith("PILOT") || c.name.toLowerCase().includes("pilot") || c.name.toLowerCase().includes("aero")).length,
    },
    {
      id: "Degree Programs",
      label: "Degree Courses (BBA/BSc)",
      count: courses.filter((c) => c.code.startsWith("BBA") || c.code.startsWith("BSC")).length,
    },
    {
      id: "Cabin Crew",
      label: "Cabin Crew & Safety",
      count: courses.filter((c) => c.code.includes("CC") || c.code.includes("AHS") || c.name.toLowerCase().includes("cabin") || c.name.toLowerCase().includes("airhostess")).length,
    },
    {
      id: "Diplomas",
      label: "Aviation Diplomas",
      count: courses.filter((c) => c.code.startsWith("DIP")).length,
    },
    {
      id: "Technology",
      label: "Aviation Tech & AI",
      count: courses.filter((c) => c.code.includes("AI") || c.code.includes("DM") || c.name.toLowerCase().includes("tech")).length,
    },
  ];

  const getCategoryFromCourse = (course: Course): string => {
    const code = course.code.toUpperCase();
    const name = course.name.toLowerCase();
    if (code.startsWith("PILOT") || name.includes("pilot") || name.includes("aeronautics")) return "Flight Training";
    if (code.startsWith("BBA") || code.startsWith("BSC")) return "Degree Programs";
    if (code.includes("CC") || code.includes("AHS") || name.includes("cabin") || name.includes("airhostess")) return "Cabin Crew";
    if (code.startsWith("DIP")) return "Diplomas";
    if (code.includes("AI") || code.includes("DM") || name.includes("tech")) return "Technology";
    return "Diplomas";
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

      const category = getCategoryFromCourse(course);
      const matchesCategory = selectedCategory === "All" || category === selectedCategory;

      const matchesSemester =
        selectedSemester === "All" || course.semester.toString() === selectedSemester;

      return matchesSearch && matchesCategory && matchesSemester;
    });
  }, [courses, searchTerm, selectedCategory, selectedSemester]);

  // Add Course
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    const newCourse = store.addCourse(formData);
    setCourses(store.getCourses());
    setShowAddModal(false);
    showToast(`Course ${newCourse.name} (${newCourse.code}) created successfully!`);
    setFormData({
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

  // Update Course
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingCourse) return;

    store.updateCourse(editingCourse.id, editingCourse);
    setCourses(store.getCourses());
    setEditingCourse(null);
    showToast(`Course ${editingCourse.name} updated successfully!`);
  };

  // Delete Course
  const handleDeleteConfirm = () => {
    if (!isAdmin || !deleteConfirmId) return;

    store.deleteCourse(deleteConfirmId);
    setCourses(store.getCourses());
    setDeleteConfirmId(null);
    showToast("Course removed from academic curriculum.");
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Course Code", "Course Title", "Category", "Credits", "Semester", "Instructor", "Course Type"];
    const rows = filteredCourses.map((c) => [
      `"${c.code}"`,
      `"${c.name}"`,
      `"${getCategoryFromCourse(c)}"`,
      c.credits,
      c.semester,
      `"${c.instructor}"`,
      `"${c.courseType || "Theory"}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `IRIK_Course_Curriculum_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Curriculum CSV exported successfully!");
  };

  // Stats
  const stats = {
    total: courses.length,
    degreeCount: courses.filter((c) => c.code.startsWith("BBA") || c.code.startsWith("BSC")).length,
    pilotCount: courses.filter((c) => c.code.startsWith("PILOT") || c.name.toLowerCase().includes("pilot")).length,
    cabinCount: courses.filter((c) => c.code.includes("CC") || c.name.toLowerCase().includes("cabin")).length,
    avgCredits: (courses.reduce((sum, c) => sum + c.credits, 0) / (courses.length || 1)).toFixed(1),
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Hero Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold border border-indigo-400/30 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Aviation Academic Curriculum & Syllabus
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  DGCA & University Aligned
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Course & Syllabus Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Configure syllabus subjects, credit allocations, simulator lab modules, flight line training syllabi, and faculty assignments.
              </p>
            </div>

            {/* Quick Actions Header */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-slate-300" />
                <span>Export Syllabus</span>
              </button>

              <Link
                href="/timetable"
                className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Timetable Matrix</span>
              </Link>

              {isAdmin ? (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Course</span>
                </button>
              ) : (
                <div className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Read Only Access</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Syllabus Courses</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total} Modules</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Across all aviation streams</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Degree Programs</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.degreeCount} Courses</p>
              <p className="text-[11px] text-slate-500 mt-0.5">BBA Aviation & BSc Aero</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Flight Training & Sim</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.pilotCount} Cadres</p>
              <p className="text-[11px] text-slate-500 mt-0.5">DGCA CPL ground & flight</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Average Credit Weight</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.avgCredits} Credits</p>
              <p className="text-[11px] text-slate-500 mt-0.5">UGC & DGCA standard units</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3.5">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat.id ? "bg-blue-800 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search, Semester & View Mode Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses by code, title, or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Semester:</span>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
                >
                  <option value="All">All Semesters</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    viewMode === "grid" ? "bg-white text-blue-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    viewMode === "table" ? "bg-white text-blue-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold">No courses match your filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedSemester("All");
                  }}
                  className="mt-3 text-xs text-blue-600 hover:underline font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredCourses.map((course) => {
                const category = getCategoryFromCourse(course);
                const isFlight = category === "Flight Training";
                const isDegree = category === "Degree Programs";
                const isCabin = category === "Cabin Crew";

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-sm transition p-5 flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {course.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isFlight
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : isDegree
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : isCabin
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {category}
                          </span>
                        </div>
                      </div>

                      <h3
                        onClick={() => setSelectedDossierCourse(course)}
                        className="font-bold text-sm text-slate-900 mt-2.5 group-hover:text-blue-600 transition cursor-pointer"
                      >
                        {course.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{course.credits} Credits</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>Semester {course.semester}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium truncate">{course.instructor}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedDossierCourse(course)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                      >
                        <span>Inspect Syllabus</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingCourse(course)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition"
                            title="Edit Course"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(course.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition"
                            title="Delete Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === "table" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th className="px-5 py-3.5">Code</th>
                    <th className="px-5 py-3.5">Course Title</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Instructor</th>
                    <th className="px-4 py-3.5">Credits</th>
                    <th className="px-4 py-3.5">Semester</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 italic">
                        No courses found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5 font-mono font-bold text-blue-700">
                          {course.code}
                        </td>
                        <td
                          onClick={() => setSelectedDossierCourse(course)}
                          className="px-5 py-3.5 font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                        >
                          {course.name}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                            {getCategoryFromCourse(course)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-700 font-medium">
                          {course.instructor}
                        </td>
                        <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                          {course.credits} Credits
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium border border-blue-200">
                            Sem {course.semester}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-1">
                          <button
                            onClick={() => setSelectedDossierCourse(course)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] transition"
                          >
                            Details
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => setEditingCourse(course)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition inline-block align-middle"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(course.id)}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition inline-block align-middle"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COURSE DOSSIER INSPECTION MODAL */}
        {selectedDossierCourse && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Course Syllabus Dossier
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">
                    {selectedDossierCourse.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDossierCourse(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Course Code:</span>
                    <span className="font-mono font-bold text-blue-700 text-sm">{selectedDossierCourse.code}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Academic Stream:</span>
                    <span className="font-bold text-slate-900">{getCategoryFromCourse(selectedDossierCourse)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Credit Units:</span>
                    <span className="font-bold text-slate-900">{selectedDossierCourse.credits} UGC / DGCA Credits</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Semester Level:</span>
                    <span className="font-bold text-slate-900">Semester {selectedDossierCourse.semester}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900">Instructor & Delivery</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Primary Faculty / Instructor:</span>
                    <span className="font-bold text-slate-900">{selectedDossierCourse.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Instruction Format:</span>
                    <span className="font-medium text-slate-800">Ground Theory & Practical Sim</span>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1.5">
                  <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Regulatory & DGCA Compliance
                  </h4>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Syllabus mapped to CAR Section 7 Flight Crew Training guidelines and standard university curriculum frameworks.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex gap-2.5">
                <Link
                  href="/timetable"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg text-xs text-center transition"
                >
                  View in Timetable Matrix
                </Link>
                <button
                  onClick={() => setSelectedDossierCourse(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD COURSE MODAL */}
        {isAdmin && showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Academic Syllabus Registry
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">Add New Aviation Course</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CPL-MET-01"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Credits</label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 1 })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aviation Meteorology & Synoptic Charts"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Instruction Type</label>
                    <select
                      value={formData.courseType}
                      onChange={(e) => setFormData({ ...formData, courseType: e.target.value as any })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                    >
                      <option value="Theory">Ground Theory</option>
                      <option value="Simulator Lab">Simulator Lab</option>
                      <option value="Flight Practical">Flight Line Practical</option>
                      <option value="Cabin Safety">Cabin Safety Mockup</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Faculty / Instructor</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="pt-3 flex gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                  >
                    Add Course
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

        {/* EDIT COURSE MODAL */}
        {isAdmin && editingCourse && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Edit Curriculum
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">Edit {editingCourse.name}</h3>
                </div>
                <button
                  onClick={() => setEditingCourse(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
                    <input
                      type="text"
                      required
                      value={editingCourse.code}
                      onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Credits</label>
                    <input
                      type="number"
                      min={1}
                      value={editingCourse.credits}
                      onChange={(e) => setEditingCourse({ ...editingCourse, credits: parseInt(e.target.value) || 1 })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.name}
                    onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
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
                      value={editingCourse.semester}
                      onChange={(e) => setEditingCourse({ ...editingCourse, semester: parseInt(e.target.value) || 1 })}
                      className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Instructor</label>
                    <input
                      type="text"
                      value={editingCourse.instructor}
                      onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
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
                    onClick={() => setEditingCourse(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {isAdmin && deleteConfirmId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">Delete Syllabus Course?</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove this course from the academic syllabus?
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-xs"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
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

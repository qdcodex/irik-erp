"use client";

import { useState, useMemo } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { Timetable } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Edit3,
  Trash2,
  MapPin,
  User,
  Plane,
  X,
  ShieldCheck,
  CalendarDays,
  Layers,
  ChevronRight,
  Info,
  Lock,
} from "lucide-react";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const VENUES = [
  "Aero Lecture Hall 101",
  "Aero Lecture Hall 102",
  "Terminal Ops Lab 202",
  "Flight Simulator SIM-01 (Redbird FMX)",
  "Flight Simulator SIM-02 (ALSIM ALX)",
  "Airside Briefing Room B",
  "Cabin Mockup Hall 301",
  "Apron Flight Line 04",
  "Aviation Safety & Evacuation Arena",
  "Grooming & In-flight Demo Lab",
];

const INSTRUCTORS = [
  "Dr. Amit Patel",
  "Capt. Vikram Malhotra",
  "Ms. Kavya Shah",
  "Prof. Rajesh Kumar",
  "Dr. Neha Sharma",
  "Prof. John Doe",
  "Ms. Priya Verma",
];

export default function TimetablePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [activeTab, setActiveTab] = useState<"grid" | "day" | "conflicts" | "analytics">("grid");
  const [timetables, setTimetables] = useState<Timetable[]>(store.getTimetables());
  const courses = store.getCourses();

  // Filters
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals & State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingSlot, setEditingSlot] = useState<Timetable | null>(null);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState<Timetable | null>(null);
  const [deleteConfirmSlot, setDeleteConfirmSlot] = useState<Timetable | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Slot Form State
  const [newSlot, setNewSlot] = useState({
    courseId: courses[0]?.id || "1",
    program: "BBA Aviation",
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    classroom: "Aero Lecture Hall 101",
    instructor: "Dr. Amit Patel",
    semester: 4,
  });

  const getCourseName = (courseId: string) => {
    return courses.find((c) => c.id === courseId)?.name || "Aviation Class";
  };

  const programs = useMemo(() => {
    return Array.from(new Set(timetables.map((t) => t.program))).sort();
  }, [timetables]);

  // Conflict Detection
  const conflicts = useMemo(() => {
    const conflictList: { slot1: Timetable; slot2: Timetable; reason: string }[] = [];

    for (let i = 0; i < timetables.length; i++) {
      for (let j = i + 1; j < timetables.length; j++) {
        const a = timetables[i];
        const b = timetables[j];

        if (a.dayOfWeek === b.dayOfWeek) {
          const [aStartH, aStartM] = a.startTime.split(":").map(Number);
          const [aEndH, aEndM] = a.endTime.split(":").map(Number);
          const [bStartH, bStartM] = b.startTime.split(":").map(Number);
          const [bEndH, bEndM] = b.endTime.split(":").map(Number);

          const aStart = aStartH * 60 + aStartM;
          const aEnd = aEndH * 60 + aEndM;
          const bStart = bStartH * 60 + bStartM;
          const bEnd = bEndH * 60 + bEndM;

          const overlaps = Math.max(aStart, bStart) < Math.min(aEnd, bEnd);

          if (overlaps) {
            if (a.classroom === b.classroom) {
              conflictList.push({
                slot1: a,
                slot2: b,
                reason: `Facility Collision: ${a.classroom} is double-booked on ${a.dayOfWeek}`,
              });
            } else if (a.instructor === b.instructor) {
              conflictList.push({
                slot1: a,
                slot2: b,
                reason: `Instructor Overlap: ${a.instructor} is assigned to concurrent sessions on ${a.dayOfWeek}`,
              });
            }
          }
        }
      }
    }
    return conflictList;
  }, [timetables]);

  // Filtered Timetables
  const filteredTimetables = useMemo(() => {
    return timetables.filter((t) => {
      const courseName = getCourseName(t.courseId);
      const matchesSearch =
        !searchQuery ||
        courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.classroom.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProgram = selectedProgram === "all" || t.program === selectedProgram;

      return matchesSearch && matchesProgram;
    });
  }, [timetables, searchQuery, selectedProgram, courses]);

  // Add Slot Handler (Admin Only)
  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    const created = store.addTimetable(newSlot);
    setTimetables(store.getTimetables());
    setShowAddModal(false);
    setToastMessage(`Created schedule slot: ${getCourseName(created.courseId)} for ${created.dayOfWeek}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Edit Slot Handler (Admin Only)
  const handleUpdateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingSlot) return;

    store.updateTimetable(editingSlot.id, {
      courseId: editingSlot.courseId,
      program: editingSlot.program,
      dayOfWeek: editingSlot.dayOfWeek,
      startTime: editingSlot.startTime,
      endTime: editingSlot.endTime,
      classroom: editingSlot.classroom,
      instructor: editingSlot.instructor,
      semester: editingSlot.semester,
    });

    setTimetables(store.getTimetables());
    setEditingSlot(null);
    setSelectedSlotDetails(null);
    setToastMessage("Schedule slot updated successfully");
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete Slot Handler (Admin Only)
  const handleDeleteSlot = () => {
    if (!isAdmin || !deleteConfirmSlot) return;
    store.deleteTimetable(deleteConfirmSlot.id);
    setTimetables(store.getTimetables());
    setDeleteConfirmSlot(null);
    setSelectedSlotDetails(null);
    setToastMessage("Schedule slot removed from timetable");
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Broadcast Notification (Admin Only)
  const handleNotifyStudents = () => {
    if (!isAdmin) return;
    store.addAuditLog({
      user: user?.username || "admin",
      action: "UPDATE",
      module: "Timetable",
      details: "Dispatched schedule broadcast notification to all cadets & faculty via SMS & App.",
    });
    setToastMessage("Broadcast notice dispatched to all cadets & faculty via App & SMS");
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "Day,Start Time,End Time,Program,Semester,Course Name,Classroom/Sim,Instructor\n";
    const rows = filteredTimetables
      .map((t) => {
        return `"${t.dayOfWeek}","${t.startTime}","${t.endTime}","${t.program}","Sem ${t.semester}","${getCourseName(t.courseId)}","${t.classroom}","${t.instructor}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `IRIK_Timetable_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Badge/Color styling for session cards
  const getSlotStyle = (slot: Timetable) => {
    if (slot.classroom.includes("Simulator") || slot.classroom.includes("SIM")) {
      return {
        card: "bg-indigo-50/70 border-indigo-200/80 text-indigo-950 hover:border-indigo-400 hover:bg-indigo-50",
        badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
        accent: "border-l-4 border-l-indigo-600",
      };
    }
    if (slot.classroom.includes("Apron") || slot.classroom.includes("Flight")) {
      return {
        card: "bg-sky-50/70 border-sky-200/80 text-sky-950 hover:border-sky-400 hover:bg-sky-50",
        badge: "bg-sky-100 text-sky-800 border-sky-200",
        accent: "border-l-4 border-l-sky-600",
      };
    }
    if (slot.classroom.includes("Cabin") || slot.classroom.includes("Mockup")) {
      return {
        card: "bg-purple-50/70 border-purple-200/80 text-purple-950 hover:border-purple-400 hover:bg-purple-50",
        badge: "bg-purple-100 text-purple-800 border-purple-200",
        accent: "border-l-4 border-l-purple-600",
      };
    }
    return {
      card: "bg-blue-50/70 border-blue-200/80 text-blue-950 hover:border-blue-400 hover:bg-blue-50",
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      accent: "border-l-4 border-l-blue-600",
    };
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

        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold border border-indigo-400/30 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5" />
                  Flight Operations & Ground School
                </span>
                {isAdmin ? (
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Admin Schedule Editor
                  </span>
                ) : (
                  <span className="bg-slate-700/60 text-slate-300 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-600/40 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Cadet / Faculty View (Read Only)
                  </span>
                )}
                {conflicts.length > 0 ? (
                  <span className="bg-rose-500/20 text-rose-300 text-xs px-2.5 py-1 rounded-md font-medium border border-rose-500/30 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    {conflicts.length} Overlaps Detected
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Conflict Free
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Timetable & Flight Schedule
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                Master schedule for ground lectures, flight simulator allocations (SIM-01 Redbird & SIM-02 ALSIM ALX), and apron flight lines.
              </p>
            </div>

            {/* View Navigation Tabs */}
            <div className="flex flex-wrap gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 shrink-0">
              <button
                onClick={() => setActiveTab("grid")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "grid"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Weekly Matrix</span>
              </button>
              <button
                onClick={() => setActiveTab("day")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "day"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Day Roster</span>
              </button>
              <button
                onClick={() => setActiveTab("conflicts")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "conflicts"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Conflicts ({conflicts.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "analytics"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Utilization</span>
              </button>
            </div>
          </div>
        </div>

        {/* Polished Unified Action & Filter Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Left: Search & Filter Controls */}
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search subject, simulator, instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            <div className="relative min-w-[180px]">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-xs font-medium bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none cursor-pointer"
              >
                <option value="all">All Programs & Cadres</option>
                {programs.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Actions (Add/Broadcast ONLY for Admin) */}
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <button
                onClick={handleNotifyStudents}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                title="Broadcast changes to students & faculty"
              >
                <Send className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Broadcast</span>
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Slot</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: WEEKLY INTERACTIVE MATRIX GRID */}
        {activeTab === "grid" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Weekly Master Schedule Matrix</h3>
                <p className="text-xs text-slate-500">
                  {isAdmin
                    ? "Select any session card to inspect details, modify venue/times, or delete."
                    : "Select any session card to inspect course syllabus, venue, and assigned instructor."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span> Ground Lecture
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block"></span> Simulator Slot
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block"></span> Flight Line
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block"></span> Cabin Crew
                </span>
              </div>
            </div>

            {/* Grid Columns for 5 Weekdays */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
              {DAYS_OF_WEEK.map((day) => {
                const daySlots = filteredTimetables
                  .filter((t) => t.dayOfWeek === day)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime));

                return (
                  <div key={day} className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-700">{day}</span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                        {daySlots.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {daySlots.length === 0 ? (
                        <div className="text-center py-10 px-2 text-slate-400 text-xs italic">
                          No sessions scheduled
                        </div>
                      ) : (
                        daySlots.map((slot) => {
                          const style = getSlotStyle(slot);

                          return (
                            <div
                              key={slot.id}
                              onClick={() => setSelectedSlotDetails(slot)}
                              className={`group relative p-3 rounded-lg border transition-all cursor-pointer shadow-xs hover:shadow-sm ${style.card} ${style.accent}`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className="font-mono text-[11px] font-bold text-slate-800 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/90 border border-slate-200/60 text-slate-700">
                                  Sem {slot.semester}
                                </span>
                              </div>

                              <h4 className="font-bold text-xs mt-1.5 text-slate-900 line-clamp-2">
                                {getCourseName(slot.courseId)}
                              </h4>

                              <div className="mt-2 text-[11px] space-y-1 text-slate-600">
                                <p className="flex items-center gap-1.5 truncate">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{slot.classroom}</span>
                                </p>
                                <p className="flex items-center gap-1.5 truncate">
                                  <User className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{slot.instructor}</span>
                                </p>
                              </div>

                              {isAdmin && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded font-medium shadow-sm flex items-center gap-1">
                                    <Edit3 className="w-2.5 h-2.5" /> Edit
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DAILY CHRONOLOGICAL ROSTER */}
        {activeTab === "day" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daily Flight & Class Timeline</h3>
                <p className="text-xs text-slate-500">Hour-by-hour operational schedule for the selected day</p>
              </div>

              {/* Day Selector Pills */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      selectedDay === d
                        ? "bg-white text-blue-900 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Feed */}
            <div className="space-y-2.5">
              {filteredTimetables.filter((t) => t.dayOfWeek === selectedDay).length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  No sessions scheduled for {selectedDay}
                </div>
              ) : (
                filteredTimetables
                  .filter((t) => t.dayOfWeek === selectedDay)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((slot) => {
                    const style = getSlotStyle(slot);

                    return (
                      <div
                        key={slot.id}
                        onClick={() => setSelectedSlotDetails(slot)}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:shadow-sm cursor-pointer ${style.card} ${style.accent}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-24 text-center p-2.5 rounded-lg bg-white border border-slate-200 font-mono shadow-2xs">
                            <span className="text-xs font-bold text-slate-900 block">{slot.startTime}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{slot.endTime}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                                {slot.program} • Semester {slot.semester}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 mt-1">{getCourseName(slot.courseId)}</h4>
                            <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{slot.classroom}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="text-right text-xs">
                            <p className="font-semibold text-slate-900">{slot.instructor}</p>
                            <p className="text-[11px] text-slate-500">Instructor</p>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {slot.instructor.charAt(0)}
                          </div>
                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSlot(slot);
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CONFLICT DETECTOR */}
        {activeTab === "conflicts" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Resource Collision & Overlap Audit</h3>
                <p className="text-xs text-slate-500">
                  Real-time detection for double-booked flight simulators, lecture halls, or faculty members.
                </p>
              </div>
            </div>

            {conflicts.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/80 rounded-xl border border-emerald-200 text-emerald-950 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Zero Schedule Conflicts</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  All classrooms, Redbird/ALSIM simulators, and flight instructors have dedicated, non-overlapping time slots.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {conflicts.map((conf, idx) => (
                  <div key={idx} className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 text-rose-950 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{conf.reason}</span>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => setEditingSlot(conf.slot2)}
                          className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Resolve Overlap</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-white p-3 rounded-lg border border-rose-100">
                      <div>
                        <p className="font-semibold text-slate-900">
                          Slot A: {getCourseName(conf.slot1.courseId)} ({conf.slot1.startTime} - {conf.slot1.endTime})
                        </p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{conf.slot1.instructor} • {conf.slot1.classroom}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Slot B: {getCourseName(conf.slot2.courseId)} ({conf.slot2.startTime} - {conf.slot2.endTime})
                        </p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{conf.slot2.instructor} • {conf.slot2.classroom}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: UTILIZATION ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Facility & Simulator Utilization</h3>
                <p className="text-xs text-slate-500">Weekly booked hours across aerodrome bays and lecture halls</p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-700">
                    <span>Flight Simulator SIM-01 (Redbird FMX)</span>
                    <span className="font-bold text-indigo-700">4.0 hrs / week (80%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-700">
                    <span>Flight Simulator SIM-02 (ALSIM ALX)</span>
                    <span className="font-bold text-indigo-700">2.0 hrs / week (50%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "50%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-700">
                    <span>Aero Lecture Hall 101</span>
                    <span className="font-bold text-blue-700">4.5 hrs / week (90%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-700">
                    <span>Terminal Operations Lab 202</span>
                    <span className="font-bold text-blue-700">3.0 hrs / week (60%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Faculty & Instructor Teaching Load</h3>
                <p className="text-xs text-slate-500">Weekly teaching and simulator session commitments</p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">Dr. Amit Patel</h4>
                    <p className="text-slate-500 text-[11px]">Aviation Management & Airport Ops</p>
                  </div>
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    4 Sessions / week
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">Capt. Vikram Malhotra</h4>
                    <p className="text-slate-500 text-[11px]">Chief Flight & Simulator Instructor</p>
                  </div>
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                    5 Sessions / week
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">Ms. Kavya Shah</h4>
                    <p className="text-slate-500 text-[11px]">Cabin Safety & In-flight Service</p>
                  </div>
                  <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                    3 Sessions / week
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slot Inspection Modal */}
        {selectedSlotDetails && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Session Inspection
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">
                    {getCourseName(selectedSlotDetails.courseId)}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSlotDetails(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Program & Semester</span>
                  <span className="font-semibold text-slate-900">
                    {selectedSlotDetails.program} (Semester {selectedSlotDetails.semester})
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Day & Time</span>
                  <span className="font-semibold text-slate-900">
                    {selectedSlotDetails.dayOfWeek}, {selectedSlotDetails.startTime} - {selectedSlotDetails.endTime}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Venue / Simulator</span>
                  <span className="font-semibold text-slate-900">{selectedSlotDetails.classroom}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Assigned Instructor</span>
                  <span className="font-semibold text-slate-900">{selectedSlotDetails.instructor}</span>
                </div>
              </div>

              {/* Action Buttons (Edit/Delete ONLY for Admin) */}
              <div className="pt-2 flex flex-wrap gap-2">
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => {
                        const slot = selectedSlotDetails;
                        setSelectedSlotDetails(null);
                        setEditingSlot(slot);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Slot</span>
                    </button>
                    <button
                      onClick={() => {
                        const slot = selectedSlotDetails;
                        setSelectedSlotDetails(null);
                        setDeleteConfirmSlot(slot);
                      }}
                      className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-xs transition border border-rose-200 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => setSelectedSlotDetails(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedSlotDetails(null)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                  >
                    Close Inspection
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Slot Modal (Admin Only) */}
        {isAdmin && editingSlot && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Slot Editor
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">Edit Timetable Session</h3>
                </div>
                <button
                  onClick={() => setEditingSlot(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSlot} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Program</label>
                    <select
                      value={editingSlot.program}
                      onChange={(e) => setEditingSlot({ ...editingSlot, program: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="BBA Aviation">BBA Aviation</option>
                      <option value="Pilot Training">Pilot Training</option>
                      <option value="Cabin Crew">Cabin Crew</option>
                      <option value="BSc Aviation">BSc Aviation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={editingSlot.semester}
                      onChange={(e) => setEditingSlot({ ...editingSlot, semester: parseInt(e.target.value) })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Subject</label>
                  <select
                    value={editingSlot.courseId}
                    onChange={(e) => setEditingSlot({ ...editingSlot, courseId: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Day</label>
                    <select
                      value={editingSlot.dayOfWeek}
                      onChange={(e) => setEditingSlot({ ...editingSlot, dayOfWeek: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={editingSlot.startTime}
                      onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={editingSlot.endTime}
                      onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Venue / Simulator Bay</label>
                  <select
                    value={editingSlot.classroom}
                    onChange={(e) => setEditingSlot({ ...editingSlot, classroom: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  >
                    {VENUES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Instructor</label>
                  <select
                    value={editingSlot.instructor}
                    onChange={(e) => setEditingSlot({ ...editingSlot, instructor: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  >
                    {INSTRUCTORS.map((ins) => (
                      <option key={ins} value={ins}>{ins}</option>
                    ))}
                  </select>
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
                    onClick={() => setEditingSlot(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schedule New Slot Modal (Admin Only) */}
        {isAdmin && showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    New Booking
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-0.5">Add Timetable Session Slot</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSlot} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Program</label>
                    <select
                      value={newSlot.program}
                      onChange={(e) => setNewSlot({ ...newSlot, program: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="BBA Aviation">BBA Aviation</option>
                      <option value="Pilot Training">Pilot Training</option>
                      <option value="Cabin Crew">Cabin Crew</option>
                      <option value="BSc Aviation">BSc Aviation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={newSlot.semester}
                      onChange={(e) => setNewSlot({ ...newSlot, semester: parseInt(e.target.value) })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Subject</label>
                  <select
                    value={newSlot.courseId}
                    onChange={(e) => setNewSlot({ ...newSlot, courseId: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Day</label>
                    <select
                      value={newSlot.dayOfWeek}
                      onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Venue / Simulator Bay</label>
                  <select
                    value={newSlot.classroom}
                    onChange={(e) => setNewSlot({ ...newSlot, classroom: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  >
                    {VENUES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Instructor</label>
                  <select
                    value={newSlot.instructor}
                    onChange={(e) => setNewSlot({ ...newSlot, instructor: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  >
                    {INSTRUCTORS.map((ins) => (
                      <option key={ins} value={ins}>{ins}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 flex gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm"
                  >
                    Confirm & Schedule Slot
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

        {/* Delete Confirmation Modal (Admin Only) */}
        {isAdmin && deleteConfirmSlot && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">Delete Schedule Slot?</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove <strong className="text-slate-800">{getCourseName(deleteConfirmSlot.courseId)}</strong> on {deleteConfirmSlot.dayOfWeek} ({deleteConfirmSlot.startTime} - {deleteConfirmSlot.endTime})?
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleDeleteSlot}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-xs"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirmSlot(null)}
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

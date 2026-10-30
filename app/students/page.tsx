"use client";

import { store } from "@/lib/store";
import { useState } from "react";
import { Student } from "@/lib/types";
import StudentForm from "@/components/StudentForm";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  UserPlus,
  Trash2,
  Search,
  Filter,
  Download,
  GraduationCap,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  User,
  Calendar,
  BookOpen,
} from "lucide-react";

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  const allStudents = store.getStudents();
  const [students, setStudents] = useState<Student[]>(allStudents);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  // Identify logged in student if current user is a student
  const loggedInStudent = isStudent
    ? allStudents.find(
        (s) =>
          (user?.email && s.email.toLowerCase() === user.email.toLowerCase()) ||
          (user?.fullName && s.name.toLowerCase() === user.fullName.toLowerCase()) ||
          (user?.username && s.rollNo.toLowerCase() === user.username.toLowerCase()) ||
          (user?.username && s.name.toLowerCase().includes(user.username.toLowerCase()))
      ) || allStudents[0]
    : null;

  const handleAddStudent = (newStudent: Omit<Student, "id">) => {
    if (!isAdmin) return;
    const added = store.addStudent(newStudent);
    setStudents([...students, added]);
    setShowForm(false);
  };

  const handleDeleteStudent = (id: string) => {
    if (!isAdmin) return;
    store.deleteStudent(id);
    setStudents(students.filter((s) => s.id !== id));
  };

  const courses = Array.from(new Set(allStudents.map((s) => s.course)));

  // If student role, ONLY show loggedInStudent; otherwise show filtered list
  const displayStudents = isStudent && loggedInStudent
    ? [loggedInStudent]
    : students.filter((s) => {
        const matchesSearch =
          !searchQuery ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCourse = selectedCourse === "all" || s.course === selectedCourse;
        return matchesSearch && matchesCourse;
      });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-md uppercase font-semibold border border-indigo-400/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Cadet Registry
              </span>
              {isAdmin ? (
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-md font-medium border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Admin Editor
                </span>
              ) : isStudent ? (
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-0.5 rounded-md font-medium border border-blue-500/30 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Personal Student Profile (Restricted View)
                </span>
              ) : (
                <span className="bg-slate-700/60 text-slate-300 text-xs px-2.5 py-0.5 rounded-md font-medium border border-slate-600/40 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Read Only
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isStudent ? `Cadet Profile: ${loggedInStudent?.name}` : "Students & Cadet Directory"}
            </h2>
            <p className="text-xs text-slate-300">
              {isStudent
                ? "Your official enrolled cadet profile and academic credentials in IRIK ERP"
                : "Enrolled flight cadets, ground school students, and cabin crew trainees"}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showForm ? "Cancel" : "Add Student"}</span>
            </button>
          )}
        </div>

        {/* Add Student Form (Admin Only) */}
        {isAdmin && showForm && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Enroll New Cadet</h3>
            <StudentForm onSubmit={handleAddStudent} />
          </div>
        )}

        {/* Controls Toolbar (Only shown for non-student users with multiple students) */}
        {!isStudent && (
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-1 flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, roll no, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="relative min-w-[180px]">
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="all">All Programs</option>
                  {courses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <span className="text-xs text-slate-500 font-medium self-center">
              Showing {displayStudents.length} of {students.length} Cadets
            </span>
          </div>
        )}

        {/* Student Dossier Card (if student role) or Table (if admin/staff) */}
        {isStudent && loggedInStudent ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-2xl">
                {loggedInStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{loggedInStudent.name}</h3>
                <p className="text-xs font-mono font-semibold text-blue-600">
                  Roll No: {loggedInStudent.rollNo}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {loggedInStudent.course} • Semester {loggedInStudent.semester}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address
                </span>
                <p className="font-semibold text-slate-900">{loggedInStudent.email}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Phone Number
                </span>
                <p className="font-semibold text-slate-900">{loggedInStudent.phone}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Enrollment Date
                </span>
                <p className="font-semibold text-slate-900">{loggedInStudent.enrollmentDate}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Students Table for Admin/Staff */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-5 py-3.5">Roll Number</th>
                    <th className="px-5 py-3.5">Cadet Name</th>
                    <th className="px-5 py-3.5">Contact Details</th>
                    <th className="px-4 py-3.5">Aviation Program</th>
                    <th className="px-4 py-3.5">Semester</th>
                    {isAdmin && <th className="px-5 py-3.5 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {displayStudents.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5} className="text-center py-10 text-slate-400 italic">
                        No cadets found matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    displayStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                          {student.rollNo}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          {student.name}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          <p>{student.email}</p>
                          <p className="text-[11px] text-slate-400">{student.phone}</p>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-800">
                          {student.course}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-200">
                            Semester {student.semester}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Cadet"
                            >
                              <Trash2 className="w-4 h-4" />
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
    </AppLayout>
  );
}

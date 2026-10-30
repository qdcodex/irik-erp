"use client";

import { store } from "@/lib/store";
import { useState, useMemo } from "react";
import { Course } from "@/lib/types";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Filter,
  GraduationCap,
  Plane,
  Sparkles,
  User,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Plus,
  Sliders,
} from "lucide-react";

export default function CoursesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [courses] = useState<Course[]>(store.getCourses());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Flight Training",
    "Degree Programs",
    "Cabin Crew",
    "Diplomas",
    "Technology",
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

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

      const category = getCategoryFromCourse(course);
      const matchesCategory = selectedCategory === "All" || category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold border border-indigo-400/30 flex items-center gap-1.5 w-fit">
              <BookOpen className="w-3.5 h-3.5" />
              Academic Syllabus Catalog
            </span>
            <h1 className="text-2xl font-bold mt-2">Courses & Syllabus Directory</h1>
            <p className="text-xs text-slate-300">
              Browse aviation degree programs, DGCA ground school modules, and flight training curricula
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/course-management"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 shrink-0"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Manage Curriculum</span>
            </Link>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search syllabus courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 hover:shadow-sm transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {course.code}
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                    {getCategoryFromCourse(course)}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-2.5">{course.name}</h3>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{course.credits} Credits</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>Sem {course.semester}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium truncate">{course.instructor}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                <Link href="/timetable" className="hover:underline flex items-center gap-1">
                  <span>Class Schedule</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                {isAdmin && (
                  <Link href="/course-management" className="text-slate-500 hover:text-slate-900">
                    Edit →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

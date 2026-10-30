"use client";

import { useState } from "react";
import Link from "next/link";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";

export default function InstructorPortalPage() {
  const [markedSessions, setMarkedSessions] = useState<Record<string, boolean>>({});

  const handleMarkAttendance = (sessionKey: string) => {
    setMarkedSessions((prev) => ({ ...prev, [sessionKey]: true }));
    alert(`Attendance marked for ${sessionKey}! Records updated in academic registry.`);
  };

  const evaluations = store.getInstructorEvaluations();
  const myEvaluations = evaluations.filter((e) => e.instructorName.includes("Amit") || e.instructorName.includes("Vikram"));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="bg-sky-500/30 text-sky-200 text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold border border-sky-400/30">
                ✈️ Flight Instructor & Faculty Portal
              </span>
              <h1 className="text-2xl font-bold mt-1">Welcome, Dr. Amit Patel</h1>
              <p className="text-xs text-gray-300">
                Senior Faculty — Aviation Management & Aerodrome Operations
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/timetable"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/15 transition"
              >
                📅 Full Flight Roster
              </Link>
            </div>
          </div>
        </div>

        {/* Today's Classes & Sessions (Irik.md Wireframe 8.4) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Today's Assigned Classes & Flight Training Sessions</h3>
            <p className="text-xs text-gray-500">One-click biometric / session attendance marking for enrolled students</p>
          </div>

          <div className="space-y-3">
            {/* Session 1 */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                    09:00 - 10:30 AM
                  </span>
                  <span className="text-xs font-bold text-blue-900">Batch A — BBA Aviation</span>
                </div>
                <h4 className="font-bold text-gray-900 text-base">Ground School: Aviation Meteorology & Air Regulations</h4>
                <p className="text-xs text-gray-500">Classroom: Aero-Lecture Hall 102 • 28 Students</p>
              </div>
              <button
                disabled={markedSessions["Ground-0900"]}
                onClick={() => handleMarkAttendance("Ground-0900")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  markedSessions["Ground-0900"]
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {markedSessions["Ground-0900"] ? "✓ Attendance Marked" : "📝 Mark Attendance"}
              </button>
            </div>

            {/* Session 2 */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">
                    01:00 - 03:00 PM
                  </span>
                  <span className="text-xs font-bold text-indigo-900">Batch C — Pilot Training</span>
                </div>
                <h4 className="font-bold text-gray-900 text-base">Simulator Session: Instrument Approach & Crosswind (SIM-01)</h4>
                <p className="text-xs text-gray-500">Resource: Redbird FMX Multi-Engine Sim • 4 Cadets</p>
              </div>
              <button
                disabled={markedSessions["Sim-1300"]}
                onClick={() => handleMarkAttendance("Sim-1300")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  markedSessions["Sim-1300"]
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {markedSessions["Sim-1300"] ? "✓ Attendance Marked" : "📝 Mark Attendance"}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/timetable"
            className="p-4 bg-white rounded-xl border border-gray-200 text-center hover:border-blue-500 hover:shadow-sm transition"
          >
            <div className="text-2xl mb-1">📅</div>
            <p className="font-bold text-xs text-gray-900">My Timetable</p>
          </Link>
          <Link
            href="/attendance"
            className="p-4 bg-white rounded-xl border border-gray-200 text-center hover:border-blue-500 hover:shadow-sm transition"
          >
            <div className="text-2xl mb-1">📊</div>
            <p className="font-bold text-xs text-gray-900">Attendance Log</p>
          </Link>
          <Link
            href="/lms"
            className="p-4 bg-white rounded-xl border border-gray-200 text-center hover:border-blue-500 hover:shadow-sm transition"
          >
            <div className="text-2xl mb-1">📤</div>
            <p className="font-bold text-xs text-gray-900">Upload LMS Content</p>
          </Link>
          <Link
            href="/evaluations"
            className="p-4 bg-white rounded-xl border border-gray-200 text-center hover:border-blue-500 hover:shadow-sm transition"
          >
            <div className="text-2xl mb-1">⭐</div>
            <p className="font-bold text-xs text-gray-900">My Reviews</p>
          </Link>
        </div>

        {/* Instructor Performance Scorecard Highlights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Student Ratings & Appraisal Scorecard</h3>
              <p className="text-xs text-gray-500">Aggregate score from 24 student evaluations this semester</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-500">★ 4.8</span>
              <span className="text-xs text-gray-400 block">out of 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border text-center">
              <p className="text-gray-500">Instructional Clarity</p>
              <p className="font-bold text-base text-gray-900 mt-1">4.9 / 5.0</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border text-center">
              <p className="text-gray-500">Radio Telephony</p>
              <p className="font-bold text-base text-gray-900 mt-1">5.0 / 5.0</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border text-center">
              <p className="text-gray-500">Flight Punctuality</p>
              <p className="font-bold text-base text-gray-900 mt-1">4.8 / 5.0</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border text-center">
              <p className="text-gray-500">Simulator Briefing</p>
              <p className="font-bold text-base text-gray-900 mt-1">4.7 / 5.0</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

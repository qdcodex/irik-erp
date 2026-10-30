"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { InstructorEvaluation } from "@/lib/types";

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<InstructorEvaluation[]>(store.getInstructorEvaluations());

  const [newEval, setNewEval] = useState({
    instructorId: "2",
    instructorName: "Dr. Amit Patel",
    studentId: "1",
    courseId: "1",
    courseName: "BBA Aviation",
    ratings: {
      teaching: 5,
      communication: 5,
      punctuality: 5,
      practicalTraining: 5,
    },
    comments: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addInstructorEvaluation({
      ...newEval,
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    });
    setEvaluations(store.getInstructorEvaluations());
    setNewEval({
      instructorId: "2",
      instructorName: "Dr. Amit Patel",
      studentId: "1",
      courseId: "1",
      courseName: "BBA Aviation",
      ratings: {
        teaching: 5,
        communication: 5,
        punctuality: 5,
        practicalTraining: 5,
      },
      comments: "",
    });
    alert("Instructor rating submitted successfully!");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-xl p-6 text-white shadow-md">
          <div>
            <span className="bg-amber-500/30 text-amber-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-amber-400/30">
              Irik.md Section 4.15
            </span>
            <h1 className="text-2xl font-bold mt-2">Flight Instructor & Faculty Performance Evaluations</h1>
            <p className="text-sm text-gray-300">
              Student feedback scorecards across theoretical teaching, cockpit communication, and simulator training
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evaluations Feed & Aggregated Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-1">Recent Student Review Scorecards</h3>
              <p className="text-xs text-gray-500 mb-4">Detailed ratings across core aviation instructor competencies</p>

              <div className="space-y-4">
                {evaluations.map((ev) => {
                  const avgRating = (
                    (ev.ratings.teaching +
                      ev.ratings.communication +
                      ev.ratings.punctuality +
                      ev.ratings.practicalTraining) /
                    4
                  ).toFixed(1);

                  return (
                    <div key={ev.id} className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-gray-900 text-base">{ev.instructorName}</h4>
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                              {ev.courseName}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">Submitted on {ev.submittedAt}</p>
                        </div>
                        <div className="flex items-center bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                          <span className="text-amber-500 text-sm mr-1">★</span>
                          <span className="font-bold text-amber-900 text-sm">{avgRating} / 5.0</span>
                        </div>
                      </div>

                      {/* Criteria Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-lg border text-center">
                          <p className="text-gray-500">Teaching Quality</p>
                          <p className="font-bold text-gray-900 mt-0.5">★ {ev.ratings.teaching}/5</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border text-center">
                          <p className="text-gray-500">Cockpit Comm.</p>
                          <p className="font-bold text-gray-900 mt-0.5">★ {ev.ratings.communication}/5</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border text-center">
                          <p className="text-gray-500">Punctuality</p>
                          <p className="font-bold text-gray-900 mt-0.5">★ {ev.ratings.punctuality}/5</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border text-center">
                          <p className="text-gray-500">Sim / Practical</p>
                          <p className="font-bold text-gray-900 mt-0.5">★ {ev.ratings.practicalTraining}/5</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border italic">
                        "{ev.comments}"
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Rating Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <h3 className="font-semibold text-gray-900 mb-1">Evaluate Instructor</h3>
            <p className="text-xs text-gray-500 mb-4">Rate your flight or ground school instructor</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Instructor</label>
                <select
                  value={newEval.instructorName}
                  onChange={(e) => {
                    const name = e.target.value;
                    const course = name.includes("Vikram") ? "Pilot Training" : "BBA Aviation";
                    setNewEval({ ...newEval, instructorName: name, courseName: course });
                  }}
                  className="w-full border rounded-lg p-2 text-sm"
                >
                  <option value="Dr. Amit Patel">Dr. Amit Patel (Aviation Mgmt)</option>
                  <option value="Capt. Vikram Malhotra">Capt. Vikram Malhotra (Flight Instructor)</option>
                  <option value="Dr. Neha Sharma">Dr. Neha Sharma (Aerodynamics)</option>
                  <option value="Ms. Kavya Shah">Ms. Kavya Shah (Cabin Crew)</option>
                </select>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Theoretical Teaching Quality:</span>
                    <span className="font-bold text-amber-600">★ {newEval.ratings.teaching} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newEval.ratings.teaching}
                    onChange={(e) =>
                      setNewEval({
                        ...newEval,
                        ratings: { ...newEval.ratings, teaching: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Cockpit & Radio Communication:</span>
                    <span className="font-bold text-amber-600">★ {newEval.ratings.communication} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newEval.ratings.communication}
                    onChange={(e) =>
                      setNewEval({
                        ...newEval,
                        ratings: { ...newEval.ratings, communication: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Flight Slot Punctuality:</span>
                    <span className="font-bold text-amber-600">★ {newEval.ratings.punctuality} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newEval.ratings.punctuality}
                    onChange={(e) =>
                      setNewEval({
                        ...newEval,
                        ratings: { ...newEval.ratings, punctuality: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Simulator / Practical Briefing:</span>
                    <span className="font-bold text-amber-600">★ {newEval.ratings.practicalTraining} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newEval.ratings.practicalTraining}
                    onChange={(e) =>
                      setNewEval({
                        ...newEval,
                        ratings: { ...newEval.ratings, practicalTraining: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Student Review Comments</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share constructive feedback regarding instructional clarity, flight maneuvers..."
                  value={newEval.comments}
                  onChange={(e) => setNewEval({ ...newEval, comments: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 rounded-lg text-sm transition shadow"
              >
                Submit Evaluation Scorecard
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

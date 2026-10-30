"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { AppLayout } from "@/components/AppLayout";
import { FeedbackTicket } from "@/lib/types";

export default function FeedbackPage() {
  const [tickets, setTickets] = useState<FeedbackTicket[]>(store.getFeedbackTickets());
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "in_progress" | "resolved">("all");

  const [newTicket, setNewTicket] = useState({
    raisedBy: "Rajesh Kumar",
    raisedByRole: "student",
    category: "simulator" as FeedbackTicket["category"],
    subject: "",
    description: "",
    priority: "medium" as FeedbackTicket["priority"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addFeedbackTicket({
      ...newTicket,
      status: "open",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    });
    setTickets(store.getFeedbackTickets());
    setNewTicket({
      raisedBy: "Rajesh Kumar",
      raisedByRole: "student",
      category: "simulator",
      subject: "",
      description: "",
      priority: "medium",
    });
    alert("Feedback ticket lodged successfully!");
  };

  const handleUpdateStatus = (id: string, status: "open" | "in_progress" | "resolved") => {
    const notes = status === "resolved" ? "Issue resolved by department team." : undefined;
    const updated = store.updateTicketStatus(id, status, notes, status === "resolved" ? 5 : undefined);
    if (updated) {
      setTickets(store.getFeedbackTickets());
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === "all") return true;
    return t.status === filterStatus;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-xl p-6 text-white shadow-md">
          <div>
            <span className="bg-amber-500/30 text-amber-200 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-amber-400/30">
              Irik.md Section 4.12
            </span>
            <h1 className="text-2xl font-bold mt-2">Feedback & Complaint Ticketing System</h1>
            <p className="text-sm text-gray-300">
              Helpdesk ticketing pipeline for students, parents, flight instructors & hostel residents
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Listing */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Active Service Tickets</h3>
                  <p className="text-xs text-gray-500">Track resolution progress and department notes</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      filterStatus === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All ({tickets.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("open")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      filterStatus === "open" ? "bg-red-600 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => setFilterStatus("in_progress")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      filterStatus === "in_progress" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setFilterStatus("resolved")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      filterStatus === "resolved" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredTickets.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                              t.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : t.priority === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {t.priority} Priority
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium capitalize">
                            📁 {t.category.replace("_", " ")}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base">{t.subject}</h4>
                        <p className="text-xs text-gray-500">
                          Raised by <span className="font-medium text-gray-700">{t.raisedBy}</span> ({t.raisedByRole}) on {t.createdAt}
                        </p>
                        <p className="text-sm text-gray-700 mt-2 bg-white p-3 rounded-lg border border-gray-200">
                          {t.description}
                        </p>
                        {t.resolutionNotes && (
                          <div className="p-2.5 bg-green-50 rounded-lg border border-green-200 text-xs text-green-900 mt-2">
                            <span className="font-bold">✓ Resolution:</span> {t.resolutionNotes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            t.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : t.status === "in_progress"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {t.status.replace("_", " ")}
                        </span>
                        {t.status !== "resolved" && (
                          <div className="flex flex-col gap-1 mt-2">
                            {t.status === "open" && (
                              <button
                                onClick={() => handleUpdateStatus(t.id, "in_progress")}
                                className="text-xs bg-amber-600 text-white px-2.5 py-1 rounded font-medium hover:bg-amber-700"
                              >
                                Mark In Progress
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateStatus(t.id, "resolved")}
                              className="text-xs bg-green-600 text-white px-2.5 py-1 rounded font-medium hover:bg-green-700"
                            >
                              Mark Resolved ✓
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Ticket Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <h3 className="font-semibold text-gray-900 mb-1">Submit New Ticket</h3>
            <p className="text-xs text-gray-500 mb-4">Lodge feedback for flight training, simulator, facilities or hostel</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newTicket.raisedBy}
                  onChange={(e) => setNewTicket({ ...newTicket, raisedBy: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, category: e.target.value as FeedbackTicket["category"] })
                    }
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option value="simulator">Flight Simulator</option>
                    <option value="flight_training">Flight Training Ops</option>
                    <option value="facility">Campus Facility</option>
                    <option value="academics">Academics & LMS</option>
                    <option value="hostel">Hostel & Food</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, priority: e.target.value as FeedbackTicket["priority"] })
                    }
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of the issue..."
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain the incident, room number, or session date..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 rounded-lg text-sm transition shadow"
              >
                Submit Ticket to Helpdesk
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

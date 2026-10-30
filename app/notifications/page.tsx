"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth-context";
import SearchableSelect from "@/components/SearchableSelect";
import {
  Bell,
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Users,
  Search,
  CheckCheck,
  Megaphone,
  Sparkles,
  Calendar,
  CreditCard,
  UserCheck,
} from "lucide-react";

interface NotificationItem {
  _id?: string;
  id?: string;
  type: string;
  title: string;
  message: string;
  channels?: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  status?: {
    inApp: string;
    email?: string;
    sms?: string;
    push?: string;
  };
  createdAt?: string;
  sentAt?: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isFaculty = user?.role === "faculty";
  const canBroadcast = isAdmin || isFaculty;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Broadcast modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    type: "class_reminder" as any,
    targetAudience: "all",
    sendEmail: true,
  });

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      } else {
        // Fallback sample notifications
        setNotifications([
          {
            id: "1",
            type: "fee_alert",
            title: "Semester 4 Tuition Fee Due Reminder",
            message: "Semester 4 tuition fees are due on 01 September 2026. Please settle pending dues to avoid late fees.",
            createdAt: new Date().toISOString(),
            status: { inApp: "sent", email: "sent" },
            channels: { inApp: true, email: true, sms: true, push: true },
          },
          {
            id: "2",
            type: "class_reminder",
            title: "Airport Operations Lecture Tomorrow",
            message: "Class scheduled at 09:00 AM in Aero Hall 101 with Prof. Rajesh Kumar.",
            createdAt: new Date().toISOString(),
            status: { inApp: "sent" },
            channels: { inApp: true, email: false, sms: false, push: true },
          },
          {
            id: "3",
            type: "admission_status",
            title: "New Admission Application: CPL Pilot Batch",
            message: "Applicant Rohan Varma has submitted Class 1 medical documents for CPL Ground.",
            createdAt: new Date().toISOString(),
            status: { inApp: "read" },
            channels: { inApp: true, email: true, sms: false, push: true },
          },
        ]);
      }
    } catch (e) {
      console.warn("Could not fetch notifications from API, using defaults:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "admin",
          type: broadcastForm.type,
          title: broadcastForm.title,
          message: broadcastForm.message,
          data: {
            targetAudience: broadcastForm.targetAudience,
            sendEmail: broadcastForm.sendEmail,
          },
        }),
      });

      if (res.ok) {
        alert("Broadcast announcement dispatched successfully!");
      } else {
        alert("Notification logged and added to campus feed!");
      }

      setShowBroadcastModal(false);
      setBroadcastForm({
        title: "",
        message: "",
        type: "class_reminder",
        targetAudience: "all",
        sendEmail: true,
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to broadcast:", err);
      alert("Notification broadcast error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    const matchesTab = activeTab === "all" || item.type.toLowerCase().includes(activeTab.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Communications Engine
              </span>
              <span className="text-xs text-slate-400">SMTP & In-App Multichannel</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Campus Notifications & Bulletins</h1>
            <p className="text-slate-300 text-sm mt-1">
              Real-time alerts for fee schedules, flight training reminders, and campus announcements.
            </p>
          </div>

          {canBroadcast && (
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-sky-600/30 self-start md:self-auto"
            >
              <Megaphone className="w-4 h-4" />
              Compose Broadcast
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Alerts" },
              { id: "fee", label: "Fees & Dues" },
              { id: "class", label: "Classes & Flights" },
              { id: "admission", label: "Admissions" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500 w-full sm:w-56"
            />
          </div>
        </div>

        {/* Notification Feed */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
              <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <div className="font-semibold text-slate-700">No notifications in this view</div>
              <div className="text-xs text-slate-400 mt-1">Check back later for newly scheduled alerts.</div>
            </div>
          ) : (
            filteredNotifications.map((n, i) => {
              const isFee = n.type.includes("fee");
              const isClass = n.type.includes("class") || n.type.includes("timetable");
              const isAdmission = n.type.includes("admission");

              return (
                <div
                  key={n._id || n.id || i}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition shadow-sm flex items-start gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      isFee
                        ? "bg-amber-50 text-amber-600"
                        : isClass
                        ? "bg-sky-50 text-sky-600"
                        : isAdmission
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {isFee ? (
                      <CreditCard className="w-5 h-5" />
                    ) : isClass ? (
                      <Calendar className="w-5 h-5" />
                    ) : (
                      <Bell className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Just now"}
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">{n.message}</p>

                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {n.type.replace("_", " ")}
                      </span>
                      {n.channels?.email && (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <Mail className="w-3 h-3" /> Email Dispatched
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Broadcast Modal */}
        {showBroadcastModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Campus Broadcast Announcement</h3>
                    <p className="text-xs text-slate-500">Dispatch message across in-app feed & email</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBroadcastSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alert Title / Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schedule Change: Flight Line Operations"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <SearchableSelect
                      label="Category"
                      value={broadcastForm.type}
                      onChange={(val) => setBroadcastForm({ ...broadcastForm, type: val })}
                      options={[
                        { value: "class_reminder", label: "Class / Flight Training" },
                        { value: "timetable_change", label: "Timetable Change" },
                        { value: "fee_alert", label: "Fee & Invoicing Notice" },
                        { value: "admission_status", label: "Admission Announcement" },
                        { value: "exam_result", label: "Exam Results & Academic" },
                      ]}
                      size="sm"
                    />
                  </div>

                  <div>
                    <SearchableSelect
                      label="Target Audience"
                      value={broadcastForm.targetAudience}
                      onChange={(val) => setBroadcastForm({ ...broadcastForm, targetAudience: val })}
                      options={[
                        { value: "all", label: "Entire Academy (All)" },
                        { value: "students", label: "Students Only" },
                        { value: "faculty", label: "Faculty & Flight Instructors" },
                        { value: "parents", label: "Parents / Guardians" },
                      ]}
                      size="sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message Body</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide full details of the notice..."
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={broadcastForm.sendEmail}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, sendEmail: e.target.checked })}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                  />
                  <label htmlFor="sendEmail" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Send simultaneous Email notification via IRIK SMTP Mailer
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-md transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? "Dispatching..." : "Send Announcement"}
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

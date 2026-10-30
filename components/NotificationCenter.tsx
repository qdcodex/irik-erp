"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import SearchableSelect from "@/components/SearchableSelect";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Plus,
  Send,
  Calendar,
  DollarSign,
  AlertTriangle,
  GraduationCap,
  Plane,
  Megaphone,
  UserCheck,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  status: {
    inApp: string;
    email?: string;
    sms?: string;
    push?: string;
  };
  createdAt: string;
  readAt?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    _id: "demo-1",
    type: "timetable_change",
    title: "Flight Simulator Bay 2 Rescheduled",
    message: "IFR Flight Simulator training session DA-42 moved from 14:00 to 16:30 today due to avionics calibration.",
    status: { inApp: "sent" },
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    _id: "demo-2",
    type: "fee_alert",
    title: "Semester 4 Ground School Dues",
    message: "Tuition installment for CPL Batch 2026 is due by 05 Nov. Kindly settle accounts to confirm flight line slots.",
    status: { inApp: "sent" },
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    _id: "demo-3",
    type: "class_reminder",
    title: "DGCA Air Navigation Briefing",
    message: "Ground theory session on High Altitude Meteorology tomorrow at 09:30 AM in Hall Bravo with Capt. Vikram.",
    status: { inApp: "sent" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    _id: "demo-4",
    type: "attendance_alert",
    title: "Gate Check-In & Medical Record",
    message: "Mandatory breathalyzer & pre-flight biometric check-in required 45 minutes prior to aircraft engine start.",
    status: { inApp: "read" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const NOTIFICATION_TYPES = [
  { value: "class_reminder", label: "Ground School & Flight Briefing" },
  { value: "timetable_change", label: "Flight Line & Simulator Schedule" },
  { value: "fee_alert", label: "Fee Payment & Accounts Notice" },
  { value: "attendance_alert", label: "Cadet Attendance & Medical Alert" },
  { value: "exam_result", label: "DGCA Examination & Results" },
  { value: "admission_status", label: "Admissions & Cadre Onboarding" },
];

const TARGET_AUDIENCES = [
  { value: "all", label: "All Cadets & Personnel (Campus Wide)" },
  { value: "students", label: "All Cadets & Enrolled Students" },
  { value: "faculty", label: "Flight Instructors & Ground Faculty" },
  { value: "operations", label: "Airfield Operations & Ground Crew" },
  { value: "staff", label: "Administrative & Support Staff" },
];

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSec < 60) return "Just now";
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `${diffInMin}m ago`;
  const diffInHours = Math.floor(diffInMin / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Notification Form State
  const [addForm, setAddForm] = useState({
    title: "",
    message: "",
    type: "class_reminder",
    targetAudience: "all",
    sendEmail: false,
  });

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const url = user?.id ? `/api/notifications?userId=${user.id}&limit=30` : `/api/notifications?limit=30`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        } else {
          // If fresh database with no notifications, supply default aviation notifications
          setNotifications(DEFAULT_NOTIFICATIONS);
          const unread = DEFAULT_NOTIFICATIONS.filter((n) => n.status.inApp !== "read").length;
          setUnreadCount(unread);
        }
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
        const unread = DEFAULT_NOTIFICATIONS.filter((n) => n.status.inApp !== "read").length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.warn("Could not fetch notifications from API, using defaults:", error);
      setNotifications(DEFAULT_NOTIFICATIONS);
      const unread = DEFAULT_NOTIFICATIONS.filter((n) => n.status.inApp !== "read").length;
      setUnreadCount(unread);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Refresh every 45 seconds
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, [user]);

  // Mark single notification as read
  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, status: { ...n.status, inApp: "read" } } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      if (!id.startsWith("demo-")) {
        await fetch(`/api/notifications/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "read" }),
        });
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: { ...n.status, inApp: "read" } }))
    );
    setUnreadCount(0);

    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read_all", userId: user?.id }),
      });
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const target = notifications.find((n) => n._id === id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (target && target.status.inApp !== "read") {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      if (!id.startsWith("demo-")) {
        await fetch(`/api/notifications/${id}`, {
          method: "DELETE",
        });
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    if (!confirm("Are you sure you want to clear all notifications?")) return;

    setNotifications([]);
    setUnreadCount(0);

    try {
      await fetch("/api/notifications", {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  // Submit New Notification Form
  const handleAddNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title.trim() || !addForm.message.trim()) return;

    setIsSubmitting(true);

    const newNotificationItem: NotificationItem = {
      _id: "notif-" + Date.now(),
      type: addForm.type,
      title: addForm.title,
      message: addForm.message,
      data: {
        targetAudience: addForm.targetAudience,
        sendEmail: addForm.sendEmail,
      },
      status: {
        inApp: "sent",
        email: addForm.sendEmail ? "sent" : "pending",
      },
      createdAt: new Date().toISOString(),
    };

    // Optimistically prepend to active notifications
    setNotifications((prev) => [newNotificationItem, ...prev]);
    setUnreadCount((prev) => prev + 1);

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "admin",
          type: addForm.type,
          title: addForm.title,
          message: addForm.message,
          data: {
            targetAudience: addForm.targetAudience,
            sendEmail: addForm.sendEmail,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.result?.notificationId) {
          // Update id from db
          setNotifications((prev) =>
            prev.map((n) => (n._id === newNotificationItem._id ? { ...n, _id: data.result.notificationId } : n))
          );
        }
      }
    } catch (err) {
      console.warn("Could not save notification to backend API:", err);
    } finally {
      setIsSubmitting(false);
      setShowAddModal(false);
      setAddForm({
        title: "",
        message: "",
        type: "class_reminder",
        targetAudience: "all",
        sendEmail: false,
      });
    }
  };

  // Render Category Icon and Styles
  const getCategoryMeta = (type: string) => {
    switch (type) {
      case "class_reminder":
        return {
          icon: Plane,
          bg: "bg-sky-50 text-sky-700 border-sky-200",
          badge: "Flight Briefing",
        };
      case "timetable_change":
        return {
          icon: Calendar,
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          badge: "Schedule Change",
        };
      case "fee_alert":
        return {
          icon: DollarSign,
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          badge: "Fee & Billing",
        };
      case "attendance_alert":
        return {
          icon: AlertTriangle,
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          badge: "Attendance Alert",
        };
      case "exam_result":
        return {
          icon: GraduationCap,
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          badge: "DGCA Exam Result",
        };
      case "admission_status":
        return {
          icon: UserCheck,
          bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
          badge: "Cadre Admission",
        };
      default:
        return {
          icon: Megaphone,
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          badge: "Campus Alert",
        };
    }
  };

  const displayedNotifications = notifications.filter((item) => {
    if (filterTab === "unread") {
      return item.status.inApp !== "read";
    }
    return true;
  });

  return (
    <div className="relative" ref={popoverRef}>
      {/* Header Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        title="Notifications & Alerts"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5 transition-transform duration-200 hover:scale-105" />

        {/* Unread Counter Badge with Glow/Pulse */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full px-1 py-0.5 text-[10px] font-bold leading-none text-white bg-rose-600 shadow-sm border border-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 md:w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Popover Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-400/30 font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-300">Campus Alerts & Flight Bulletins</p>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition shadow-sm border border-blue-400/30 cursor-pointer"
                title="Create a new alert"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs (All / Unread) */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg">
              <button
                onClick={() => setFilterTab("all")}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  filterTab === "all"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilterTab("unread")}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  filterTab === "unread"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-[11px] text-slate-500 hover:text-rose-600 font-medium transition"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-200">
            {isLoading ? (
              <div className="p-8 text-center space-y-2">
                <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500">Checking campus feed...</p>
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="p-10 text-center space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Bell className="w-6 h-6 opacity-40" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">No {filterTab === "unread" ? "unread " : ""}notifications</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {filterTab === "unread"
                      ? "You are all caught up with recent logs."
                      : "No bulletins have been dispatched yet."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowAddModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Dispatch first notification
                </button>
              </div>
            ) : (
              displayedNotifications.map((notif) => {
                const meta = getCategoryMeta(notif.type);
                const IconComponent = meta.icon;
                const isUnread = notif.status.inApp !== "read";

                return (
                  <div
                    key={notif._id}
                    onClick={() => isUnread && markAsRead(notif._id)}
                    className={`p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group relative ${
                      isUnread ? "bg-blue-50/20" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 shadow-2xs ${meta.bg}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${meta.bg}`}
                          >
                            {meta.badge}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-2.5 h-2.5" />
                            {formatTimeAgo(notif.createdAt)}
                          </span>
                          {isUnread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                          )}
                        </div>

                        <h4
                          className={`text-xs leading-snug line-clamp-1 ${
                            isUnread ? "font-bold text-slate-900" : "font-medium text-slate-700"
                          }`}
                        >
                          {notif.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                      </div>

                      {/* Quick Actions (Mark Read, Delete) */}
                      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isUnread && (
                          <button
                            onClick={(e) => markAsRead(notif._id, e)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => deleteNotification(notif._id, e)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                          title="Delete notification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Popover Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition"
            >
              <span>View full communications feed</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                setShowAddModal(true);
              }}
              className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Alert</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Notification Modal ("add functionality") */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Create Notification</h3>
                  <p className="text-[11px] text-slate-300">Dispatch immediate campus broadcast</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddNotificationSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DGCA Flight Schedule Resumption Notice"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <SearchableSelect
                    label="Category / Event Type"
                    value={addForm.type}
                    onChange={(val) => setAddForm({ ...addForm, type: val })}
                    options={NOTIFICATION_TYPES}
                    size="sm"
                  />
                </div>
                <div>
                  <SearchableSelect
                    label="Target Audience"
                    value={addForm.targetAudience}
                    onChange={(val) => setAddForm({ ...addForm, targetAudience: val })}
                    options={TARGET_AUDIENCES}
                    size="sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notification Content / Message *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise details, dates, affected aircraft/venues, or required actions..."
                  value={addForm.message}
                  onChange={(e) => setAddForm({ ...addForm, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                ></textarea>
              </div>

              {/* Channels Option */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Dispatch Email Alert</p>
                  <p className="text-[11px] text-slate-500">Send an instant copy via configured SMTP server</p>
                </div>
                <input
                  type="checkbox"
                  checked={addForm.sendEmail}
                  onChange={(e) => setAddForm({ ...addForm, sendEmail: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Alert</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

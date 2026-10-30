"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  status: {
    inApp: string;
  };
  createdAt: string;
  readAt?: string;
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/notifications?userId=${user.id}&limit=20`);
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(true);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read" }),
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, status: { ...n.status, inApp: "read" } } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "class_reminder":
        return "📚";
      case "fee_alert":
        return "💰";
      case "attendance_alert":
        return "⚠️";
      case "timetable_change":
        return "📅";
      case "exam_result":
        return "📊";
      case "admission_status":
        return "🎓";
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "class_reminder":
        return "border-blue-300 bg-blue-50";
      case "fee_alert":
        return "border-orange-300 bg-orange-50";
      case "attendance_alert":
        return "border-red-300 bg-red-50";
      case "timetable_change":
        return "border-purple-300 bg-purple-50";
      case "exam_result":
        return "border-green-300 bg-green-50";
      case "admission_status":
        return "border-indigo-300 bg-indigo-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <h3 className="font-bold text-lg">🔔 Notifications</h3>
            <p className="text-sm text-blue-100">{unreadCount} unread</p>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <p>Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No notifications yet</p>
              <p className="text-xs mt-2">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-4 border-l-4 ${getNotificationColor(notif.type)} ${
                    notif.status.inApp === "read" ? "opacity-60" : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">{getNotificationIcon(notif.type)}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{notif.title}</h4>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">{notif.message}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {notif.status.inApp !== "read" && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium p-1"
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif._id)}
                        className="text-red-600 hover:text-red-700 text-xs font-medium p-1"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <a
              href="/notifications"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-block"
            >
              View All Notifications →
            </a>
          </div>
        </div>
      )}

      {/* Overlay to close panel */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}

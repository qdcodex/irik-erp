import mongoose from "mongoose";
import { Notification, NotificationPreference } from "@/lib/models";
import { notificationService } from "@/lib/services/notificationService";
import dbConnect from "@/lib/db";

export const dynamic = "force-dynamic";

// GET notifications for current user
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    let query: any = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.userId = userId;
    }
    if (unreadOnly) {
      query["status.inApp"] = { $ne: "read" };
    }

    const notifications = await Notification.find(query)
      .populate("userId", "fullName email role username")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({
      ...query,
      "status.inApp": { $ne: "read" },
    });

    return Response.json({
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return Response.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// POST send notification (admin only)
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, type, title, message, data } = body;

    if (!type || !title || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await notificationService.sendNotification({
      userId: userId || "admin",
      type,
      title,
      message,
      data,
    });

    return Response.json({ success: true, result });
  } catch (error) {
    console.error("Error sending notification:", error);
    return Response.json({ error: "Failed to send notification" }, { status: 500 });
  }
}

// PUT mark all as read or batch update
export async function PUT(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { action, userId } = body;

    if (action === "read_all") {
      let filter: any = { "status.inApp": { $ne: "read" } };
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        filter.userId = userId;
      }

      await Notification.updateMany(filter, {
        "status.inApp": "read",
        readAt: new Date(),
      });

      return Response.json({ success: true, message: "All notifications marked as read" });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return Response.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}

// DELETE clear all notifications
export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let filter: any = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.userId = userId;
    }

    await Notification.deleteMany(filter);

    return Response.json({ success: true, message: "Notifications cleared successfully" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return Response.json({ error: "Failed to clear notifications" }, { status: 500 });
  }
}

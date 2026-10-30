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
    if (userId) {
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

    if (!userId || !type || !title || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await notificationService.sendNotification({
      userId,
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

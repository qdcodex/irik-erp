import { NotificationPreference } from "@/lib/models";
import dbConnect from "@/lib/db";

export const dynamic = "force-dynamic";

// GET user notification preferences
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    let prefs = await NotificationPreference.findOne({ userId });

    // Create default preferences if not found
    if (!prefs) {
      prefs = new NotificationPreference({
        userId,
        channels: {
          email: true,
          sms: true,
          push: true,
          inApp: true,
        },
        notifications: {
          classReminder: true,
          feeAlert: true,
          attendanceAlert: true,
          timetableChange: true,
          examResult: true,
          admissionStatus: true,
        },
        quietHours: {
          enabled: false,
        },
      });
      await prefs.save();
    }

    return Response.json(prefs);
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return Response.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

// PUT update notification preferences
export async function PUT(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, channels, notifications, quietHours } = body;

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const prefs = await NotificationPreference.findOneAndUpdate(
      { userId },
      {
        ...(channels && { channels }),
        ...(notifications && { notifications }),
        ...(quietHours && { quietHours }),
      },
      { new: true, upsert: true }
    );

    return Response.json({ success: true, prefs });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return Response.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}

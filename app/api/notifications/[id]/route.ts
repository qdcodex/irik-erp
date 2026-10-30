import { Notification } from "@/lib/models";
import dbConnect from "@/lib/db";

// PUT mark notification as read
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();
    const { action } = body;

    if (!id) {
      return Response.json({ error: "Notification ID is required" }, { status: 400 });
    }

    if (action === "read") {
      const notification = await Notification.findByIdAndUpdate(
        id,
        {
          "status.inApp": "read",
          readAt: new Date(),
        },
        { new: true }
      );

      if (!notification) {
        return Response.json({ error: "Notification not found" }, { status: 404 });
      }

      return Response.json({ success: true, notification });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notification:", error);
    return Response.json({ error: "Failed to update notification" }, { status: 500 });
  }
}

// DELETE notification
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!id) {
      return Response.json({ error: "Notification ID is required" }, { status: 400 });
    }

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return Response.json({ error: "Notification not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return Response.json({ error: "Failed to delete notification" }, { status: 500 });
  }
}

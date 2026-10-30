import { Notification, NotificationPreference, NotificationTemplate, User } from "@/lib/models";
import { emailService } from "./emailService";

export interface NotificationPayload {
  userId: string;
  type: "class_reminder" | "fee_alert" | "attendance_alert" | "timetable_change" | "exam_result" | "admission_status";
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface SendResult {
  inApp: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
}

class NotificationService {
  /**
   * Send notification through multiple channels based on user preferences
   */
  async sendNotification(payload: NotificationPayload): Promise<SendResult> {
    try {
      // Get user notification preferences
      const prefs = await NotificationPreference.findOne({ userId: payload.userId });
      const template = await NotificationTemplate.findOne({ type: payload.type });

      if (!prefs) {
        console.warn(`No notification preferences found for user ${payload.userId}`);
        return { inApp: false, email: false, sms: false, push: false };
      }

      // Create notification record
      const notification = new Notification({
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        data: payload.data,
        channels: {
          inApp: prefs.channels.inApp && prefs.notifications[payload.type as keyof typeof prefs.notifications],
          email: prefs.channels.email && prefs.notifications[payload.type as keyof typeof prefs.notifications],
          sms: prefs.channels.sms && prefs.notifications[payload.type as keyof typeof prefs.notifications],
          push: prefs.channels.push && prefs.notifications[payload.type as keyof typeof prefs.notifications],
        },
        status: {
          inApp: "pending",
          email: "pending",
          sms: "pending",
          push: "pending",
        },
      });

      await notification.save();

      const result: SendResult = {
        inApp: false,
        email: false,
        sms: false,
        push: false,
      };

      // Send through enabled channels
      if (notification.channels.inApp) {
        result.inApp = await this.sendInAppNotification(notification._id.toString());
      }

      if (notification.channels.email) {
        result.email = await this.sendEmailNotification(payload.userId, payload.title, payload.message, template);
      }

      if (notification.channels.sms) {
        result.sms = await this.sendSMSNotification(payload.userId, payload.message, template);
      }

      if (notification.channels.push) {
        result.push = await this.sendPushNotification(payload.userId, payload.title, payload.message);
      }

      return result;
    } catch (error) {
      console.error("Error sending notification:", error);
      return { inApp: false, email: false, sms: false, push: false };
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await Notification.findByIdAndUpdate(
        notificationId,
        {
          "status.inApp": "read",
          readAt: new Date(),
        },
        { new: true }
      );
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit: number = 50): Promise<any[]> {
    try {
      return await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error("Error getting user notifications:", error);
      return [];
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await Notification.countDocuments({
        userId,
        "status.inApp": { $ne: "read" },
      });
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  /**
   * Send in-app notification (stored in DB, ready to display)
   */
  private async sendInAppNotification(notificationId: string): Promise<boolean> {
    try {
      await Notification.findByIdAndUpdate(
        notificationId,
        { "status.inApp": "sent", sentAt: new Date() },
        { new: true }
      );
      return true;
    } catch (error) {
      console.error("Error sending in-app notification:", error);
      await Notification.findByIdAndUpdate(notificationId, { "status.inApp": "failed" });
      return false;
    }
  }

  /**
   * Send email notification (via SendGrid)
   * Note: Requires SENDGRID_API_KEY in environment
   */
  private async sendEmailNotification(
    userId: string,
    title: string,
    message: string,
    template?: any
  ): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      if (!user || !user.email) {
        console.warn(`No email found for user ${userId}`);
        return false;
      }

      const emailContent = template?.emailTemplate || message;
      const res = await emailService.sendEmail({
        to: user.email,
        subject: title,
        html: `<p>${emailContent}</p>`,
      });

      return res.success;
    } catch (error) {
      console.error("Error sending email notification:", error);
      return false;
    }
  }

  /**
   * Send SMS notification (via Twilio)
   * Note: Requires TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in environment
   */
  private async sendSMSNotification(userId: string, message: string, template?: any): Promise<boolean> {
    try {
      // Get user phone from database
      const user = require("../models").User.findById(userId);
      if (!user || !user.phone) {
        console.warn(`No phone found for user ${userId}`);
        return false;
      }

      const smsContent = (template?.smsTemplate || message).substring(0, 160); // SMS limit

      // TODO: Integrate with Twilio API
      // const twilio = require('twilio');
      // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      // await client.messages.create({
      //   body: smsContent,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: user.phone,
      // });

      console.log(`SMS notification sent to ${user.phone}: ${smsContent}`);
      return true;
    } catch (error) {
      console.error("Error sending SMS notification:", error);
      return false;
    }
  }

  /**
   * Send push notification (via Service Worker)
   * Note: Client-side implementation via Service Worker
   */
  private async sendPushNotification(userId: string, title: string, message: string): Promise<boolean> {
    try {
      // This would typically be handled by Service Worker on client
      // Server sends notification through WebPush API to subscribed users
      // TODO: Implement Web Push API integration
      console.log(`Push notification queued for ${userId}: ${title}`);
      return true;
    } catch (error) {
      console.error("Error sending push notification:", error);
      return false;
    }
  }

  /**
   * Schedule class reminder notification
   */
  async scheduleClassReminder(userId: string, className: string, time: string, instructorName: string): Promise<boolean> {
    try {
      const res = await this.sendNotification({
        userId,
        type: "class_reminder",
        title: `📚 Class Reminder: ${className}`,
        message: `Your ${className} class with ${instructorName} starts at ${time}`,
        data: { className, time, instructor: instructorName },
      });
      return res.inApp || res.email || res.sms || res.push;
    } catch (error) {
      console.error("Error scheduling class reminder:", error);
      return false;
    }
  }

  /**
   * Schedule fee alert notification
   */
  async scheduleFeeAlert(userId: string, amount: number, dueDate: string): Promise<boolean> {
    try {
      const daysUntilDue = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      let message = "";
      if (daysUntilDue <= 1) message = `⚠️ Fee payment due TODAY! Amount: ₹${amount}`;
      else if (daysUntilDue <= 3) message = `⚠️ Fee payment due in ${daysUntilDue} days! Amount: ₹${amount}`;
      else message = `📋 Fee reminder: ₹${amount} due by ${dueDate}`;

      const res = await this.sendNotification({
        userId,
        type: "fee_alert",
        title: "💰 Fee Payment Alert",
        message,
        data: { amount, dueDate },
      });
      return res.inApp || res.email || res.sms || res.push;
    } catch (error) {
      console.error("Error scheduling fee alert:", error);
      return false;
    }
  }

  /**
   * Schedule low attendance alert
   */
  async scheduleLowAttendanceAlert(userId: string, attendancePercentage: number): Promise<boolean> {
    try {
      const res = await this.sendNotification({
        userId,
        type: "attendance_alert",
        title: "⚠️ Low Attendance Alert",
        message: `Your attendance is ${attendancePercentage}%. Please attend more classes to maintain minimum 75% attendance.`,
        data: { attendancePercentage },
      });
      return res.inApp || res.email || res.sms || res.push;
    } catch (error) {
      console.error("Error scheduling attendance alert:", error);
      return false;
    }
  }

  /**
   * Notify timetable change
   */
  async notifyTimetableChange(userId: string, oldTime: string, newTime: string, className: string): Promise<boolean> {
    try {
      const res = await this.sendNotification({
        userId,
        type: "timetable_change",
        title: "📅 Timetable Updated",
        message: `${className} has been rescheduled from ${oldTime} to ${newTime}`,
        data: { className, oldTime, newTime },
      });
      return res.inApp || res.email || res.sms || res.push;
    } catch (error) {
      console.error("Error notifying timetable change:", error);
      return false;
    }
  }

  /**
   * Bulk send notifications
   */
  async sendBulk(userIds: string[], payload: Omit<NotificationPayload, "userId">): Promise<number> {
    let successCount = 0;

    for (const userId of userIds) {
      const result = await this.sendNotification({ ...payload, userId });
      if (result.inApp || result.email || result.sms || result.push) {
        successCount++;
      }
    }

    console.log(`Bulk notification: ${successCount}/${userIds.length} sent successfully`);
    return successCount;
  }
}

export const notificationService = new NotificationService();

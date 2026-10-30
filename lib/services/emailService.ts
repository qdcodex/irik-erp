import nodemailer, { Transporter } from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "irikinternationalacademy@gmail.com";
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "465", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      console.warn("⚠️ SMTP credentials not fully defined. Email sending will be logged to console only.");
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });
      console.log(`✅ SMTP Transporter initialized successfully with ${host}:${port}`);
    } catch (error) {
      console.error("Failed to initialize SMTP transporter:", error);
    }
  }

  /**
   * Send a general email
   */
  async sendEmail({ to, subject, text, html }: SendMailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      this.initializeTransporter();
    }

    const defaultHtml = html || (text ? `<p style="font-family: sans-serif; font-size: 14px; color: #333;">${text}</p>` : "");

    const formattedHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">IRIK INTERNATIONAL ACADEMY</h1>
          <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px;">Aviation & Professional Studies ERP</p>
        </div>
        <div style="padding: 28px 24px; color: #1e293b; line-height: 1.6;">
          ${defaultHtml}
        </div>
        <div style="background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0;">This is an automated notification from IRIK International Academy ERP.</p>
          <p style="margin: 4px 0 0;">For inquiries, contact: <a href="mailto:${this.fromEmail}" style="color: #0284c7; text-decoration: none;">${this.fromEmail}</a></p>
        </div>
      </div>
    `;

    try {
      if (this.transporter) {
        const info = await this.transporter.sendMail({
          from: `"IRIK International Academy" <${this.fromEmail}>`,
          to,
          subject,
          text: text || "IRIK Academy Notification",
          html: formattedHtml,
        });
        console.log(`📧 Email delivered to ${to} (Message ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
      } else {
        console.log(`[DEV/MOCK EMAIL] To: ${to} | Subject: ${subject}`);
        return { success: true, messageId: "mock-id-transporter-offline" };
      }
    } catch (err: any) {
      console.error(`❌ Failed to send email to ${to}:`, err.message || err);
      return { success: false, error: err.message || "Failed to send email" };
    }
  }

  /**
   * Helper: Send Fee Payment or Due Alert
   */
  async sendFeeAlert(studentName: string, studentEmail: string, feeType: string, amount: number, dueDate: string, isPaid: boolean = false) {
    const subject = isPaid
      ? `Payment Received - ${feeType} Receipt | IRIK Academy`
      : `Payment Reminder: ${feeType} Due on ${dueDate} | IRIK Academy`;

    const html = isPaid
      ? `
        <h2 style="color: #0f172a; margin-top: 0;">Payment Receipt Confirmation</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>We are pleased to confirm the receipt of your payment:</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; color: #166534; font-size: 14px;"><strong>Fee Category:</strong> ${feeType}</p>
          <p style="margin: 6px 0 0; color: #166534; font-size: 18px; font-weight: bold;"><strong>Amount Paid:</strong> ₹${amount.toLocaleString()}</p>
          <p style="margin: 6px 0 0; color: #166534; font-size: 13px;"><strong>Status:</strong> Paid & Verified</p>
        </div>
        <p>You can view your complete payment history anytime on the <a href="/fees" style="color: #0284c7;">Fee Portal</a>.</p>
      `
      : `
        <h2 style="color: #0f172a; margin-top: 0;">Tuition / Fee Payment Notice</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>This is a reminder regarding your upcoming fee installment:</p>
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>Fee Category:</strong> ${feeType}</p>
          <p style="margin: 6px 0 0; color: #b45309; font-size: 18px; font-weight: bold;"><strong>Amount Due:</strong> ₹${amount.toLocaleString()}</p>
          <p style="margin: 6px 0 0; color: #92400e; font-size: 13px;"><strong>Due Date:</strong> ${dueDate}</p>
        </div>
        <p>Please make your payment via UPI QR code or bank transfer through the Student Portal to avoid late penalties.</p>
      `;

    return this.sendEmail({ to: studentEmail, subject, html });
  }

  /**
   * Helper: Send Admission Status Update
   */
  async sendAdmissionUpdate(applicantName: string, applicantEmail: string, course: string, status: string) {
    const isApproved = status.toLowerCase() === "approved";
    const subject = isApproved
      ? `Congratulations! Admission Confirmed for ${course} | IRIK Academy`
      : `Admission Application Status: ${status} | IRIK Academy`;

    const html = isApproved
      ? `
        <h2 style="color: #0f172a; margin-top: 0;">Congratulations on Your Admission!</h2>
        <p>Dear <strong>${applicantName}</strong>,</p>
        <p>We are thrilled to inform you that your application for <strong>${course}</strong> has been <strong>approved</strong> by the IRIK Admissions Board.</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; color: #166534; font-size: 14px;"><strong>Program:</strong> ${course}</p>
          <p style="margin: 6px 0 0; color: #166534; font-size: 14px;"><strong>Status:</strong> Seat Confirmed</p>
          <p style="margin: 6px 0 0; color: #166534; font-size: 13px;">Next Steps: Verification of DGCA Medicals and Document Submission.</p>
        </div>
        <p>Our academic counselor will contact you shortly with reporting instructions and orientation dates.</p>
      `
      : `
        <h2 style="color: #0f172a; margin-top: 0;">Application Status Update</h2>
        <p>Dear <strong>${applicantName}</strong>,</p>
        <p>Your application for <strong>${course}</strong> has been updated to: <strong>${status}</strong>.</p>
        <p>Please check your application dashboard for any pending documentation or scheduled review dates.</p>
      `;

    return this.sendEmail({ to: applicantEmail, subject, html });
  }
}

export const emailService = new EmailService();
export default emailService;

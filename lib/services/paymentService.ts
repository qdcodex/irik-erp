import crypto from "crypto";

export interface PaymentPayload {
  invoiceId: string;
  studentId: string;
  amount: number;
  description: string;
  email: string;
  phone: string;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

export interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  description: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  email: string;
  contact: string;
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  error_source: string | null;
  error_reason: string | null;
  error_step: string | null;
  error_id: string | null;
  acquirer_data: Record<string, any>;
  notes: Record<string, any>;
  created_at: number;
  receipt: string;
}

class PaymentService {
  private razorpayKeyId: string;
  private razorpayKeySecret: string;
  private baseUrl = "https://api.razorpay.com/v1";

  constructor() {
    this.razorpayKeyId = process.env.RAZORPAY_KEY_ID || "";
    this.razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";

    if (!this.razorpayKeyId || !this.razorpayKeySecret) {
      console.warn("Razorpay credentials not configured. Payment functionality will be disabled.");
    }
  }

  /**
   * Create a Razorpay order for payment
   */
  async createOrder(payload: PaymentPayload): Promise<RazorpayOrder | null> {
    try {
      if (!this.razorpayKeyId || !this.razorpayKeySecret) {
        console.error("Razorpay credentials not configured");
        return null;
      }

      const amountInPaise = Math.round(payload.amount * 100); // Convert to paise

      const auth = Buffer.from(`${this.razorpayKeyId}:${this.razorpayKeySecret}`).toString("base64");

      const response = await fetch(`${this.baseUrl}/orders`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: payload.invoiceId,
          description: payload.description,
          customer_notify: 1,
          notes: {
            studentId: payload.studentId,
            invoiceId: payload.invoiceId,
            email: payload.email,
            phone: payload.phone,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Razorpay API error: ${response.statusText}`);
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      return null;
    }
  }

  /**
   * Fetch order details from Razorpay
   */
  async getOrder(orderId: string): Promise<RazorpayOrder | null> {
    try {
      if (!this.razorpayKeyId || !this.razorpayKeySecret) {
        console.error("Razorpay credentials not configured");
        return null;
      }

      const auth = Buffer.from(`${this.razorpayKeyId}:${this.razorpayKeySecret}`).toString("base64");

      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Razorpay API error: ${response.statusText}`);
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error("Error fetching Razorpay order:", error);
      return null;
    }
  }

  /**
   * Fetch payment details from Razorpay
   */
  async getPayment(paymentId: string): Promise<RazorpayPayment | null> {
    try {
      if (!this.razorpayKeyId || !this.razorpayKeySecret) {
        console.error("Razorpay credentials not configured");
        return null;
      }

      const auth = Buffer.from(`${this.razorpayKeyId}:${this.razorpayKeySecret}`).toString("base64");

      const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Razorpay API error: ${response.statusText}`);
      }

      const payment = await response.json();
      return payment;
    } catch (error) {
      console.error("Error fetching Razorpay payment:", error);
      return null;
    }
  }

  /**
   * Verify payment signature (webhook security)
   */
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    try {
      const message = `${orderId}|${paymentId}`;
      const generatedSignature = crypto
        .createHmac("sha256", this.razorpayKeySecret)
        .update(message)
        .digest("hex");

      return generatedSignature === signature;
    } catch (error) {
      console.error("Error verifying payment signature:", error);
      return false;
    }
  }

  /**
   * Generate QR code data URL for UPI payment
   */
  generateUPIQRCode(amount: number, invoiceId: string): string {
    try {
      // UPI string format: upi://pay?pa=upiid@bank&pn=name&am=amount&tn=description&tr=reference
      // For Razorpay, we use the order ID as transaction reference
      const upiString = `upi://pay?pa=${process.env.RAZORPAY_UPI_ID || "business@razorpay"}&pn=IRIKCollege&am=${amount}&tn=Fee%20Payment&tr=${invoiceId}`;

      // Return as data URL (in real app, generate QR code image)
      // This is a placeholder - actual QR code generation requires a library like qrcode
      return upiString;
    } catch (error) {
      console.error("Error generating UPI QR code:", error);
      return "";
    }
  }

  /**
   * Create payment for fee
   */
  async createFeePayment(
    invoiceId: string,
    studentId: string,
    amount: number,
    studentEmail: string,
    studentPhone: string
  ): Promise<any> {
    try {
      const order = await this.createOrder({
        invoiceId,
        studentId,
        amount,
        description: `Fee Payment - Invoice ${invoiceId}`,
        email: studentEmail,
        phone: studentPhone,
      });

      if (!order) {
        return { success: false, error: "Failed to create order" };
      }

      return {
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          qrCodeData: this.generateUPIQRCode(amount, invoiceId),
        },
        razorpayKey: this.razorpayKeyId,
      };
    } catch (error) {
      console.error("Error creating fee payment:", error);
      return { success: false, error: "Failed to create payment" };
    }
  }

  /**
   * Capture payment (mark as successful)
   */
  async capturePayment(paymentId: string, amount: number): Promise<boolean> {
    try {
      if (!this.razorpayKeyId || !this.razorpayKeySecret) {
        console.error("Razorpay credentials not configured");
        return false;
      }

      const amountInPaise = Math.round(amount * 100);
      const auth = Buffer.from(`${this.razorpayKeyId}:${this.razorpayKeySecret}`).toString("base64");

      const response = await fetch(`${this.baseUrl}/payments/${paymentId}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amountInPaise }),
      });

      return response.ok;
    } catch (error) {
      console.error("Error capturing payment:", error);
      return false;
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, amount?: number): Promise<boolean> {
    try {
      if (!this.razorpayKeyId || !this.razorpayKeySecret) {
        console.error("Razorpay credentials not configured");
        return false;
      }

      const auth = Buffer.from(`${this.razorpayKeyId}:${this.razorpayKeySecret}`).toString("base64");

      const body: any = {};
      if (amount) {
        body.amount = Math.round(amount * 100);
      }

      const response = await fetch(`${this.baseUrl}/payments/${paymentId}/refund`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      return response.ok;
    } catch (error) {
      console.error("Error refunding payment:", error);
      return false;
    }
  }
}

export const paymentService = new PaymentService();

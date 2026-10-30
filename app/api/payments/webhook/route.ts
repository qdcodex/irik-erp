import { paymentService } from "@/lib/services/paymentService";
import { Fee } from "@/lib/models";
import dbConnect from "@/lib/db";
import { notificationService } from "@/lib/services/notificationService";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { event, payload } = body;

    // Verify webhook signature
    if (event === "payment.authorized") {
      const { payment, order } = payload;
      const orderId = order.entity.id;
      const paymentId = payment.entity.id;
      const signature = request.headers.get("x-razorpay-signature") || "";

      // Verify signature
      const isValid = paymentService.verifyPaymentSignature(orderId, paymentId, signature);

      if (!isValid) {
        console.warn("Invalid webhook signature");
        return Response.json({ error: "Invalid signature" }, { status: 401 });
      }

      // Get payment details
      const paymentDetails = await paymentService.getPayment(paymentId);

      if (!paymentDetails) {
        return Response.json({ error: "Failed to fetch payment details" }, { status: 500 });
      }

      // Update fee status to paid
      const invoiceId = order.entity.receipt;
      const updateResult = await Fee.findOneAndUpdate(
        { _id: invoiceId },
        {
          status: "paid",
          paidDate: new Date(),
        },
        { new: true }
      );

      if (updateResult) {
        // Send payment confirmation notification
        await notificationService.sendNotification({
          userId: updateResult.studentId?.toString() || "",
          type: "fee_alert",
          title: "✅ Payment Confirmed",
          message: `Your fee payment of ₹${updateResult.amount} has been successfully processed.`,
          data: {
            invoiceId,
            paymentId,
            amount: updateResult.amount,
          },
        });

        console.log(`Payment confirmed for invoice ${invoiceId}`);
      }

      return Response.json({ success: true });
    }

    // Handle other webhook events
    if (event === "payment.failed") {
      const { payment, order } = body.payload;
      const invoiceId = order.entity.receipt;

      // Send payment failure notification
      const fee = await Fee.findById(invoiceId);
      if (fee) {
        await notificationService.sendNotification({
          userId: fee.studentId?.toString() || "",
          type: "fee_alert",
          title: "❌ Payment Failed",
          message: `Your fee payment of ₹${fee.amount} could not be processed. Please try again.`,
          data: { invoiceId, paymentId: payment.entity.id },
        });
      }

      return Response.json({ success: true });
    }

    if (event === "payment.captured") {
      const { payment, order } = body.payload;
      console.log(`Payment captured: ${payment.entity.id}`);
      return Response.json({ success: true });
    }

    // Unknown event
    console.log(`Received webhook event: ${event}`);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    return Response.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

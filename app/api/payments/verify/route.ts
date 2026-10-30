import { paymentService } from "@/lib/services/paymentService";
import { Fee } from "@/lib/models";
import dbConnect from "@/lib/db";
import { notificationService } from "@/lib/services/notificationService";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ error: "Missing payment details" }, { status: 400 });
    }

    // Verify payment signature
    const isValid = paymentService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      console.warn("Invalid payment signature");
      return Response.json({ error: "Payment verification failed" }, { status: 401 });
    }

    // Fetch payment details from Razorpay
    const paymentDetails = await paymentService.getPayment(razorpay_payment_id);

    if (!paymentDetails) {
      return Response.json({ error: "Failed to fetch payment details" }, { status: 500 });
    }

    // Check if payment is captured
    if (paymentDetails.status !== "captured" && paymentDetails.status !== "authorized") {
      return Response.json({ error: "Payment not captured" }, { status: 400 });
    }

    // Fetch order details to get invoice ID
    const orderDetails = await paymentService.getOrder(razorpay_order_id);

    if (!orderDetails) {
      return Response.json({ error: "Failed to fetch order details" }, { status: 500 });
    }

    const invoiceId = orderDetails.receipt;

    // Update fee status to paid
    const fee = await Fee.findByIdAndUpdate(
      invoiceId,
      {
        status: "paid",
        paidDate: new Date(),
      },
      { new: true }
    );

    if (!fee) {
      console.warn(`Fee not found for invoice ${invoiceId}`);
      // Still return success since payment was processed
      return Response.json({
        success: true,
        message: "Payment verified but fee record not updated",
        paymentId: razorpay_payment_id,
      });
    }

    // Send payment confirmation notification
    try {
      await notificationService.sendNotification({
        userId: fee.studentId?.toString() || "",
        type: "fee_alert",
        title: "✅ Payment Confirmed",
        message: `Your fee payment of ₹${fee.amount} has been successfully processed. Check your email for the receipt.`,
        data: {
          invoiceId,
          paymentId: razorpay_payment_id,
          amount: fee.amount,
        },
      });
    } catch (notifyError) {
      console.error("Error sending notification:", notifyError);
      // Don't fail the payment verification if notification fails
    }

    return Response.json({
      success: true,
      message: "Payment verified and processed",
      paymentId: razorpay_payment_id,
      invoiceId,
      amount: fee.amount,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return Response.json({ error: "Payment verification failed" }, { status: 500 });
  }
}

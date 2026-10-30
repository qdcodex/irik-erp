import { paymentService } from "@/lib/services/paymentService";
import dbConnect from "@/lib/db";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { invoiceId, studentId, amount, studentEmail, studentPhone } = body;

    if (!invoiceId || !studentId || !amount || !studentEmail || !studentPhone) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await paymentService.createFeePayment(
      invoiceId,
      studentId,
      amount,
      studentEmail,
      studentPhone
    );

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json(result);
  } catch (error) {
    console.error("Error creating payment order:", error);
    return Response.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}

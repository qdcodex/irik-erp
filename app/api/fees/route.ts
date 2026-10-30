import { connectDB } from "@/lib/db";
import { Fee, Student } from "@/lib/models";
import { emailService } from "@/lib/services/emailService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const studentId = searchParams.get("studentId");

    const query: any = {};
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;

    const fees = await Fee.find(query)
      .populate("studentId", "name rollNo email course")
      .sort({ dueDate: -1 });

    return NextResponse.json(fees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch fees" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.studentId || !data.amount || !data.feeType) {
      return NextResponse.json({ error: "studentId, amount, and feeType are required" }, { status: 400 });
    }

    const fee = await Fee.create({
      ...data,
      status: data.status || "pending",
      dueDate: data.dueDate || new Date(),
    });

    // Notify student of new invoice
    try {
      const student = await Student.findById(data.studentId);
      if (student && student.email) {
        await emailService.sendFeeAlert(
          student.name,
          student.email,
          fee.feeType,
          fee.amount,
          new Date(fee.dueDate).toLocaleDateString(),
          fee.status === "paid"
        );
      }
    } catch (e) {
      console.warn("Fee notification email failed:", e);
    }

    return NextResponse.json(fee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create fee record" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { id, status, paidDate } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const updated = await Fee.findByIdAndUpdate(
      id,
      {
        status,
        ...(status === "paid" ? { paidDate: paidDate || new Date() } : {}),
      },
      { new: true }
    ).populate("studentId", "name email");

    if (!updated) {
      return NextResponse.json({ error: "Fee record not found" }, { status: 404 });
    }

    // If paid, send payment confirmation receipt
    if (status === "paid" && updated.studentId) {
      try {
        const student = updated.studentId as any;
        if (student.email) {
          await emailService.sendFeeAlert(
            student.name,
            student.email,
            updated.feeType,
            updated.amount,
            new Date(updated.dueDate).toLocaleDateString(),
            true
          );
        }
      } catch (e) {
        console.warn("Receipt email delivery failed:", e);
      }
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update fee record" }, { status: 500 });
  }
}

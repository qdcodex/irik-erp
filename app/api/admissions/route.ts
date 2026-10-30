import { connectDB } from "@/lib/db";
import { Admission } from "@/lib/models";
import { emailService } from "@/lib/services/emailService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const admissions = await Admission.find().sort({ appliedDate: -1 });
    return NextResponse.json(admissions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admissions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.applicantName || !data.email || !data.appliedCourse) {
      return NextResponse.json({ error: "Missing required fields: applicantName, email, appliedCourse" }, { status: 400 });
    }

    const admission = await Admission.create({
      ...data,
      appliedDate: data.appliedDate || new Date(),
      status: data.status || "pending",
    });

    // Send confirmation email
    try {
      await emailService.sendAdmissionUpdate(admission.applicantName, admission.email, admission.appliedCourse, admission.status);
    } catch (e) {
      console.warn("Admission email notification failed:", e);
    }

    return NextResponse.json(admission, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create admission" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { id, status, notes } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const admission = await Admission.findByIdAndUpdate(
      id,
      { status, ...(notes ? { notes } : {}) },
      { new: true }
    );

    if (!admission) {
      return NextResponse.json({ error: "Admission record not found" }, { status: 404 });
    }

    // Trigger email on status update (e.g. Approved / Medical Verified)
    try {
      await emailService.sendAdmissionUpdate(admission.applicantName, admission.email, admission.appliedCourse, admission.status);
    } catch (e) {
      console.warn("Status update email notification failed:", e);
    }

    return NextResponse.json(admission);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update admission status" }, { status: 500 });
  }
}

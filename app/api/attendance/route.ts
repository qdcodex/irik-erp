import { connectDB } from "@/lib/db";
import { Attendance } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");
    const date = searchParams.get("date");

    const query: any = {};
    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    const records = await Attendance.find(query)
      .populate("studentId", "name rollNo course")
      .populate("courseId", "name code")
      .sort({ date: -1 });

    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Support single record or batch of records
    if (Array.isArray(body)) {
      const records = await Attendance.insertMany(body);
      return NextResponse.json(records, { status: 201 });
    }

    if (!body.studentId || !body.status) {
      return NextResponse.json({ error: "studentId and status are required" }, { status: 400 });
    }

    const record = await Attendance.create({
      ...body,
      date: body.date || new Date(),
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to record attendance" }, { status: 500 });
  }
}

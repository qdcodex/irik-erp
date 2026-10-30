import { connectDB } from "@/lib/db";
import { Timetable } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const day = searchParams.get("day");
    const semester = searchParams.get("semester");

    const query: any = {};
    if (day) query.dayOfWeek = day;
    if (semester) query.semester = parseInt(semester, 10);

    const slots = await Timetable.find(query)
      .populate("courseId", "name code credits")
      .sort({ startTime: 1 });

    return NextResponse.json(slots);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch timetable" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.courseId || !data.dayOfWeek || !data.startTime || !data.endTime) {
      return NextResponse.json({ error: "Missing required fields: courseId, dayOfWeek, startTime, endTime" }, { status: 400 });
    }

    const slot = await Timetable.create(data);
    return NextResponse.json(slot, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create timetable slot" }, { status: 500 });
  }
}

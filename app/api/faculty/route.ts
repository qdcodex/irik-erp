import { connectDB } from "@/lib/db";
import { Faculty } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const faculty = await Faculty.find().sort({ name: 1 });
    return NextResponse.json(faculty);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch faculty" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.name || !data.email) {
      return NextResponse.json({ error: "name and email are required" }, { status: 400 });
    }

    const member = await Faculty.create({
      ...data,
      joiningDate: data.joiningDate || new Date(),
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create faculty record" }, { status: 500 });
  }
}

import { connectDB } from "@/lib/db";
import { Asset } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const query: any = {};
    if (type) query.type = type;

    const assets = await Asset.find(query).sort({ name: 1 });
    return NextResponse.json(assets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch assets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.name || !data.registrationNumber || !data.type) {
      return NextResponse.json({ error: "name, registrationNumber, and type are required" }, { status: 400 });
    }

    const asset = await Asset.create(data);
    return NextResponse.json(asset, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create asset" }, { status: 500 });
  }
}

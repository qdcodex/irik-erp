import { NextRequest, NextResponse } from "next/server";
import { cloudinaryService } from "@/lib/services/cloudinaryService";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // Handle JSON (Base64)
    if (contentType.includes("application/json")) {
      const { base64Data, folder = "irik-erp/uploads" } = await request.json();
      if (!base64Data) {
        return NextResponse.json({ error: "base64Data is required" }, { status: 400 });
      }

      const result = await cloudinaryService.uploadBase64(base64Data, folder);
      return NextResponse.json(result, { status: 201 });
    }

    // Handle Multipart Form-Data
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "irik-erp/documents";

      if (!file) {
        return NextResponse.json({ error: "No file provided in form data" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await cloudinaryService.uploadBuffer(buffer, folder);
      return NextResponse.json(result, { status: 201 });
    }

    return NextResponse.json(
      { error: "Unsupported Content-Type. Use multipart/form-data or application/json" },
      { status: 415 }
    );
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file to Cloudinary" },
      { status: 500 }
    );
  }
}

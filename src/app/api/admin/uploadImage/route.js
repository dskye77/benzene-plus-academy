import { uploadBuffer } from "@/server/cloudinary";
import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/getUserSession";

/**
 * POST /api/admin/uploadImage
 * Accepts file uploads (multipart/form-data).
 * Responds with image metadata or error.
 * Checks if user is authenticated.
 */
export async function POST(request) {
  try {
    const user = await getUserFromSession();
    if (!user || !user.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const folder = formData.get("folder") || "benzene-plus-academy/scorers";
    const publicId = formData.get("publicId")?.trim() || undefined;

    const result = await uploadBuffer(buffer, {
      folder,
      allowedFormats: ["jpg", "jpeg", "png", "webp"],
      publicId,
      overwrite: true,           // ← Explicitly force it
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json(
      { error: "Image upload failed", details: err?.message },
      { status: 500 }
    );
  }
}
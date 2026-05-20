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
    // Check if user is authenticated
    const user = await getUserFromSession();
    if (!user || !user.uid) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing user" },
        { status: 401 }
      );
    }

    // Parse form-data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file into Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optional: add folder logic or other options
    const folder = formData.get("folder") || "uploads";
    const allowedFormats = ["jpg", "jpeg", "png", "webp"];

    // Use uploadBuffer to upload to Cloudinary
    const result = await uploadBuffer(buffer, {
      folder,
      allowedFormats,
      publicId: formData.get("publicId") || undefined,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json(
      { error: "Image upload failed", details: err?.message },
      { status: 500 },
    );
  }
}

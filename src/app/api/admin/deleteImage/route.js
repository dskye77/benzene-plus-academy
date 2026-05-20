import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/getUserSession";
import { deleteImage } from "@/server/cloudinary"; // use the deleteImage function

/**
 * POST /api/admin/deleteImage
 * Accepts { publicId } in JSON body to delete image from Cloudinary.
 * Requires authentication.
 */
export async function POST(request) {
  try {
    // Check if user is authenticated
    const user = await getUserFromSession();
    if (!user || !user.uid) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing user" },
        { status: 401 },
      );
    }

    // Parse request body
    const data = await request.json();
    const { publicId } = data || {};

    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json(
        { error: "No publicId provided" },
        { status: 400 },
      );
    }

    // Use the dedicated deleteImage function from cloudinary.js
    const result = await deleteImage(publicId);

    if (result?.result !== "ok" && result?.result !== "not found") {
      return NextResponse.json(
        { error: "Cloudinary returned error", details: result },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("Image delete error:", err);
    return NextResponse.json(
      { error: "Image deletion failed", details: err?.message },
      { status: 500 },
    );
  }
}

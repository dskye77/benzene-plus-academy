import { NextResponse } from "next/server";
import { updatePost, deletePost } from "@/server/firestoreAdminBlog";

/**
 * API Route: PATCH /api/admin/blog/[slug]
 * Updates an existing blog post by slug (admin only).
 * Expects JSON body with updated post fields.
 */
export async function PATCH(req, context) {
  try {
    // params may be a promise in some Next.js versions; await if so.
    const params =
      context?.params && typeof context.params.then === "function"
        ? await context.params
        : context?.params;

    const { slug } = params || {};
    const data = await req.json();

    if (!slug) {
      return NextResponse.json(
        { error: "Missing required param: slug" },
        { status: 400 },
      );
    }

    await updatePost(slug, data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update post" },
      { status: 500 },
    );
  }
}

/**
 * API Route: DELETE /api/admin/blog/[slug]
 * Deletes a blog post by slug (admin only).
 * No body required.
 */
export async function DELETE(req, context) {
  try {
    // params may be a promise in some Next.js versions; await if so.
    const params =
      context?.params && typeof context.params.then === "function"
        ? await context.params
        : context?.params;

    const { slug } = params || {};

    if (!slug) {
      return NextResponse.json(
        { error: "Missing required param: slug" },
        { status: 400 },
      );
    }

    await deletePost(slug);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete post" },
      { status: 500 },
    );
  }
}
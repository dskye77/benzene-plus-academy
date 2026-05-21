import { NextResponse } from "next/server";
import { getPostBySlug } from "@/server/firestoreAdminBlog";

/**
 * API Route: GET /api/blogs/[slug]
 * Returns a single published blog post by slug (if found and status === "Published").
 * Handles params that might be a promise for compatibility.
 */
export async function GET(req, context) {
  // params may be a promise in some Next.js versions; await if so.
  const params =
    context?.params && typeof context.params.then === "function"
      ? await context.params
      : context?.params;

  const { slug } = params || {};

  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug parameter" },
      { status: 400 }
    );
  }

  try {
    const post = await getPostBySlug(slug);

    if (!post || post.status !== "published") {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

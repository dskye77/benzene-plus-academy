import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/server/firestoreAdminBlog";

/**
 * API Route: GET /api/blogs
 * Returns all published blog posts (status === "published").
 */
export async function GET() {
  try {
    const posts = await getPublishedPosts();
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.log(error.message)
    return NextResponse.json(
      { error: error.message || "Failed to fetch published posts" },
      { status: 500 },
    );
  }
}

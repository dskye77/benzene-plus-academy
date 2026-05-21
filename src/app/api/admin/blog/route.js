import { isUserAdmin } from "@/server/firestoreAdmin";
import { getUserFromSession } from "@/server/getUserSession";

import { NextResponse } from "next/server";
import { addPost, isSlugTaken, getAllPosts } from "@/server/firestoreAdminBlog";

/**
 * API Route: POST /api/admin/blog
 * Adds a new blog post (admin only).
 * Expects JSON body with post fields.
 */
export async function POST(req) {
  try {
    // Authorization: Only allow admins
    const user = await getUserFromSession();
    if (!user?.uid) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing user" },
        { status: 401 },
      );
    }

    const isAdmin = await isUserAdmin(user.uid);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admins only" },
        { status: 403 },
      );
    }

    const data = await req.json();

    // Basic validation (require title and slug)
    if (!data.title || !data.slug) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug" },
        { status: 400 },
      );
    }

    // Check if slug is taken
    if (await isSlugTaken(data.slug)) {
      return NextResponse.json(
        { error: "Slug is already taken" },
        { status: 409 }
      );
    }

    const id = await addPost(data);

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to add post" },
      { status: 500 },
    );
  }
}

/**
 * API Route: GET /api/admin/blog
 * Gets all blog posts (admin only, includes drafts).
 */
export async function GET(req) {
  try {
    // Authorization: Only allow admins
    const user = await getUserFromSession();
    if (!user?.uid) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing user" },
        { status: 401 },
      );
    }

    const isAdmin = await isUserAdmin(user.uid);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admins only" },
        { status: 403 },
      );
    }

    const posts = await getAllPosts();

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to get posts" },
      { status: 500 }
    );
  }
}
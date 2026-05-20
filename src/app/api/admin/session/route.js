// app/api/admin/session/route.js
import { admin } from "@/server/firebaseAdmin";
import { isUserAdmin } from "@/server/firestoreAdmin";
import { cookies } from "next/headers";

/**
 * POST /api/admin/session
 * Verifies the Firebase ID token, checks isAdmin, then sets an httpOnly session cookie.
 * Body: { idToken: string }
 */
export async function POST(request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return Response.json({ error: "Missing idToken" }, { status: 400 });
    }

    // Verify the token with Firebase Admin
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Check Firestore isAdmin flag
    const adminStatus = await isUserAdmin(decoded.uid);
    if (!adminStatus) {
      return Response.json(
        { error: "Forbidden: not an admin" },
        { status: 403 },
      );
    }

    // Create a Firebase session cookie (5-day expiry)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in ms
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    // Set httpOnly, secure, sameSite cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn / 1000, // seconds
      path: "/",
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Session creation error:", error);
    return Response.json(
      { error: "Unauthorized", details: error.message },
      { status: 401 },
    );
  }
}

/**
 * DELETE /api/admin/session
 * Clears the session cookie (logout).
 */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return Response.json({ success: true }, { status: 200 });
}

// server/auth/getUserFromToken.js
import { admin } from "@/server/firebaseAdmin";

export async function getUserFromToken(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      admin: decoded.admin || false,
    };
  } catch {
    return null;
  }
}

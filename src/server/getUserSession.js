import { admin } from "@/server/firebaseAdmin";
import { cookies } from "next/headers";

export async function getUserFromSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) return null;
  try {
    const decoded = await admin.auth().verifySessionCookie(session, true);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}
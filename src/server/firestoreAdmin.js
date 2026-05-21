import { admin } from "@/server/firebaseAdmin";

/**
 * Asynchronously checks if the user in Firestore has an `isAdmin` flag set to true.
 * @param {string} uid - The user's UID.
 * @returns {Promise<boolean>} Resolves to true if the user has isAdmin set to true, false otherwise.
 */
export async function isUserAdmin(uid) {
  if (!uid) return false;
  try {
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;
    return userData && userData.isAdmin === true;
  } catch (e) {
    console.error("Error checking if user is admin:", e);
    return false;
  }
}

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

/**
 * Gets all scorers from the "scorers" collection using Firebase Admin SDK.
 * @returns {Promise<Array<Object>>} An array of scorer objects, each including its document id.
 */
export async function getAllScorers() {
  const snapshot = await admin.firestore().collection("scorers").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Adds a new scorer to the "scorers" collection using Firebase Admin SDK.
 * @param {Object} scorerData - The fields for the scorer (name, exam, score, year, etc).
 * @returns {Promise<string>} The document id of the added scorer
 */
export async function addScorer(scorerData) {
  // Use the Firebase Admin SDK to add a document as an admin
  const docRef = await admin.firestore().collection("scorers").add(scorerData);
  return docRef.id;
}

/**
 * Deletes a scorer from the "scorers" collection by document ID using Firebase Admin SDK.
 * @param {string} scorerId - The document ID of the scorer to delete.
 * @returns {Promise<void>}
 */
export async function deleteScorer(scorerId) {
  if (!scorerId) {
    throw new Error("Missing scorer ID for deletion");
  }
  await admin.firestore().collection("scorers").doc(scorerId).delete();
}

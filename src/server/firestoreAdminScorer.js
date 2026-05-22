import { admin } from "@/server/firebaseAdmin";

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
 * Fetches scorers from the "scorers" collection for a given year using Firebase Admin SDK.
 * @param {number|string} year - The year to fetch scorers for.
 * @returns {Promise<Array<Object>>}
 */
export async function fetchScorers(year) {
  if (!year) {
    throw new Error("Year is required to fetch scorers.");
  }
  const parsedYear = Number(year);
  const snapshot = await admin
    .firestore()
    .collection("scorers")
    .where("year", "==", parsedYear)
    .get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Fetches a single scorer by document ID from the "scorers" collection using Firebase Admin SDK.
 * @param {string} scorerId - The document ID of the scorer to fetch.
 * @returns {Promise<Object|null>} The scorer object (with id) or null if not found.
 */
export async function fetchScorer(scorerId) {
  if (!scorerId) {
    throw new Error("Scorer ID is required to fetch scorer.");
  }
  const docRef = admin.firestore().collection("scorers").doc(scorerId);
  const docSnapshot = await docRef.get();
  if (!docSnapshot.exists) {
    return null;
  }
  return { id: docSnapshot.id, ...docSnapshot.data() };
}

/**
 * Adds a new scorer to the "scorers" collection using Firebase Admin SDK.
 * @param {Object} scorerData - The fields for the scorer (name, exam, score, year, etc).
 * @returns {Promise<string>} The document id of the added scorer
 */
export async function addScorer(scorerData, id) {
  if (!id) {
    throw new Error("Scorer id is required.");
  }
  const docRef = admin.firestore().collection("scorers").doc(id);

  const docSnapshot = await docRef.get();
  if (docSnapshot.exists) {
    throw new Error("Scorer with this id already exists.");
  }

  await docRef.set(scorerData);
  return id;
}

/**
 * Updates an existing scorer in the "scorers" collection by document ID using Firebase Admin SDK.
 * Only fields specified in updates will be changed.
 * @param {string} scorerId - The document ID of the scorer to update.
 * @param {Object} updates - Key-value pairs of fields to update.
 * @returns {Promise<void>}
 */
export async function updateScorer(scorerId, updates) {
  if (!scorerId) {
    throw new Error("Missing scorer ID for update");
  }
  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    throw new Error("Updates object is required for updating scorer");
  }
  await admin.firestore().collection("scorers").doc(scorerId).update(updates);
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

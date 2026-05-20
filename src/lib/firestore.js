import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { app } from "./firebase";

/**
 * Fetches all documents from the "scorers" collection and returns them as an array.
 * Each item has its firebase document 'id' keyed as 'id'.
 * @returns {Promise<Array<Object>>}
 */
/**
 * Fetches scorers from the "scorers" collection for a given year.
 * @param {number|string} year - The year to fetch scorers for.
 * @returns {Promise<Array<Object>>}
 */
import { query, where } from "firebase/firestore";

export async function fetchScorers(year) {
  const db = getFirestore(app);
  const scorersCol = collection(db, "scorers");
  const scorersQuery = query(scorersCol, where("year", "==", year));
  const scorersSnapshot = await getDocs(scorersQuery);
  return scorersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

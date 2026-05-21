import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from "./firebase";

/**
 * Fetches scorers from the "scorers" collection for a given year.
 * @param {number|string} year - The year to fetch scorers for.
 * @returns {Promise<Array<Object>>}
 */
export async function fetchScorers(year) {
  if (!year) {
    throw new Error("Year is required to fetch scorers.");
  }
  const parsedYear = Number(year)
  const db = getFirestore(app);
  const scorersCol = collection(db, "scorers");
  const scorersQuery = query(scorersCol, where("year", "==", parsedYear));
  const scorersSnapshot = await getDocs(scorersQuery);
  return scorersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

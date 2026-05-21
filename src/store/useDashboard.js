import { create } from "zustand";
import { fetchScorers, uploadScorer, deleteScorer } from "@/lib/api/scorers";

const useDashboardStore = create((set, get) => ({
  scorers: [],
  loading: false,
  error: null,

  /** Fetch all scorers from the API */
  async fetchScorers() {
    set({ loading: true, error: null });
    try {
      const data = await fetchScorers();
      set({ scorers: Array.isArray(data) ? data : [] });
    } catch (err) {
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Upload a new scorer then refetch the full list so the card shows
   * the real document (with id, image URL, etc.) from Firestore.
   */
  async uploadScorer(scorer) {
    set({ loading: true, error: null });
    try {
      await uploadScorer(scorer);
      // Refetch so we have the real Firestore document with id + imageUrl
      const data = await fetchScorers();
      set({ scorers: Array.isArray(data) ? data : [] });
    } catch (err) {
      set({ error: err });
      throw err; // re-throw so the form can handle it
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Delete a scorer by ID (optimistic UI — remove immediately, restore on failure).
   */
  async deleteScorer(scorerId, imagePublicId) {
    const previous = get().scorers;
    // Optimistic remove
    set((state) => ({
      scorers: state.scorers.filter((s) => s.id !== scorerId),
    }));
    try {
      await deleteScorer(scorerId, imagePublicId);
    } catch (err) {
      // Restore on failure
      set({ scorers: previous, error: err });
      throw err;
    }
  },
}));

export default useDashboardStore;

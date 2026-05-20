import { create } from "zustand";

// API utilities (adjust paths as needed)
import {
  fetchScorers,
  uploadScorer,
  deleteScorer,
} from "@/lib/api/scorers";

const useDashboardStore = create((set, get) => ({
  scorers: [],
  loading: false,
  error: null,

  // Fetch all scorers from the API
  async fetchScorers() {
    set({ loading: true, error: null });
    try {
      const data = await fetchScorers();
      set({ scorers: data || [] });
    } catch (err) {
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },

  // Upload a new scorer (expects a scorer object)
  async uploadScorer(scorer) {
    set({ loading: true, error: null });
    try {
      const newScorer = await uploadScorer(scorer);
      set((state) => ({
        scorers: [newScorer, ...(state.scorers || [])],
      }));
    } catch (err) {
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },

  // Delete a scorer by ID
  async deleteScorer(scorerId, imagePublicId) {
    set({ loading: true, error: null });
    try {
      await deleteScorer(scorerId, imagePublicId);
      set((state) => ({
        scorers: state.scorers.filter((s) => s.id !== scorerId),
      }));
    } catch (err) {
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useDashboardStore;
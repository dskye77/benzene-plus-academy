import { create } from "zustand";

// Optionally, import your paginated fetch function.
import { getScorersPaginated } from "@/lib/client/scorers"; // Update the path as needed

/**
 * Zustand store for paginated scorers list.
 * The store manages list state, pagination, error, loading and fetch/reload actions.
 */
const DEFAULT_PAGE_SIZE = 40;
const DEFAULT_YEAR = new Date().getFullYear();

const useScorersStore = create((set, get) => ({
  scorers: [],
  page: 1,
  loading: false,
  hasMore: true,
  error: null,
  pageSize: DEFAULT_PAGE_SIZE,
  year: DEFAULT_YEAR,

  /**
   * Fetch a page of scorers.
   * @param {number} targetPage
   * @param {boolean} overwrite
   */
  async fetchPage(targetPage = 1, overwrite = false) {
    const { year, pageSize } = get();
    set({ loading: true, error: null });
    try {
      const res = await getScorersPaginated(year, targetPage, pageSize);

      set((state) => ({
        scorers: overwrite
          ? res.scorers || []
          : [...(state.scorers || []), ...(res.scorers || [])],
        hasMore: res.scorers && res.scorers.length === pageSize,
        page: targetPage,
      }));
    } catch (err) {
      set({ error: err });
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Reload/fetch first page.
   * Resets pagination and replaces the scorer list.
   */
  async reload() {
    set({
      page: 1,
      scorers: [],
      hasMore: true,
      error: null,
    });
    await get().fetchPage(1, true);
  },

  /**
   * Fetch next page (adds to the scorers list)
   */
  async fetchNext() {
    const { loading, hasMore, page } = get();
    if (loading || !hasMore) return;
    await get().fetchPage(page + 1, false);
  },

  /**
   * Set the year and optionally reset the store
   */
  setYear(year) {
    set({ year });
  },

  /**
   * Set the page size and optionally reset the store
   */
  setPageSize(pageSize) {
    set({ pageSize });
  },
}));

export default useScorersStore;

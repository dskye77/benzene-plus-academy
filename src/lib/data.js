/**
 * Fetches a paginated array of scorers from the /api/scorers endpoint.
 * @param {number|string} year - The year to fetch scorers for.
 * @param {number} targetPage - The page number to fetch.
 * @param {number} pageSize - The number of scorers per page.
 * @returns {Promise<{scorers: Array<Object>, total: number}>}
 */
export async function getScorersPaginated(year, targetPage, pageSize) {
  const params = new URLSearchParams({
    year: Number(year),
    page: String(targetPage),
    pageSize: String(pageSize),
  });

  const res = await fetch(`/api/scorers?${params.toString()}`, {
    method: "GET",
  });

  if (!res.ok) {
    const { error, details } = await res.json().catch(() => ({}));
    throw new Error(
      error
        ? `${error}${details ? ": " + details : ""}`
        : "Failed to fetch scorers (paginated)",
    );
  }

  const data = await res.json();
  return { scorers: data.scorers || [], total: data.total || 0 };
}

/**
 * Fetches all scorers for a given year, with an optional minScore filter.
 * @param {number} year - The year to fetch scorers for.
 * @param {number} [minScore] - Optional minimum score to filter scorers.
 * @returns {Promise<{scorers: Array<Object>, total: number}>}
 */
export async function getAllScorersWithMinScore(year, minScore) {
  const params = new URLSearchParams({
    year: Number(year),
  });
  if (minScore !== undefined && minScore !== null && minScore !== "") {
    params.append("minScore", Number(minScore));
  }

  const res = await fetch(`/api/scorers?${params.toString()}`, {
    method: "GET",
  });

  if (!res.ok) {
    const { error, details } = await res.json().catch(() => ({}));
    throw new Error(
      error
        ? `${error}${details ? ": " + details : ""}`
        : "Failed to fetch scorers (minScore)",
    );
  }

  const data = await res.json();
  return { scorers: data.scorers || [], total: data.total || 0 };
}

const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 12 }, (_, i) => CURRENT_YEAR - i);

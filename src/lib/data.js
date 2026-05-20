/**
 * Fetches a paginated array of scorers from the /api/scorers endpoint.
 * @param {number|string} year - The year to fetch scorers for.
 * @param {number} targetPage - The page number to fetch.
 * @param {number} pageSize - The number of scorers per page.
 * @returns {Promise<{scorers: Array<Object>}>} - Resolves to an object containing an array of scorer objects.
 */
export async function getScorersPaginated(year, targetPage, pageSize) {
  const res = await fetch("/api/scorers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year, page: targetPage, pageSize }),
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
  return { scorers: data.scorers || [] };
}

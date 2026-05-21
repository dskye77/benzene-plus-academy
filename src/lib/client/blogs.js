/**
 * Fetches all published blog posts from the /api/blogs endpoint.
 * Returns an array of posts (status === "Published").
 * @returns {Promise<Array>} Array of published blog post objects
 */
export async function fetchPublishedBlogs() {
  const res = await fetch("/api/blogs", {
    method: "GET",
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error || "Failed to fetch published blog posts");
  }

  const data = await res.json();
  return Array.isArray(data.posts) ? data.posts : [];
}

/**
 * Fetches a single blog post by slug from the /api/blogs/[slug] endpoint.
 * @param {string} slug - The slug of the blog post to fetch.
 * @returns {Promise<Object|null>} The blog post object, or null if not found.
 */
export async function fetchBlogPost(slug) {
  if (!slug) return null;
  const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}`, {
    method: "GET",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error || "Failed to fetch blog post");
  }

  const data = await res.json();
  return data?.post || null;
}

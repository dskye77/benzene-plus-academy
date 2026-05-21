export async function fetchScorers() {
  const res = await fetch("/api/admin/scorers");
  if (!res.ok) throw new Error("Failed to fetch scorers");
  return res.json();
}

export async function uploadScorer(scorer) {
  const res = await fetch("/api/admin/scorers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scorer),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to upload scorer");
  }
  return res.json();
}

/**
 * Deletes a scorer and, if the scorer has a Cloudinary image, deletes the image too.
 * @param {string} scorerId - The ID of the scorer to delete.
 * @param {string} [imagePublicId] - Optional: The public_id for the Cloudinary image.
 */
export async function deleteScorer(scorerId, imagePublicId) {
  // 1. Delete scorer from backend
  const res = await fetch(`/api/admin/scorers/${scorerId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to delete scorer");
  }

  // 2. Delete image from Cloudinary (non-blocking — correct endpoint)
  if (imagePublicId) {
    try {
      const cloudinaryRes = await fetch("/api/admin/deleteImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: imagePublicId }),
      });
      if (!cloudinaryRes.ok) {
        console.error("Failed to delete image from Cloudinary");
      }
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  }
}

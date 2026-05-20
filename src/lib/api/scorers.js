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
  if (!res.ok) throw new Error("Failed to upload scorer");
  return res.json();
}

/**
 * Deletes a scorer and, if the scorer has a Cloudinary image, deletes the image from Cloudinary too.
 * @param {string} scorerId - The ID of the scorer to delete.
 * @param {string} [imagePublicId] - Optional: The public_id for the Cloudinary image to delete.
 */
export async function deleteScorer(scorerId, imagePublicId) {
  // 1. Delete scorer from backend
  const res = await fetch(`/api/admin/scorers/${scorerId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete scorer");

  if (imagePublicId) {
    try {
      const cloudinaryRes = await fetch(`/api/admin/imageDelete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: imagePublicId }),
      });
      if (!cloudinaryRes.ok) {
        // Optional: Logging or reporting error, but do not block scorer deletion on image failure
        console.error("Failed to delete image from Cloudinary");
      }
    } catch (error) {
      // Optional: Logging or reporting error, but do not block scorer deletion on image failure
      console.error("Error deleting image from Cloudinary:", error);
    }
  }
}

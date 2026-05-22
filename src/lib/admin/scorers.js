import { uploadImageViaApi } from "./image";
// Use the dedicated upload API route for image uploads via multipart (see @file_context_0)
export async function fetchScorers() {
  const res = await fetch("/api/admin/scorers");
  if (!res.ok) throw new Error("Failed to fetch scorers");
  return res.json();
}

export async function addScorer(scorer) {
  try {
    const imageFile = scorer?.selectedImageFile;
    let imageUrl = "";
    let publicId = "";

    if (imageFile) {
      const uploadResult = await uploadImageViaApi(imageFile, {
        folder: "benzene-plus-academy/scorers",
      });
      imageUrl = uploadResult?.data?.secureUrl || "";
      publicId = uploadResult?.data?.publicId || "";
    }
    // Remove selectedImageFile before sending to backend
    const { selectedImageFile, ...scorerData } = scorer || {};

    const res = await fetch("/api/admin/scorers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...scorerData,
        image: imageUrl,
        imagePublicId: publicId,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Failed to upload scorer");
    }
    return res.json();
  } catch (error) {
    throw new Error(error.message || "Failed to upload scorer");
  }
}

/**
 * Update a scorer. Optionally handle new image upload.
 * Uses PATCH (not PUT) per backend implementation in route.js.
 * @param {string} scorerId - The ID of the scorer to update.
 * @param {object} scorer - The scorer data (may include selectedImageFile).
 */
export async function updateScorer(scorerId, scorer) {
  try {
    const imageFile = scorer?.selectedImageFile;
    let imageUrl = scorer?.image || "";
    let publicId = scorer?.imagePublicId || "";

    // If a new image is selected, upload it to the same path/publicId as the old one (if any) to overwrite
    if (imageFile) {
      const publicIdToUse = publicId || undefined;
      const uploadResult = await uploadImageViaApi(imageFile, {
        folder: "benzene-plus-academy/scorers",
        publicId: publicIdToUse,
      });
      imageUrl = uploadResult?.data?.secureUrl || "";
      publicId = uploadResult?.data?.publicId || "";
    }

    // Remove selectedImageFile before sending to backend
    const { selectedImageFile, ...scorerData } = scorer || {};

    const res = await fetch(`/api/admin/scorers/${scorerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...scorerData,
        image: imageUrl,
        imagePublicId: publicId,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Failed to update scorer");
    }
    return res.json();
  } catch (error) {
    throw new Error(error.message || "Failed to update scorer");
  }
}

/**
 * Deletes a scorer and, if the scorer has a Cloudinary image, deletes the image too.
 * @param {string} scorerId - The ID of the scorer to delete.
 * @param {string} [imagePublicId] - Optional: The publicId for the Cloudinary image.
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
      const result = await cloudinaryRes.json().catch(() => ({}));
      if (!cloudinaryRes.ok || !result?.success) {
        console.error("Failed to delete image from Cloudinary");
      }
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  }
}

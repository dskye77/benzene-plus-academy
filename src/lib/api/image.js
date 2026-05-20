/**
 * Upload an image file to the admin upload API.
 *
 * @param {File|Blob} file - The file to upload (from an <input type="file"> or drop event).
 * @param {Object} options - Optional. { folder?: string, publicId?: string }
 * @returns {Promise<Object>} - Resolves with the API result { success, data } or throws on error.
 */
export async function uploadImage(file, options = {}) {
  const { folder, publicId } = options;
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);
  if (publicId) formData.append("publicId", publicId);

  const response = await fetch("/api/admin/uploadImage", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err?.error
        ? `${err.error}${err.details ? ": " + err.details : ""}`
        : `Upload failed (${response.status})`,
    );
  }

  return await response.json();
}

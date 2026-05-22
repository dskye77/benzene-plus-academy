// Helper to upload image file via /api/admin/uploadImage (see @file_context_0)
export async function uploadImageViaApi(imageFile, opts = {}) {
  const formData = new FormData();
  formData.append("file", imageFile);
  if (opts.folder) formData.append("folder", opts.folder);
  if (opts.publicId) formData.append("publicId", opts.publicId);

  const res = await fetch("/api/admin/uploadImage", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorPayload = await res.json().catch(() => ({}));
    throw new Error(errorPayload?.error || "Failed to upload image");
  }
  return res.json();
}

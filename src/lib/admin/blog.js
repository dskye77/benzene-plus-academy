import { uploadImageViaApi } from "./image";

/**
 * Creates a new blog post via the admin blog POST API, with optional image upload.
 * @param {Object} data - The blog post data (may include selectedImageFile for image).
 * @returns {Promise<{id: string}|{error: string, status: number}>}
 */
export async function createBlog(data) {
  try {
    const imageFile = data?.selectedImageFile;
    let imageUrl = "";
    let publicId = "";

    if (imageFile) {
      const uploadResult = await uploadImageViaApi(imageFile, {
        folder: "benzene-plus-academy/blog",
      });
      imageUrl = uploadResult?.data?.secureUrl || "";
      publicId = uploadResult?.data?.publicId || "";
    }

    // Remove selectedImageFile before sending to backend
    const { selectedImageFile, ...blogData } = data || {};

    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...blogData,
        image: imageUrl,
        imagePublicId: publicId,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || "Failed to add post", status: res.status };
    }
    return json; // { id }
  } catch (error) {
    return { error: error?.message || "Failed to add post", status: 500 };
  }
}

/**
 * Updates an existing blog post via the admin blog PATCH API, optionally handling image upload.
 * @param {string} slug - The slug of the blog post to update.
 * @param {Object} data - The updated blog post data (may include selectedImageFile).
 * @returns {Promise<{success: boolean}|{error: string, status: number}>}
 */
export async function updateBlog(slug, data) {
  try {
    const imageFile = data?.selectedImageFile;
    let imageUrl = data?.image || "";
    let publicId = data?.imagePublicId || "";

    // If a new image is selected, upload it (optionally overwrite by publicId)
    if (imageFile) {
      const publicIdToUse = publicId || undefined;
      const uploadResult = await uploadImageViaApi(imageFile, {
        folder: "benzene-plus-academy/blog",
        publicId: publicIdToUse,
      });
      imageUrl = uploadResult?.data?.secureUrl || "";
      publicId = uploadResult?.data?.publicId || "";
    }

    // Remove selectedImageFile before sending to backend
    const { selectedImageFile, ...blogData } = data || {};

    const res = await fetch(`/api/admin/blog/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...blogData,
        image: imageUrl,
        imagePublicId: publicId,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || "Failed to update post", status: res.status };
    }
    return json; // { success: true }
  } catch (error) {
    return { error: error?.message || "Failed to update post", status: 500 };
  }
}

/**
 * Deletes a blog post (and optionally its image, if imagePublicId provided).
 * @param {string} slug - The slug of the blog post to delete.
 * @param {string} [imagePublicId] - Optional image publicId to also delete.
 * @returns {Promise<{success: boolean}|{error: string, status: number}>}
 */
export async function deleteBlog(slug, imagePublicId) {
  try {
    // 1. Delete the blog post (backend)
    const res = await fetch(`/api/admin/blog/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: json.error || "Failed to delete post", status: res.status };
    }

    // 2. Optionally, delete image from Cloudinary
    if (imagePublicId) {
      try {
        const cloudinaryRes = await fetch("/api/admin/deleteImage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: imagePublicId }),
        });
        if (!cloudinaryRes.ok) {
          // Don't block post deletion on Cloudinary error
          console.error("Failed to delete image from Cloudinary");
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    return json;
  } catch (error) {
    return { error: error?.message || "Failed to delete post", status: 500 };
  }
}

/**
 * Fetches all blog posts (admin only, includes drafts).
 * @returns {Promise<{posts: Array}|{error: string, status: number}>}
 */
export async function getBlogs() {
  const res = await fetch("/api/admin/blog", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();

  return json.posts;
}

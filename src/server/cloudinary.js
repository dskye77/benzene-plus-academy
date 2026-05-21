import { v2 as cloudinary } from "cloudinary";

// ─── Configuration ────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Upload an image from a local file path or a remote URL.
 *
 * @example
 * const result = await uploadImage("./photo.jpg", { folder: "products" });
 * const result = await uploadImage("https://example.com/img.png", { folder: "avatars" });
 */
export async function uploadImage(source, options) {
  const {
    folder,
    publicId,
    allowedFormats,
    maxBytes,
    transformation,
    ...rest
  } = options || {};

  const response = await cloudinary.uploader.upload(source, {
    ...(publicId ? { public_id: publicId } : { folder }),
    ...(allowedFormats && { allowed_formats: allowedFormats }),
    ...(maxBytes && { max_bytes: maxBytes }),
    ...(transformation && { transformation }),
    resource_type: "image",
    overwrite: true,
    ...rest,
  });

  return mapResponse(response);
}

/**
 * Upload an image from a Base64-encoded data URI.
 *
 * @example
 * const result = await uploadBase64Image(
 *   "data:image/png;base64,iVBORw0KGgo...",
 *   { folder: "thumbnails" }
 * );
 */
export async function uploadBase64Image(dataUri, options) {
  return uploadImage(dataUri, options);
}

/**
 * Upload a raw Buffer (e.g. from a multipart form or Node stream).
 *
 * @example
 * const result = await uploadBuffer(req.file.buffer, { folder: "uploads" });
 */
export async function uploadBuffer(buffer, options) {
  const {
    folder,
    publicId,
    allowedFormats,
    maxBytes,
    transformation,
    ...rest
  } = options || {};

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        ...(publicId ? { public_id: publicId } : { folder }),
        ...(publicId && { overwrite: true }),
        ...(allowedFormats && { allowed_formats: allowedFormats }),
        ...(maxBytes && { max_bytes: maxBytes }),
        ...(transformation && { transformation }),
        resource_type: "image",
        ...rest,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Upload failed"));
        }
        resolve(mapResponse(result));
      },
    );

    stream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by its public ID.
 *
 * @example
 * await deleteImage("products/my-photo");
 */
export async function deleteImage(publicId) {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Failed to delete image "${publicId}": ${result.result}`);
  }
}

/**
 * Force delete folder + all contents (handles large folders better)
 */
export async function deleteFolderForce(folderPath) {
  try {
    const cleanPath = folderPath.trim().replace(/^\/+|\/+$/g, "");

    // Delete all resources by prefix
    await cloudinary.api.delete_resources_by_prefix(cleanPath, {
      resource_type: "image",
    });

    // Also delete other resource types if needed
    await cloudinary.api.delete_resources_by_prefix(cleanPath, {
      resource_type: "video",
    });

    // Delete the folder
    await cloudinary.api.delete_folder(cleanPath);

    console.log(`✅ Force deleted folder: ${cleanPath}`);
  } catch (error) {
    console.error("Force delete failed:", error);
    throw error;
  }
}

/**
 * Generate a signed URL for a private image that expires after `expiresInSeconds`.
 *
 * @example
 * const url = getSignedUrl("private-folder/secret.jpg", 3600);
 */
export function getSignedUrl(publicId, expiresInSeconds = 3600) {
  return cloudinary.url(publicId, {
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
    secure: true,
  });
}

// ─── Internal ─────────────────────────────────────────────────────────────────
function mapResponse(r) {
  return {
    publicId: r.public_id,
    url: r.url,
    secureUrl: r.secure_url,
    folder: typeof r.folder !== "undefined" ? r.folder : "",
    format: r.format,
    width: r.width,
    height: r.height,
    bytes: r.bytes,
    createdAt: r.created_at,
    assetId: r.asset_id,
  };
}

export default cloudinary;

import { admin } from "@/server/firebaseAdmin";

const COLLECTION = "posts";

/**
 * Get all blog posts (admin view — includes drafts).
 */
export async function getAllPosts() {
  const snapshot = await admin
    .firestore()
    .collection(COLLECTION)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get all published posts ordered by publishedAt desc (public view).
 */
export async function getPublishedPosts() {
  const snapshot = await admin
    .firestore()
    .collection(COLLECTION)
    .where("status", "==", "published")
    .orderBy("publishedAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get a single post by slug (public view — must be published).
 * Optimized: Uses direct document lookup instead of a query.
 */
export async function getPostBySlug(slug) {
  const doc = await admin.firestore().collection(COLLECTION).doc(slug).get();

  if (!doc.exists) return null;

  const data = doc.data();

  // Enforce public view rule: must be published
  if (data.status !== "published") return null;

  return { id: doc.id, ...data };
}

/**
 * Add a new post using the slug as the document ID.
 */
export async function addPost(data) {
  if (!data.slug) {
    throw new Error(
      "Cannot create a post without a slug when using slug-as-ID.",
    );
  }

  const now = admin.firestore.FieldValue.serverTimestamp();

  await admin
    .firestore()
    .collection(COLLECTION)
    .doc(data.slug)
    .set({
      ...data,
      createdAt: now,
      updatedAt: now,
      publishedAt: data.status === "published" ? now : null,
    });

  return data.slug;
}

/**
 * Update a post by id (slug).
 * Handles the edge case where the slug itself is being changed.
 */
export async function updatePost(id, data) {
  const db = admin.firestore();
  const collectionRef = db.collection(COLLECTION);
  const now = admin.firestore.FieldValue.serverTimestamp();

  const existingDoc = await collectionRef.doc(id).get();
  if (!existingDoc.exists) throw new Error("Post not found");

  const existingData = existingDoc.data();
  const wasPublished = existingData.status === "published";

  const update = {
    ...data,
    updatedAt: now,
  };

  // Set publishedAt only on first publish
  if (data.status === "published" && !wasPublished) {
    update.publishedAt = now;
  }

  // CRITICAL: Handle slug modification
  // Since Firestore document IDs are immutable, changing a slug requires a write + delete.
  if (data.slug && data.slug !== id) {
    const batch = db.batch();
    const newDocRef = collectionRef.doc(data.slug);
    const oldDocRef = collectionRef.doc(id);

    const finalData = {
      ...existingData,
      ...update,
    };

    batch.set(newDocRef, finalData);
    batch.delete(oldDocRef);

    await batch.commit();
  } else {
    // Normal in-place update if slug didn't change
    await collectionRef.doc(id).update(update);
  }
}

/**
 * Delete a post by id (slug).
 */
export async function deletePost(id) {
  await admin.firestore().collection(COLLECTION).doc(id).delete();
}

/**
 * Slug uniqueness check — Optimized for direct ID lookup.
 */
export async function isSlugTaken(slug) {
  const doc = await admin.firestore().collection(COLLECTION).doc(slug).get();
  return doc.exists;
}

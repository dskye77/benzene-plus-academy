import { isUserAdmin, deleteScorer as adminDeleteScorer } from "@/server/firestoreAdmin";
import { getUserFromSession } from "@/server/getUserSession";

/**
 * Next.js 13+ dynamic route API handler for deleting a scorer by ID (admin only).
 * Fixes: 'params' is a Promise and must be unwrapped with 'await'.
 */
export async function DELETE(request, context) {
  try {
    const user = await getUserFromSession();
    if (!user || !user.uid) {
      return Response.json(
        { error: "Unauthorized: Invalid or missing user" },
        { status: 401 }
      );
    }

    const isAdmin = await isUserAdmin(user.uid);
    if (!isAdmin) {
      return Response.json(
        { error: "Unauthorized: Admins only" },
        { status: 401 }
      );
    }

    // In Next.js 13+ route handlers, context.params may be a Promise
    // See: https://nextjs.org/docs/messages/sync-dynamic-apis
    const params = context?.params && typeof context.params.then === "function"
      ? await context.params
      : context?.params;

    const { id } = params || {};
    if (!id) {
      return Response.json(
        { error: "Missing scorer ID" },
        { status: 400 }
      );
    }

    await adminDeleteScorer(id);
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Failed to delete scorer", details: error?.message },
      { status: 500 }
    );
  }
}
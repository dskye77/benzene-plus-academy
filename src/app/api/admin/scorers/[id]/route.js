import { isUserAdmin } from "@/server/firestoreAdmin";
import { deleteScorer, updateScorer } from "@/server/firestoreAdminScorer";
import { getUserFromSession } from "@/server/getUserSession";

async function resolveParams(context) {
  return context?.params && typeof context.params.then === "function"
    ? await context.params
    : context?.params;
}

/**
 * DELETE /api/admin/scorers/[id]
 */
export async function DELETE(request, context) {
  try {
    const user = await getUserFromSession();
    if (!user?.uid) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await isUserAdmin(user.uid))) {
      return Response.json({ error: "Admins only" }, { status: 403 });
    }

    const { id } = (await resolveParams(context)) || {};
    if (!id) {
      return Response.json({ error: "Missing scorer ID" }, { status: 400 });
    }

    await deleteScorer(id);
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Failed to delete scorer", details: error?.message },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/scorers/[id]
 * Accepts a partial scorer object and merges it into the Firestore document.
 */
export async function PATCH(request, context) {
  try {
    const user = await getUserFromSession();
    if (!user?.uid) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await isUserAdmin(user.uid))) {
      return Response.json({ error: "Admins only" }, { status: 403 });
    }

    const { id } = (await resolveParams(context)) || {};
    if (!id) {
      return Response.json({ error: "Missing scorer ID" }, { status: 400 });
    }

    const body = await request.json();
    // Only allow safe fields to be updated
    const allowed = [
      "name",
      "exam",
      "score",
      "year",
      "note",
      "image",
      "imagePublicId",
    ];
    const updates = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    await updateScorer(id, updates);
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Failed to update scorer", details: error?.message },
      { status: 500 },
    );
  }
}

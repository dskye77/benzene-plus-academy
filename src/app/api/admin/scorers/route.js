import { getAllScorers, isUserAdmin, addScorer } from "@/server/firestoreAdmin";
import { getUserFromSession } from "@/server/getUserSession";

// GET: Fetches all scorers
export async function GET(request) {
  try {
    const scorers = await getAllScorers();
    return Response.json(scorers, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch scorers", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromSession()

    if (!user || !user.uid) {
      return Response.json(
        { error: "Unauthorized: Invalid or missing user" },
        { status: 401 },
      );
    }

    const isAdmin = await isUserAdmin(user.uid);
    if (!isAdmin) {
      return Response.json(
        { error: "Unauthorized: Admins only" },
        { status: 401 },
      );
    }

    const data = await request.json();
    if (!data || !data.name || !data.exam || !data.score || !data.year) {
      return Response.json(
        { error: "Missing required scorer fields" },
        { status: 400 },
      );
    }
    const id = await addScorer(data);
    return Response.json({ id }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Failed to add scorer", details: error.message },
      { status: 500 },
    );
  }
}

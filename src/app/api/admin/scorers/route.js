import { isUserAdmin } from "@/server/firestoreAdmin";

import { getAllScorers, addScorer } from "@/server/firestoreAdminScorer";
import { getUserFromSession } from "@/server/getUserSession";

// Helper to generat ID from name, exam, and year
function generateScorerId({ name, exam, year }) {
  // Only allow alphanumerics, dash and underscore, lowercase
  const safe = (str) =>
    String(str)
      .toLowerCase()
      .replace(/[^a-z0-9\-_]+/g, "-")
      .replace(/(^\-+|\-+$)/g, "");
  return `${safe(name)}-${safe(exam)}-${safe(year)}`;
}

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
    const user = await getUserFromSession();

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
    // Generate ID from name, exam, year
    const generatedId = generateScorerId({
      name: data.name,
      exam: data.exam,
      year: data.year,
    });

    // Add the generated id to the data object
    const scorerDataWithId = { ...data, id: generatedId };

    const id = await addScorer(scorerDataWithId, generatedId);
    return Response.json({ id }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Failed to add scorer", details: error.message },
      { status: 500 },
    );
  }
}

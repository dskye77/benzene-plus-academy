import { fetchScorer } from "@/server/firestoreAdminScorer";

export async function GET(request, context) {
  console.log("res")

  const { params } = (context || {});
  const awaitedParams = await params;
  const { id } = awaitedParams || {};
  if (!id) {
    return Response.json(
      { error: "Missing scorer ID in request" },
      { status: 400 },
    );
  }

  try {
    const scorer = await fetchScorer(id);

    if (!scorer) {
      return Response.json({ error: "Scorer not found" }, { status: 404 });
    }

    return Response.json({ scorer }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch scorer", details: error.message },
      { status: 500 },
    );
  }
}

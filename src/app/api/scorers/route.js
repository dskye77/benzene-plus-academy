import { fetchScorers } from "@/lib/firestore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    const year = searchParams.get("year");
    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : undefined;
    const pageSize = searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : undefined;

    if (!year) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Fetch all scorers for the given year
    const allScorers = await fetchScorers(year);

    // Support pagination if requested
    let pagedScorers = allScorers;
    if (
      typeof page === "number" &&
      page > 0 &&
      typeof pageSize === "number" &&
      pageSize > 0
    ) {
      const startIdx = (page - 1) * pageSize;
      pagedScorers = allScorers.slice(startIdx, startIdx + pageSize);
    }

    return Response.json(
      {
        scorers: pagedScorers,
        total: allScorers.length,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch scorers", details: error.message },
      { status: 500 },
    );
  }
}

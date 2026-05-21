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
    const minScore = searchParams.get("minScore");

    if (!year) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Fetch all scorers for the given year
    let allScorers = await fetchScorers(year);

    // Automatically sort by score from highest to lowest
    allScorers = allScorers.slice().sort((a, b) => {
      const scoreA = typeof a.score === "number" ? a.score : -Infinity;
      const scoreB = typeof b.score === "number" ? b.score : -Infinity;
      return scoreB - scoreA;
    });
    
    // Filter out scorers that do not meet the minScore requirement if specified
    let filteredScorers = allScorers;
    if (minScore !== null && minScore !== undefined && minScore !== "") {
      const minNum = Number(minScore);
      if (!isNaN(minNum)) {
        filteredScorers = allScorers.filter(
          (scorer) => typeof scorer.score === "number" && scorer.score > minNum,
        );
      }
    } else {
      filteredScorers = allScorers;
    }
    allScorers = filteredScorers;

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

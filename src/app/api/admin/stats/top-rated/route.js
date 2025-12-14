import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit")) || 10;
  const MIN_REVIEWS = 5;

  try {
    const topRated = await prisma.movie.findMany({
      take: limit,
      where: {
        vote_count: { gte: MIN_REVIEWS },
      },
      orderBy: {
        vote_average: "desc",
      },
      select: {
        id: true,
        title: true,
        vote_average: true,
        vote_count: true,
      },
    });

    const formattedData = topRated.map((m) => ({
      id: m.id,
      title: m.title,
      avgRating: parseFloat(m.vote_average?.toFixed(2) || 0),
      reviewCount: m.vote_count,
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch top rated movies" },
      { status: 500 }
    );
  }
}

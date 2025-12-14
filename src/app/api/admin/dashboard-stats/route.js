import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalFilms = await prisma.movie.count({
      where: {
        is_visible: true,
      },
    });
    const totalUsers = await prisma.user.count();

    const adminUsers = await prisma.user.count({
      where: {
        role: "ADMIN",
      },
    });

    // const local_reviewStats = await prisma.comment.aggregate({
    //   where: {
    //     rating: { not: null },
    //   },
    //   _count: {
    //     rating: true,
    //   },
    //   _avg: {
    //     rating: true,
    //   },
    // });

    const total_movies = await prisma.movie.aggregate({
      _sum: {
        vote_average: true,
      },
      _count: {
        vote_average: true,
      },
      _avg: {
        vote_average: true,
      },
    });

    const total_reviews = await prisma.movie.aggregate({
      _sum: {
        vote_count: true,
      },
      _count: {
        vote_count: true,
      },
      _avg: {
        vote_count: true,
      },
    });

    const totalReviews = total_reviews._sum.vote_count || 0;
    const avgRating = total_movies._sum.vote_average
      ? parseFloat(total_movies._avg.vote_average.toFixed(1))
      : 0;

    // const totalLocalReviews = local_reviewStats._count.rating || 0;
    // const localAvgRating = local_reviewStats._sum.rating
    //   ? parseFloat(local_reviewStats._avg.rating.toFixed(1))
    //   : 0;

    const stats = {
      totalFilms,
      totalUsers,
      totalReviews,
      // totalLocalReviews,
      adminUsers,
      avgRating,
      // localAvgRating,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/ratings
 * Create or update (upsert) a user's rating for a movie.
 * Uses the Rating model with a unique compound key (user_id_movie_id).
 *
 * @param {Request} request - Incoming request with { movie_id, user_id, rating }
 * @returns {NextResponse} - JSON response with success status
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { movie_id, user_id, rating } = body;

    // Validation
    if (!movie_id || !user_id || !rating) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Movie ID, User ID and rating are required" 
        },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Rating must be between 1 and 5" 
        },
        { status: 400 }
      );
    }

    // Upsert rating: create if not exists, update if exists
    const user_id_movie_id = `${user_id}_${movie_id}`;
    await prisma.rating.upsert({
      where: { user_id_movie_id },
      update: {
        rating: parseInt(rating),
        updated_at: new Date()
      },
      create: {
        user_id,
        movie_id,
        user_id_movie_id,
        rating: parseInt(rating)
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Rating submitted successfully",
        rating: parseInt(rating)
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Rating submission error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to submit rating" 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ratings
 * Fetch ratings filtered by movie_id and/or user_id.
 *
 * Query params:
 *   - movie_id: Filter by movie
 *   - user_id: Filter by user
 *
 * @param {Request} request - Incoming request
 * @returns {NextResponse} - JSON response with ratings array
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const movie_id = searchParams.get('movie_id');
    const user_id = searchParams.get('user_id');

    let whereClause = {};
    if (movie_id) whereClause.movie_id = movie_id;
    if (user_id) whereClause.user_id = user_id;

    const ratings = await prisma.rating.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        ratings: ratings 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ratings error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch ratings" 
      },
      { status: 500 }
    );
  }
}

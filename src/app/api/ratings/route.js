import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    // Utiliser Prisma pour upsert la note
    const user_id_movie_id = `${user_id}_${movie_id}`;
    const result = await prisma.rating.upsert({
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
        rating: rating 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(" Rating error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to submit rating" 
      },
      { status: 500 }
    );
  }
}

// Optionnel: GET pour récupérer les ratings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const movie_id = searchParams.get('movie_id');
    const user_id = searchParams.get('user_id');

    let where = {};
    if (movie_id) where.movie_id = movie_id;
    if (user_id) where.user_id = user_id;

    const ratings = await prisma.rating.findMany({
      where,
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
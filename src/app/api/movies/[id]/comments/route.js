import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuthUser } from '@/lib/auth';

/**
 * GET /api/movies/[id]/comments
 * Get all the comments of a movie with pagination
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Verify if movie exists
    const movie = await prisma.movie.findUnique({
      where: { id }
    });

    if (!movie) {
      return NextResponse.json(
        { success: false, message: 'Movie not found' },
        { status: 404 }
      );
    }

    // Retrieve the comments with pagination
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          movie_id: id,
          parent_id: null // Only the main components
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              image: true
            }
          }
        }
      }),
      prisma.comment.count({
        where: {
          movie_id: id,
          parent_id: null
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        comments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/movies/[id]/comments
 * Create a new comment for a movie
 */
export async function POST(request, { params }) {
  try {
    const decoded = await requireAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    const { content, rating } = body;

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify that the film exists
    const movie = await prisma.movie.findUnique({
      where: { id }
    });

    if (!movie) {
      return NextResponse.json(
        { success: false, message: 'Movie not found' },
        { status: 404 }
      );
    }

    // Verify if user has already commented the movie
    const existingComment = await prisma.comment.findFirst({
      where: {
        user_id: decoded.id,
        movie_id: id,
        parent_id: null
      }
    });

    if (existingComment) {
      return NextResponse.json(
        { success: false, message: 'You already reviewed this movie. Please update your existing review.' },
        { status: 409 }
      );
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        rating: rating || null,
        user_id: decoded.id,
        movie_id: id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: comment
    }, { status: 201 });

  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
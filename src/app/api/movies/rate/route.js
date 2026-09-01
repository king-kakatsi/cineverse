/**
 * @deprecated This endpoint writes to the movie.rates JSON field which is deprecated.
 * Use POST /api/ratings instead, which writes to the Rating model.
 *
 * This file is kept for backward compatibility only. New code should use /api/ratings.
 */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { movie_id, user_id, rating } = await request.json();

    if (!movie_id || !user_id || !rating) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movie_id },
      select: { rates: true }
    });

    if (!movie) {
      return NextResponse.json(
        { success: false, error: 'Movie not found' },
        { status: 404 }
      );
    }

    const currentRates = movie.rates || {};
    const updatedRates = {
      ...currentRates,
      [user_id]: rating
    };

    await prisma.movie.update({
      where: { id: movie_id },
      data: { rates: updatedRates }
    });

    // DEPRECATED: Also upsert into Rating model for forward compatibility
    try {
      const uniqueKey = `${user_id}_${movie_id}`;
      await prisma.rating.upsert({
        where: { user_id_movie_id: uniqueKey },
        update: { rating: parseInt(rating), updated_at: new Date() },
        create: { user_id, movie_id, user_id_movie_id: uniqueKey, rating: parseInt(rating) }
      });
    } catch (ratingSyncError) {
      console.warn('Failed to sync rating to Rating model:', ratingSyncError.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        movie_id,
        user_id,
        rating,
        rates: updatedRates
      }
    });

  } catch (error) {
    console.error('Error submitting rating (deprecated endpoint):', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const movie_id = searchParams.get('movie_id');
    const user_id = searchParams.get('user_id');

    if (!movie_id) {
      return NextResponse.json(
        { success: false, error: 'movie_id required' },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movie_id },
      select: { rates: true }
    });

    if (!movie) {
      return NextResponse.json(
        { success: false, error: 'Movie not found' },
        { status: 404 }
      );
    }

    const rates = movie.rates || {};

    if (user_id) {
      const userRating = rates[user_id] || null;
      return NextResponse.json({
        success: true,
        data: {
          user_id,
          rating: userRating
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: { rates }
    });

  } catch (error) {
    console.error('Error fetching rating (deprecated endpoint):', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rating' },
      { status: 500 }
    );
  }
}

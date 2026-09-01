import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Fetch aggregated ratings for an array of movie IDs from the Rating model.
 * Returns a map: { movieId: { average: number, count: number } }
 */
async function getAggregatedRatings(movieIds) {
  if (!movieIds || movieIds.length === 0) return {};

  const ratings = await prisma.rating.findMany({
    where: { movie_id: { in: movieIds } },
    select: { movie_id: true, rating: true }
  });

  const ratingsByMovie = {};
  for (const singleRating of ratings) {
    if (!ratingsByMovie[singleRating.movie_id]) {
      ratingsByMovie[singleRating.movie_id] = { sum: 0, count: 0 };
    }
    ratingsByMovie[singleRating.movie_id].sum += singleRating.rating;
    ratingsByMovie[singleRating.movie_id].count += 1;
  }

  const result = {};
  for (const [movieId, data] of Object.entries(ratingsByMovie)) {
    result[movieId] = {
      average: parseFloat((data.sum / data.count).toFixed(1)),
      count: data.count
    };
  }
  return result;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const genre = searchParams.get('genre');
    const director = searchParams.get('director');
    const year = searchParams.get('year');
    const sort = searchParams.get('sort') || 'created_at';
    const search = searchParams.get('search') || '';

    const where = {
      is_visible: true
    };

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive'
      };
    }
    if (genre && genre !== 'null') {
      where.genreIds = {
        has: genre
      };
    }

    if (year && year !== 'null') {
      where.release_date = {
        contains: year.toString()
      };
    }

    if (director && director !== 'null') {
      where.director_id = director;
    }

    let orderBy = {};
    switch (sort) {
      case 'popularity':
        orderBy = { popularity: 'desc' };
        break;
      case 'rating':
        orderBy = { vote_average: 'desc' };
        break;
      case 'date':
        orderBy = { release_date: 'desc' };
        break;
      case 'title':
        orderBy = { title: 'asc' };
        break;
      case 'created_at': 
        orderBy = { created_at: 'desc' };
        break;
      default:
        orderBy = { created_at: 'desc' }; 
    }

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        include: {
          genres: true
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.movie.count({ where })
    ]);

    const directorIds = [...new Set(
      movies
        .filter((movie) => movie.director_id)
        .map((movie) => movie.director_id)
    )];

    const directors = directorIds.length > 0 
      ? await prisma.person.findMany({
          where: {
            id: { in: directorIds }
          },
          select: {
            id: true,
            tmdb_id: true,
            name: true,
            profile_path: true
          }
        })
      : [];

    const directorMap = new Map(
      directors.map((director) => [director.id, director])
    );

    // Fetch aggregated ratings from Rating model for all movies in this page
    const allMovieIds = movies.map((movie) => movie.id);
    const ratingsMap = await getAggregatedRatings(allMovieIds);

    const enrichedMovies = movies.map(movie => {
      const ratingData = ratingsMap[movie.id];
      return {
        ...movie,
        director: movie.director_id 
          ? directorMap.get(movie.director_id) || null
          : null,
        userRatingsAvg: ratingData ? ratingData.average : null,
        userRatingsCount: ratingData ? ratingData.count : 0
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        movies: enrichedMovies,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch movies',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { tmdb_id } = await request.json();
    
    if (!tmdb_id) {
      return NextResponse.json(
        { success: false, message: 'tmdb_id required' },
        { status: 400 }
      );
    }
    
    const result = await syncMovie(tmdb_id);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result.movie
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

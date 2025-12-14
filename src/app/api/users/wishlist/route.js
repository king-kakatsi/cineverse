import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuthUser } from '@/lib/auth';
// import { verifyToken } from '@/lib/auth';

/**
 * GET /api/users/wishlist
 * Get user's wishlist movies with pagination
 */
export async function GET(request) {
  try {
    // const token = request.headers.get('authorization')?.split(' ')[1];
    // if (!token) {
    //   return NextResponse.json(
    //     { success: false, message: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // const decoded = verifyToken(token);
    const decoded = await requireAuthUser(request);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Get user with wishlist
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { wishList: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get movies in wishlist with pagination
    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where: {
          id: { in: user.wishList }
        },
        skip,
        take: limit,
        include: {
          genres: true
        }
      }),
      prisma.movie.count({
        where: {
          id: { in: user.wishList }
        }
      })
    ]);

    // Batch fetch persons
    const personIds = new Set();
    
    movies.forEach(movie => {
      if (movie.director_id) {
        personIds.add(movie.director_id);
      }
      
      if (movie.cast && Array.isArray(movie.cast)) {
        movie.cast.forEach(castMember => {
          if (castMember.person_id) {
            personIds.add(castMember.person_id);
          }
        });
      }
    });

    const persons = await prisma.person.findMany({
      where: {
        id: { in: Array.from(personIds) }
      }
    });

    const personMap = {};
    persons.forEach(person => {
      personMap[person.id] = person;
    });

    // Populate movies
    movies.forEach(movie => {
      if (movie.director_id) {
        movie.director = personMap[movie.director_id] || null;
      }
      
      if (movie.cast && Array.isArray(movie.cast)) {
        movie.cast = movie.cast.map(castMember => ({
          person: personMap[castMember.person_id] || null,
          character: castMember.character
        }));
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        movies,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users/wishlist
 * Add movie to wishlist
 */
export async function POST(request) {
  try {
    // const token = request.headers.get('authorization')?.split(' ')[1];
    // if (!token) {
    //   return NextResponse.json(
    //     { success: false, message: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const decoded = await requireAuthUser(request);
    const { movieId } = await request.json();

    if (!movieId) {
      return NextResponse.json(
        { success: false, message: 'movieId required' },
        { status: 400 }
      );
    }

    // Check if movie exists
    const movie = await prisma.movie.findUnique({
      where: { id: movieId }
    });

    if (!movie) {
      return NextResponse.json(
        { success: false, message: 'Movie not found' },
        { status: 404 }
      );
    }

    // Get current wishlist
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { wishList: true }
    });

    // Check if already in wishlist
    if (user.wishList.includes(movieId)) {
      return NextResponse.json(
        { success: false, message: 'Already in wishlist' },
        { status: 409 }
      );
    }

    // Add to wishlist
    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        wishList: {
          push: movieId
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Added to wishlist'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
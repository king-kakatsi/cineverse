// /app/api/movies/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        genres: true,
        comments: {
          take: 10,
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!movie) {
      return NextResponse.json(
        { success: false, message: 'Movie not found' },
        { status: 404 }
      );
    }

    const personIds = new Set();

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

    const persons = await prisma.person.findMany({
      where: {
        id: { in: Array.from(personIds) }
      }
    });

    // Map lookup
    const personMap = {};
    persons.forEach(person => {
      personMap[person.id] = person;
    });

    // Populate
    if (movie.director_id) {
      movie.director = personMap[movie.director_id] || null;
    }

    if (movie.cast && Array.isArray(movie.cast)) {
      movie.cast = movie.cast.map(castMember => ({
        person: personMap[castMember.person_id] || null,
        character: castMember.character
      }));
    }

    return NextResponse.json({
      success: true,
      data: movie
    });

  } catch (error) {
    console.error('GET /api/movies/[id] error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params; 
  const decoded = requireAdminUser(request); // will throw exception if user isn't admin
  
  try {
    const body = await request.json();

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: body
    });

    return NextResponse.json({
      success: true,
      data: updatedMovie
    });
  } catch (error) {
    console.error('PUT /api/movies/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update movie' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.movie.update({
      where: { id },
      data: { is_visible: false } // Soft delete
    });

    return NextResponse.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/movies/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete movie' },
      { status: 500 }
    );
  }
}
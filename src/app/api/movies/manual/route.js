import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const decoded = requireAdminUser(request);
    const data = await request.json();
    const person = await prisma.person.create({
      data: {
        tmdb_id: 0,
        name: data.director_id || 'anonymous' // a mistake in naming
      }
    })
    
    const movie = await prisma.movie.create({
      data: {
        title: data.title,
        overview: data.overview || null,
        director_id: person?.id || null,
        release_date: data.release_date || null,
        runtime: data.runtime || null,
        vote_average: data.vote_average || null,
        poster_path: data.poster_path || null,
        backdrop_path: data.backdrop_path || null,
        is_visible: true,
        tmdb_id: 0 // default value for manually created movies
      }
    });
    
    return NextResponse.json({
      success: true,
      data: movie
    }, { status: 201 });
    
  } catch (error) {
    console.error('Manual movie creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
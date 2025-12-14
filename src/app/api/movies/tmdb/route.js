import { NextResponse } from 'next/server';
import tmdb from '@/lib/tmdb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'popular';
    const page = searchParams.get('page') || '1';
    const genre = searchParams.get('genre');
    const query = searchParams.get('query');
    
    let endpoint = '';
    let params = { page };
    
    if (query) {
      endpoint = '/search/movie';
      params.query = query;
    } else if (genre) {
      endpoint = '/discover/movie';
      params.with_genres = genre;
    } else if (type === 'trending') {
      endpoint = '/trending/movie/week';
    } else {
      endpoint = `/movie/${type}`;
    }
    
    const response = await tmdb.get(endpoint, { params });
    
    return NextResponse.json({
      success: true,
      data: response.data
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
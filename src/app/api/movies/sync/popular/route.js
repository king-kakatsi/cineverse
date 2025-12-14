import { NextResponse } from 'next/server';
import { fetchPopularMovies } from '@/lib/tmdb';
import { syncMovie } from '@/lib/sync';
import { requireAdminUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const decoded = requireAdminUser(request); // will throw exception if user isn't admin
    const { pages = 1 } = await request.json();
    
    const stats = {
      total: 0,
      synced: 0,
      skipped: 0,
      errors: 0
    };
    
    for (let page = 1; page <= pages; page++) {
      const data = await fetchPopularMovies(page);
      const movies = data.results;
      stats.total += movies.length;
      
      for (const movie of movies) {
        try {
          const result = await syncMovie(movie.id);
          
          if (result.success) {
            stats.synced++;
          } else {
            stats.skipped++;
          }
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 250));
          
        } catch (error) {
          stats.errors++;
          console.error(`Error syncing movie ${movie.id}:`, error.message);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Sync completed',
      stats
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
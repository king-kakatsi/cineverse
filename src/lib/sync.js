import prisma from './prisma';
import { fetchMovieDetails, fetchGenres } from './tmdb';

/**
 * Get or create person in database
 */
async function getOrCreatePerson(tmdbPersonId, name, profilePath) {
  let person = await prisma.person.findUnique({
    where: { tmdb_id: tmdbPersonId }
  });
  
  if (!person) {
    person = await prisma.person.create({
      data: {
        tmdb_id: tmdbPersonId,
        name: name,
        profile_path: profilePath
      }
    });
  }
  
  return person.id;
}

/**
 * Get or create genre in database
 */
async function getOrCreateGenre(tmdbGenreId, name) {
  let genre = await prisma.genre.findUnique({
    where: { tmdb_id: tmdbGenreId }
  });
  
  if (!genre) {
    genre = await prisma.genre.create({
      data: {
        tmdb_id: tmdbGenreId,
        name: name
      }
    });
  }
  
  return genre.id;
}

/**
 * Extract director from credits
 */
function findDirector(credits) {
  if (!credits?.crew) return null;
  return credits.crew.find(person => person.job === 'Director');
}

/**
 * Extract top 10 cast
 */
function extractCast(credits) {
  if (!credits?.cast) return [];
  return credits.cast.slice(0, 10);
}

/**
 * Extract trailer key
 */
function extractTrailerKey(videos) {
  if (!videos?.results) return null;
  const trailer = videos.results.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  );
  return trailer?.key || null;
}

/**
 * Sync single movie from TMDB
 */
export async function syncMovie(tmdbId) {
  const existing = await prisma.movie.findUnique({
    where: { tmdb_id: tmdbId }
  });
  
  if (existing) {
    return { success: false, message: 'Movie already exists' };
  }
  
  const tmdbMovie = await fetchMovieDetails(tmdbId);
  
  // Process director
  let directorId = null;
  const director = findDirector(tmdbMovie.credits);
  if (director) {
    directorId = await getOrCreatePerson(
      director.id,
      director.name,
      director.profile_path
    );
  }
  
  // Process cast
  const castArray = extractCast(tmdbMovie.credits);
  const castData = [];
  
  for (const actor of castArray) {
    const personId = await getOrCreatePerson(
      actor.id,
      actor.name,
      actor.profile_path
    );
    
    castData.push({
      person_id: personId,
      character: actor.character
    });
  }
  
  // Process genres
  const genreIds = [];
  for (const genre of tmdbMovie.genres || []) {
    const genreId = await getOrCreateGenre(genre.id, genre.name);
    genreIds.push(genreId);
  }
  
  // Extract trailer
  const trailerKey = extractTrailerKey(tmdbMovie.videos);
  
  // Create movie
  const movie = await prisma.movie.create({
    data: {
      tmdb_id: tmdbMovie.id,
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      poster_path: tmdbMovie.poster_path,
      backdrop_path: tmdbMovie.backdrop_path,
      release_date: tmdbMovie.release_date,
      runtime: tmdbMovie.runtime,
      vote_average: tmdbMovie.vote_average,
      vote_count: tmdbMovie.vote_count,
      popularity: tmdbMovie.popularity,
      cast: castData,
      director_id: directorId,
      genreIds: genreIds,
      video_key: trailerKey,
      is_visible: true
    }
  });
  
  return { success: true, movie };
}

/**
 * Sync all genres from TMDB
 */
export async function syncGenres() {
  const tmdbGenres = await fetchGenres();
  const synced = [];
  
  for (const tmdbGenre of tmdbGenres) {
    const genreId = await getOrCreateGenre(tmdbGenre.id, tmdbGenre.name);
    synced.push(genreId);
  }
  
  return synced;
}
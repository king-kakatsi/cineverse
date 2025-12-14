import axios from 'axios';

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;



/**
 * Create TMDB axios instance
 */
const tmdbAxios = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY
  },
  timeout: 10000
});



/**
 * Fetch movies from TMDB API
 * @param {string} type - Type of request (popular, trending, details, search, discover)
 * @param {number|null} id - Movie ID for details
 * @param {object} params - Additional parameters
 * @returns {Promise<object>}
 */
export async function fetchMoviesFromTMDB(type, id = null, params = {}) {
  try {
    let endpoint = '';
    let config = { params: { language: 'en-US', ...params } };
    
    switch (type) {
      case 'popular':
        endpoint = '/movie/popular';
        break;
      
      case 'top_rated':
        endpoint = '/movie/top_rated';
        break;
      
      case 'now_playing':
        endpoint = '/movie/now_playing';
        break;
      
      case 'upcoming':
        endpoint = '/movie/upcoming';
        break;
      
      case 'trending':
        const timeWindow = params.timeWindow || 'week';
        endpoint = `/trending/movie/${timeWindow}`;
        break;
      
      case 'details':
        if (!id) throw new Error('Movie ID required for details');
        endpoint = `/movie/${id}`;
        config.params.append_to_response = 'credits,videos,similar';
        break;
      
      case 'search':
        endpoint = '/search/movie';
        if (!params.query) throw new Error('Search query required');
        break;
      
      case 'discover':
        endpoint = '/discover/movie';
        if (params.genre) {
          config.params.with_genres = params.genre;
        }
        config.params.sort_by = params.sort_by || 'popularity.desc';
        break;
      
      default:
        throw new Error(`Unknown type: ${type}`);
    }
    
    const response = await tmdbAxios.get(endpoint, config);
    return response.data;
    
  } catch (error) {
    console.error('TMDB API Error:', error);
    throw new Error(`Failed to fetch from TMDB: ${error.message}`);
  }
}



/**
 * Fetch genres from TMDB
 * @returns {Promise<array>}
 */
export async function fetchGenres() {
  try {
    const response = await tmdbAxios.get('/genre/movie/list', {
      params: { language: 'en-US' }
    });
    return response.data.genres;
  } catch (error) {
    console.error('Fetch genres error:', error);
    throw new Error('Failed to fetch genres');
  }
}



/**
 * Transform TMDB movie data to match our schema
 * @param {object} tmdbMovie - Raw TMDB movie data
 * @returns {object} Transformed movie data
 */
export function transformTMDBMovie(tmdbMovie) {
  // Extract director from credits
  const director = tmdbMovie.credits?.crew?.find(
    person => person.job === 'Director'
  )?.name || 'Unknown';
  
  // Extract main cast (top 10)
  const cast = tmdbMovie.credits?.cast?.slice(0, 10).map(actor => ({
    id: actor.id,
    name: actor.name,
    character: actor.character,
    profile_path: actor.profile_path
  })) || [];
  
  // Extract trailer key
  const trailer = tmdbMovie.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return {
    tmdb_id: tmdbMovie.id,
    title: tmdbMovie.title,
    original_title: tmdbMovie.original_title,
    overview: tmdbMovie.overview,
    poster_path: tmdbMovie.poster_path,
    backdrop_path: tmdbMovie.backdrop_path,
    release_date: tmdbMovie.release_date,
    runtime: tmdbMovie.runtime,
    vote_average: tmdbMovie.vote_average,
    vote_count: tmdbMovie.vote_count,
    popularity: tmdbMovie.popularity,
    genres: tmdbMovie.genres || [],
    director,
    cast,
    budget: tmdbMovie.budget,
    revenue: tmdbMovie.revenue,
    status: tmdbMovie.status,
    tagline: tmdbMovie.tagline,
    original_language: tmdbMovie.original_language,
    adult: tmdbMovie.adult,
    video_key: trailer?.key || null
  };
}



/**
 * Get full image URL
 * @param {string} path - Image path from TMDB
 * @param {string} size - Image size (w500, w780, original, etc)
 * @returns {string|null}
 */
export function getImageUrl(path, size = 'w500') {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}



/**
 * Get poster URL
 * @param {string} posterPath - Poster path
 * @param {string} size - Size
 * @returns {string|null}
 */
export function getPosterUrl(posterPath, size = 'w500') {
  return getImageUrl(posterPath, size);
}



/**
 * Get backdrop URL
 * @param {string} backdropPath - Backdrop path
 * @param {string} size - Size
 * @returns {string|null}
 */
export function getBackdropUrl(backdropPath, size = 'original') {
  return getImageUrl(backdropPath, size);
}



/**
 * Filter movies by criteria
 * @param {array} movies - Array of movies
 * @param {object} filters - Filter criteria
 * @returns {array}
 */
export function filterMovies(movies, filters = {}) {
  let filtered = [...movies];
  
  // Filter by genre
  if (filters.genre) {
    filtered = filtered.filter(movie => 
      movie.movie_infos.genres.some(g => g.id === parseInt(filters.genre))
    );
  }
  
  // Filter by date range
  if (filters.year) {
    filtered = filtered.filter(movie => {
      const releaseYear = new Date(movie.movie_infos.release_date).getFullYear();
      return releaseYear === parseInt(filters.year);
    });
  }
  
  // Filter by director
  if (filters.director) {
    filtered = filtered.filter(movie =>
      movie.movie_infos.director?.toLowerCase().includes(filters.director.toLowerCase())
    );
  }
  
  // Filter by rating
  if (filters.minRating) {
    filtered = filtered.filter(movie =>
      movie.movie_infos.vote_average >= parseFloat(filters.minRating)
    );
  }
  
  // Sort
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.movie_infos.popularity - a.movie_infos.popularity);
        break;
      case 'rating':
        filtered.sort((a, b) => b.movie_infos.vote_average - a.movie_infos.vote_average);
        break;
      case 'date':
        filtered.sort((a, b) => 
          new Date(b.movie_infos.release_date) - new Date(a.movie_infos.release_date)
        );
        break;
      case 'title':
        filtered.sort((a, b) => a.movie_infos.title.localeCompare(b.movie_infos.title));
        break;
    }
  }
  
  return filtered;
}
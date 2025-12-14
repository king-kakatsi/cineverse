import axios from 'axios';

const tmdb = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_BASE_URL,
  params: { api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY },
  timeout: 10000
});

export async function fetchMovieDetails(tmdbId) {
  const response = await tmdb.get(`/movie/${tmdbId}`, {
    params: { append_to_response: 'credits,videos' }
  });
  return response.data;
}

export async function fetchGenres() {
  const response = await tmdb.get('/genre/movie/list');
  return response.data.genres;
}

export async function fetchPopularMovies(page = 1) {
  const response = await tmdb.get('/movie/popular', { params: { page } });
  return response.data;
}

export async function searchMovies(query, page = 1) {
  const response = await tmdb.get('/search/movie', { 
    params: { query, page } 
  });
  return response.data;
}

export default tmdb;
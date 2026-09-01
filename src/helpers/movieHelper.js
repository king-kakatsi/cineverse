export function formatRuntime(minutes) {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

export function formatRating(rating) {
  if (!rating) return '0.0';
  return rating.toFixed(1);
}

export function getRatingColor(rating) {
  if (rating >= 7.5) return 'text-green-500';
  if (rating >= 6.0) return 'text-yellow-500';
  if (rating >= 4.0) return 'text-orange-500';
  return 'text-red-500';
}

export function getGenreNames(genres) {
  if (!genres || genres.length === 0) return 'N/A';
  return genres.map(genre => genre.name).join(', ');
}

export function getDirectorName(director) {
  return director?.name || 'Unknown';
}

export function getCastNames(cast) {
  if (!cast || cast.length === 0) return 'N/A';
  return cast.map(castMember => castMember.person?.name).filter(Boolean).join(', ');
}

export function getTrailerUrl(videoKey) {
  if (!videoKey) return null;
  return `https://www.youtube.com/watch?v=${videoKey}`;
}

export function getTrailerEmbedUrl(videoKey) {
  if (!videoKey) return null;
  return `https://www.youtube.com/embed/${videoKey}`;
}

export function getImageUrl(path, size = 'w500', isFullUrl = false) {
  if (!path) return null;
  if (!isFullUrl){
    const base = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;
    return `${base}/${size}${path}`;
  } else {
    return `${path}`;
  }
}

export function isFullUrl(url){
  return url && url.includes('http');
}

/**
 * Calculate a blended rating from TMDB vote_average and user ratings.
 * Supports two data sources:
 *   1. Pre-computed: movie.userRatingsAvg and movie.userRatingsCount (from Rating model)
 *   2. Legacy JSON: movie.rates object { userId: ratingValue } (deprecated)
 *
 * The blended formula: (userAverage + (tmdbRating / 2)) / 2
 * Falls back to tmdbRating / 2 when no user ratings exist.
 *
 * @param {object} movie - Movie object with rating data
 * @param {number|null} movie.userRatingsAvg - Pre-computed average from Rating model
 * @param {number|null} movie.userRatingsCount - Pre-computed count from Rating model
 * @param {object|null} movie.rates - Legacy JSON ratings (deprecated)
 * @param {number|null} movie.vote_average - TMDB vote average (0-10)
 * @returns {number|null} - Blended rating or null on error
 */
export function movieRate(movie) {
  try {
    if (!movie) return null;

    const tmdbRating = movie.vote_average || 0;
    let userAverage = 0;
    let hasUserRatings = false;

    if (movie.userRatingsAvg != null && movie.userRatingsCount > 0) {
      userAverage = movie.userRatingsAvg;
      hasUserRatings = true;
    } else if (movie.rates && Object.keys(movie.rates).length > 0) {
      const allUserRatings = Object.values(movie.rates);
      const total = allUserRatings.reduce((sum, rating) => sum + rating, 0);
      userAverage = total / allUserRatings.length;
      hasUserRatings = true;
    }

    if (!hasUserRatings) {
      return tmdbRating / 2;
    }

    return (userAverage + (tmdbRating / 2)) / 2;

  } catch (error) {
    return null;
  }
}

/**
 * Get a specific user's rating for a movie.
 * Supports both pre-computed userRatings array and legacy JSON field.
 *
 * @param {object} movie - Movie object
 * @param {Array|null} movie.userRatings - Array of { user_id, rating } from Rating model
 * @param {object|null} movie.rates - Legacy JSON ratings (deprecated)
 * @param {string} userId - User ID to look up
 * @returns {number} - User's rating (1-5) or 0 if not found
 */
export function getUserRating(movie, userId) {
  if (!userId) return 0;

  if (movie?.userRatings && Array.isArray(movie.userRatings)) {
    const foundRating = movie.userRatings.find(
      (singleRating) => singleRating.user_id === userId
    );
    return foundRating ? foundRating.rating : 0;
  }

  if (!movie?.rates) return 0;
  return movie.rates[userId] || 0;
}

/**
 * Get the average user rating from the Rating model.
 * Supports both pre-computed and legacy data sources.
 *
 * @param {object} movie - Movie object
 * @param {number|null} movie.userRatingsAvg - Pre-computed average
 * @param {object|null} movie.rates - Legacy JSON ratings (deprecated)
 * @returns {number} - Average rating rounded to 1 decimal, or 0
 */
export function getAverageRating(movie) {
  if (movie?.userRatingsAvg != null) {
    return parseFloat(movie.userRatingsAvg.toFixed(1));
  }

  if (!movie?.rates) return 0;

  const allRatings = Object.values(movie.rates);
  if (allRatings.length === 0) return 0;

  const sumOfRatings = allRatings.reduce((total, rating) => total + rating, 0);
  return parseFloat((sumOfRatings / allRatings.length).toFixed(1));
}

/**
 * Get the total number of user ratings.
 * Supports both pre-computed and legacy data sources.
 *
 * @param {object} movie - Movie object
 * @param {number|null} movie.userRatingsCount - Pre-computed count
 * @param {object|null} movie.rates - Legacy JSON ratings (deprecated)
 * @returns {number} - Rating count
 */
export function getRatingCount(movie) {
  if (movie?.userRatingsCount != null) {
    return movie.userRatingsCount;
  }

  if (!movie?.rates) return 0;
  return Object.keys(movie.rates).length;
}

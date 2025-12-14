export function formatRuntime(minutes) {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
  return genres.map(g => g.name).join(', ');
}

export function getDirectorName(director) {
  return director?.name || 'Unknown';
}

export function getCastNames(cast) {
  if (!cast || cast.length === 0) return 'N/A';
  return cast.map(c => c.person?.name).filter(Boolean).join(', ');
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

export function movieRate(movie){
  try{
    if (!movie) return null;
    
    const userRatings = movie.rates ? Object.values(movie.rates) : [];
    const tmdbRating = movie.vote_average || 0;
    if (userRatings.length === 0) {
      return tmdbRating / 2;
    }
    const userAverage = userRatings.reduce((sum, r) => sum + r, 0) / userRatings.length;
    return (userAverage + (tmdbRating / 2)) / 2;
    
  } catch (err){
    return null;
  }
}

export function getUserRating(movie, userId) {
  if (!movie?.rates || !userId) return 0;
  return movie.rates[userId] || 0;
}

export function getAverageRating(movie) {
  if (!movie?.rates) return 0;
  
  const ratings = Object.values(movie.rates);
  if (ratings.length === 0) return 0;
  
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return parseFloat((sum / ratings.length).toFixed(1));
}

export function getRatingCount(movie) {
  if (!movie?.rates) return 0;
  return Object.keys(movie.rates).length;
}

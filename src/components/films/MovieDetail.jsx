
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Heart } from "@/components/ui/button/heart";
import { RatingEmoji } from "@/components/ui/button/ratingEmoji";
import wishlistService from "@/services/wishlistService";
import { getImageUrl, getTrailerUrl, isFullUrl } from "@/helpers/movieHelper";

export default function MovieDetail({ movie, avgRating = 0, reviewCount = 0 }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Check if movie is in wishlist
  useEffect(() => {
    async function checkWishlist() {
      if (!movie?.id) return;

      try {
        setWishlistLoading(true);
        const [success, dataSet] = await wishlistService.getWishlist({
          page: 1,
          limit: 1000
        });

        if (success && dataSet.data.movies) {
          const isInWishlist = dataSet.data.movies.some(m => m.id === movie.id);
          setIsFavorite(isInWishlist);
        }
      } catch (err) {
        console.error('Failed to check wishlist:', err);
      } finally {
        setWishlistLoading(false);
      }
    }

    checkWishlist();
  }, [movie?.id]);


  // Toggle wishlist
  async function handleToggleFavorite() {
    if (!movie?.id) return;

    try {
      if (isFavorite) {
        const [success] = await wishlistService.removeFromWishlist(movie.id);
        if (success) {
          setIsFavorite(false);
        }
      } else {
        const [success] = await wishlistService.addToWishlist(movie.id);
        if (success) {
          setIsFavorite(true);
        }
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
  }

  if (!movie) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">No movie data available</p>
      </div>
    );
  }

  // Prepare image urls
  const backdropUrl = movie.backdrop_path
    ? isFullUrl(movie.backdrop_path)
      ? movie.backdrop_path
      : getImageUrl(movie.backdrop_path, 'original')
    : null;

  const posterUrl = movie.poster_path
    ? isFullUrl(movie.poster_path)
      ? movie.poster_path
      : getImageUrl(movie.poster_path, 'w500')
    : null;

  // extract metadata
  const genres = movie.genres?.map(g => g.name).join(', ') || null;
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Backdrop */}
      <div className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
            backgroundColor: !backdropUrl ? '#1a1a1a' : 'transparent'
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-full aspect-2/3 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No poster available</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-2 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {movie.title}
            </h1>

            {/* Rating and Favorite Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* {avgRating > 0 && ( */}
                <div className="flex items-center gap-3 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
                  <RatingEmoji rating={avgRating} size="lg" />
                  <div>
                    <span className="text-2xl font-bold">
                      {avgRating.toFixed(1)}
                    </span>
                    <p className="text-xs text-gray-400">
                      ({reviewCount} reviews)
                    </p>
                  </div>
                </div>
              {/* )} */}

              <button
                onClick={handleToggleFavorite}
                disabled={wishlistLoading}
                className={`${
                  isFavorite
                    ? "bg-[#e50914] border-[#e50914]"
                    : "border-gray-700"
                } rounded px-4 py-2 flex items-center justify-center border disabled:opacity-50 transition-colors hover:opacity-80`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>

              <a
                href={movie.id !== 'default' ? `${getTrailerUrl(movie?.video_key)}` : '#'} target="_blank"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 shadow h-11 py-2 bg-white/10 hover:bg-white/20 text-white px-3 md:px-8"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>
                Watch Trailer
              </a>
            </div>

            {/* Movie Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {genres && (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                  <p className="text-gray-400 text-sm mb-1">Genre</p>
                  <p className="font-semibold">{genres}</p>
                </div>
              )}
              {releaseYear && (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                  <p className="text-gray-400 text-sm mb-1">Release</p>
                  <p className="font-semibold">{releaseYear}</p>
                </div>
              )}
              {movie.runtime && (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                  <p className="text-gray-400 text-sm mb-1">Runtime</p>
                  <p className="font-semibold">{movie.runtime} min</p>
                </div>
              )}
              {movie.director && (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                  <p className="text-gray-400 text-sm mb-1">Director</p>
                  <p className="font-semibold">{movie.director.name}</p>
                </div>
              )}
            </div>

            {/* Synopsis */}
            {movie.overview && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-3">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-3">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.slice(0, 10).map((castMember, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {castMember.person?.name || 'Unknown'}
                      {castMember.character && ` (${castMember.character})`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
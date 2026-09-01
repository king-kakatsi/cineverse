"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import movieService from "@/services/movieService";
import MovieDetail from "@/components/films/MovieDetail";
import { movieRate } from "@/helpers/movieHelper";
import MovieComments from "@/components/reviews/allReviews";
import { fetchFromLocalStorage } from "@/services/localStorageService";
import MovieRating from "@/components/reviews/MovieRating";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id;

  const [movie, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingRating, setPendingRating] = useState(0);

  async function loadMovie() {
    if (!movieId) return;
    setCurrentUser(fetchFromLocalStorage('user'));

    try {
      setLoading(true);
      const [success, dataSet] = await movieService.getMovieById(movieId);

      if (success) {
        setFilm(dataSet.data);
      } else {
        setError(dataSet.message || 'Failed to load movie');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovie();
  }, [movieId]);

  const handleRatingSubmitted = () => {
    setPendingRating(0);
    loadMovie();
  };

  const handleRatingChange = (rating) => {
    setPendingRating(rating);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e50914] mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md bg-gray-900 p-8 rounded-lg border border-red-500">
          <h2 className="text-red-500 text-2xl font-bold mb-4">Error Loading Film</h2>
          <p className="text-white mb-4">{error || 'Film not found'}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-2 rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const reviews = movie.comments || [];
  // movieRate() now reads from movie.userRatingsAvg/userRatingsCount (Rating model)
  // with fallback to movie.rates (legacy JSON) for backward compatibility
  const avgRating = movieRate(movie);

  return (
    <>
      <MovieDetail 
        movie={movie} 
        avgRating={avgRating}
        reviewCount={reviews.length}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <MovieRating
          movieId={movieId}
          currentUser={currentUser}
          userRating={pendingRating}
          onRatingChange={handleRatingChange}
          onRatingSubmitted={handleRatingSubmitted}
        />

        <MovieComments
          movieId={movieId}
          currentUser={currentUser}
          pendingRating={pendingRating}
          onCommentSubmitted={handleRatingSubmitted}
        />
      </div>
    </>
  );
}

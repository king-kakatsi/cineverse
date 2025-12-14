/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import MovieComments from "@/components/reviews/allReviews";
import { RATING_EMOJIS } from "@/helpers/constants";
import RatingConfirmModal from "@/components/ui/modals/ratingConfirmModal";

export default function FilmDetail() {
  const params = useParams();
  const movieId = params?.id;

  let userContext;
  try {
    userContext = useUserContext();
  } catch (error) {
    console.error("UserContext error:", error);
    userContext = { currentUser: null, loading: false };
  }

  const { currentUser, loading: authLoading } = userContext;

  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  useEffect(() => {
    if (movieId) {
      loadMovieData();
    }
  }, [movieId]);

  const loadMovieData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/movies/${movieId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const movieData = data.data;
        setFilm({
          id: movieData.id,
          title: movieData.title,
          description:
            movieData.overview || movieData.description || "No description",
          backdrop_url: movieData.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
            : "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920",
          poster_url: movieData.poster_path
            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            : "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400",
          genre: movieData.genres?.map((g) => g.name).join(", ") || "Unknown",
          release_date: movieData.release_date,
          runtime: movieData.runtime,
          director: movieData.director?.name || "Unknown",
          cast:
            movieData.cast
              ?.slice(0, 5)
              .map((c) => c.person?.name || c.character) || [],
        });
      } else {
        throw new Error("Invalid data structure");
      }
    } catch (err) {
      console.error("Error loading movie:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!currentUser) {
      alert("You must be logged in to add favorites");
      return;
    }
    setIsFavorite(!isFavorite);
  };

  const handleSubmitRating = async (ratingValue) => {
    if (!currentUser) {
      alert("Vous devez être connecté pour noter ce film");
      return;
    }

    setIsSubmittingRating(true);
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieId,
          user_id: currentUser.id,
          rating: ratingValue
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Rating submitted successfully:", data);
        // Attendre 1 seconde puis fermer le modal et recharger
        setTimeout(() => {
          setUserRating(0);
          setShowRatingModal(false);
          // Recharger la page pour voir le nouveau rating dans les commentaires
          window.location.reload();
        }, 1000);
      } else {
        console.error("Rating submission failed:", data);
        setIsSubmittingRating(false);
        alert(data.error || "Erreur lors de la soumission de la note");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setIsSubmittingRating(false);
      alert("Erreur lors de la soumission de la note");
    }
  };

  const openRatingModal = () => {
    if (!currentUser) {
      alert("Vous devez être connecté pour noter ce film");
      return;
    }
    if (userRating === 0) {
      alert("Veuillez sélectionner une note (1-5)");
      return;
    }
    setShowRatingModal(true);
  };

  const selectRating = (rating) => {
    setUserRating(rating);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e50914] mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading film...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md bg-gray-900 p-8 rounded-lg border border-red-500">
          <h2 className="text-red-500 text-2xl font-bold mb-4">
            Error Loading Film
          </h2>
          <p className="text-white mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-2 rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl mb-4">Film not found</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-2 rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Backdrop */}
      <div className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${film.backdrop_url})` }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <img
              src={film.poster_url}
              alt={film.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="lg:col-span-2 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {film.title}
            </h1>

            {/* Film Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {film.genre && (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                  <p className="text-gray-400 text-sm mb-1">Genre</p>
                  <p className="font-semibold">{film.genre}</p>
                </div>
              )}
              {film.release_date && (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                  <p className="text-gray-400 text-sm mb-1">Release</p>
                  <p className="font-semibold">
                    {new Date(film.release_date).getFullYear()}
                  </p>
                </div>
              )}
              {film.runtime && (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                  <p className="text-gray-400 text-sm mb-1">Runtime</p>
                  <p className="font-semibold">{film.runtime} min</p>
                </div>
              )}
              {film.director && (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                  <p className="text-gray-400 text-sm mb-1">Director</p>
                  <p className="font-semibold">{film.director}</p>
                </div>
              )}
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-3">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">
                {film.description}
              </p>
            </div>

            {/* Cast */}
            {film.cast && film.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-3">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {film.cast.map((actor, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Your Rating Section */}
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Rating</h2>

              {currentUser ? (
                <>
                  {/* Rating avec emojis depuis constants.js */}
                  <div className="mb-6">
                    <label className="text-sm text-gray-400 mb-3 block">
                      Rate this film
                    </label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => selectRating(rating)}
                          className={`text-5xl transition-all hover:scale-110 ${
                            userRating >= rating
                              ? "opacity-100 scale-105"
                              : "opacity-80 grayscale"
                          }`}
                          title={`Rate ${rating}/5 - ${RATING_EMOJIS[rating].label}`}
                        >
                          {RATING_EMOJIS[rating].emoji}
                        </button>
                      ))}
                    </div>
                    {userRating > 0 && (
                      <p className="text-sm text-gray-400 mt-3">
                        Your rating: {userRating}/5 -{" "}
                        {RATING_EMOJIS[userRating].label}
                      </p>
                    )}
                  </div>

                  {/* Submit button pour le rating seulement */}
                  <button
                    onClick={openRatingModal}
                    disabled={userRating === 0 || isSubmittingRating}
                    className="w-full bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingRating ? "Envoi..." : "Soumettre la note"}
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-4">
                    You must be logged in to rate this film
                  </p>
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-2 rounded"
                  >
                    Login to Rate
                  </button>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <MovieComments
              movieId={movieId}
              currentUser={currentUser}
            />

            {/* Rating Confirmation Modal */}
            <RatingConfirmModal
              isOpen={showRatingModal}
              rating={userRating}
              onConfirm={handleSubmitRating}
              onCancel={() => setShowRatingModal(false)}
              isLoading={isSubmittingRating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

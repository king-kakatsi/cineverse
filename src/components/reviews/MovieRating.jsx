"use client";

import { useState, useEffect } from "react";
import { RATING_EMOJIS } from "@/helpers/constants";
import ratingService from "@/services/ratingService";

export default function MovieRating({
  movieId,
  currentUser,
  userRating,
  onRatingChange,
  onRatingSubmitted,
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchExistingRating = async () => {
      try {
        const [success, data] = await ratingService.getRating(
          movieId,
          currentUser.id
        );

        if (success && data) {
          const existingRating = data.data?.rating
            ?? (data.ratings?.length > 0 ? data.ratings[0].rating : null);

          if (existingRating) {
            onRatingChange(existingRating);
          }
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && movieId) {
      fetchExistingRating();
    } else {
      setLoading(false);
    }
  }, [currentUser, movieId]);

  const handleSubmitRating = async () => {
    if (!currentUser) {
      alert("You must be logged in to rate this film");
      return;
    }
    if (userRating === 0) {
      alert("Please select a rating (1-5)");
      return;
    }

    setSubmitting(true);

    try {
      const [success, data] = await ratingService.submitRating(
        movieId,
        currentUser.id,
        userRating
      );

      if (success) {
        if (onRatingSubmitted) {
          onRatingSubmitted();
        }
      } else {
        alert(data.error || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Error submitting rating");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectRating = (selectedRating) => {
    onRatingChange(selectedRating);
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg mb-8">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e50914] mx-auto mb-3"></div>
          <p className="text-gray-400">Loading your rating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Your Rating</h2>

      {currentUser ? (
        <>
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-3 block">
              Rate this film
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((ratingValue) => (
                <button
                  key={ratingValue}
                  onClick={() => handleSelectRating(ratingValue)}
                  onMouseEnter={() => setHoveredRating(ratingValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={submitting}
                  className={`text-2xl md:text-5xl transition-all hover:scale-110 ${
                    hoveredRating >= ratingValue || userRating >= ratingValue
                      ? "opacity-100 scale-105"
                      : "opacity-80 grayscale"
                  } ${submitting ? "cursor-not-allowed" : "cursor-pointer"}`}
                  title={`Rate ${ratingValue}/5 - ${RATING_EMOJIS[ratingValue].label}`}
                >
                  {RATING_EMOJIS[ratingValue].emoji}
                </button>
              ))}
            </div>
            {userRating > 0 && (
              <p className="text-sm text-gray-400 mt-3">
                Your rating: {userRating}/5 - {RATING_EMOJIS[userRating].label}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmitRating}
            disabled={userRating === 0 || submitting}
            className="w-full bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Rating"}
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
  );
}

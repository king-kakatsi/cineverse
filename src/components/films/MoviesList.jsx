"use client";

import { useState, useEffect } from "react";
import { useMovies } from "@/context/MovieContext";
import wishlistService from "@/services/wishlistService";
import MovieCard from "./MovieCard";
import { getImageUrl, isFullUrl, movieRate } from "@/helpers/movieHelper";

export default function MoviesList() {
  const { movies, loading, error, pagination, updateFilters } = useMovies();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  async function loadWishlist() {
    try {
      const [success, dataSet] = await wishlistService.getWishlist({
        page: 1,
        limit: 1000,
      });
      const data = dataSet.data;
      if (success && data.movies) {
        const ids = data.movies.map((movie) => movie.id);
        setWishlistIds(ids);
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setWishlistLoading(false);
    }
  }

  function handleWishlistToggle(movieId, isAdded) {
    if (isAdded) {
      setWishlistIds((prev) => [...prev, movieId]);
    } else {
      setWishlistIds((prev) => prev.filter((id) => id !== movieId));
    }
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e50914] mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading films...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md bg-gray-900 p-8 rounded-lg border border-red-500">
            <h2 className="text-red-500 text-2xl font-bold mb-4">Error Loading Films</h2>
            <p className="text-white mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-2 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🎬</div>
            <p className="text-gray-400 text-xl">No films found</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="flex items-center justify-between mb-6 pt-5">
        <h2 className="text-2xl font-bold text-white">
          {pagination.total} Movies
        </h2>
        <div className="text-sm text-gray-400">
          Page {pagination.page} of {pagination.totalPages}
        </div>
      </div>

      {wishlistLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e50914] mx-auto mb-3"></div>
            <p className="text-gray-400">Loading favorites...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                src={
                  isFullUrl(movie.poster_path)
                    ? movie.poster_path
                    : getImageUrl(movie.poster_path, "w500")
                }
                title={movie.title}
                director={movie.director?.name || "Unknown Director"}
                rating={movieRate(movie)}
                year={
                  movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : null
                }
                alt={movie.title}
                isInWishlist={wishlistIds.includes(movie.id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 scale-[80%] md:scale-90 lg:scale-100">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-md bg-black/50 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from(
                  { length: Math.min(3, pagination.totalPages) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 3) {
                      // At least 3 pages
                      pageNum = i + 1;
                    } else if (pagination.page === 1) {
                      // if we're on page 1, display 1, 2, 3
                      pageNum = i + 1;
                    } else if (pagination.page === pagination.totalPages) {
                      // if at the end, display the 3 last buttons
                      pageNum = pagination.totalPages - 2 + i;
                    } else {
                      // display current page at the middle
                      pageNum = pagination.page - 1 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-md border ${
                          pagination.page === pageNum
                            ? "bg-[#e50914] border-[#e50914] text-white"
                            : "bg-black/50 border-gray-700 text-white hover:bg-gray-800"
                        } transition-colors cursor-pointer`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 rounded-md bg-black/50 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

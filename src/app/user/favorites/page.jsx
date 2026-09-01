'use client';

import { useState, useEffect } from 'react';
import wishlistService from '@/services/wishlistService';
import MovieCard from '@/components/films/MovieCard';
import { getImageUrl, isFullUrl } from '@/helpers/movieHelper';
import Link from 'next/link';

export default function WishlistPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  async function loadWishlist(page = 1) {
    setLoading(true);
    setError(null);

    try {
      const [success, dataSet] = await wishlistService.getWishlist({ page, limit: 20 });

      if (success) {
        const data = dataSet.data;
        setMovies(data.movies || []);
        setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      } else {
        setError(data.message || 'Failed to load wishlist');
      }
    } catch (err) {
      console.error(' Wishlist exception:', err); // DEBUG
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleWishlistToggle(movieId, isAdded) {
    if (!isAdded) {
      // Remove from list
      setMovies(prev => prev.filter(movie => movie.id !== movieId));
      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        totalPages: Math.ceil(Math.max(0, prev.total - 1) / prev.limit)
      }));
    }
  }

  function handlePageChange(newPage) {
    loadWishlist(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e50914] mx-auto mb-4"></div>
              <p className="text-white text-xl">Loading favorites...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md bg-gray-900 p-8 rounded-lg border border-red-500">
              <h2 className="text-red-500 text-2xl font-bold mb-4">Error Loading Favorites</h2>
              <p className="text-white mb-4">{error}</p>
              <button
                onClick={() => loadWishlist()}
                className="bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-2 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Favorites</h1>
          <p className="text-gray-400">
            {pagination.total} {pagination.total === 1 ? 'movie' : 'movies'} saved
          </p>
        </div>

        {/* Empty state */}
        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600 mb-4"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              Your favorites list is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Start adding movies you love
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-[#e50914] hover:bg-[#b20710] text-white rounded-md font-medium transition-colors"
            >
              Browse Films
            </Link>
          </div>
        ) : (
          <>
            {/* Movies grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  src={isFullUrl(movie.poster_path) ? movie.poster_path : getImageUrl(movie.poster_path, 'w500')}
                  title={movie.title}
                  director={movie.director?.name || 'Unknown Director'}
                  rating={movie.vote_average}
                  year={movie.release_date ? new Date(movie.release_date).getFullYear() : null}
                  alt={movie.title}
                  isInWishlist={true}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-md bg-black/50 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-md border ${
                          pagination.page === pageNum
                            ? 'bg-[#e50914] border-[#e50914] text-white'
                            : 'bg-black/50 border-gray-700 text-white hover:bg-gray-800'
                        } transition-colors cursor-pointer`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
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
    </div>
  );
}
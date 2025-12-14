'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMovies } from '@/context/MovieContext';
import movieService from '@/services/movieService';
import MoviesGrid from '@/components/admin/MoviesGrid';
import DeleteConfirmModal from '@/components/admin/modals/DeleteConfirmModal';
import EditMovieModal from '@/components/admin/modals/EditMovieModal';
import TMDBFetchModal from '@/components/admin/modals/TMDBFetchModal';
import { fetchFromLocalStorage } from '@/services/localStorageService';
import { useRouter } from 'next/navigation';
import AdminUtils from '@/components/admin/adminUtils';

export default function AdminMoviesPage() {
  const { movies, loading, loadMovies, pagination, updateFilters } = useMovies();
  const [searchQuery, setSearchQuery] = useState('');
  const [showTMDBModal, setShowTMDBModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  // useEffect(() =>{
  //   const token = fetchFromLocalStorage('token');
  //   const currentUser = fetchFromLocalStorage('user');
  //   if (!token || (currentUser && currentUser.role !== "ADMIN")) router.push('/');
  // }, [router])

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage });
  };

  const handleSyncStart = () => {
    setIsSyncing(true);
    // Reload sync after 300s (5m)
    setTimeout(() => {
      loadMovies();
      setIsSyncing(false);
    }, 300000); // 300s 
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Manage Movies</h1>
          <p className="text-gray-400">Add, edit, or remove movies from your catalog</p>
        </div>
        <div className='mb-4' >
          <AdminUtils />
        </div>
        {isSyncing && (
          <div className="mb-6 bg-indigo-900/20 border border-indigo-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-indigo-300">
                Syncing movies from TMDB... This may take a few moments.
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-900"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowTMDBModal(true)}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              Fetch from TMDB
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={18} />
              Add Movie
            </button>
          </div>
        </div>

        <MoviesGrid
          movies={filteredMovies}
          loading={loading}
          onEdit={(movie) => {
            setSelectedMovie(movie);
            setShowEditModal(true);
          }}
          onDelete={(movie) => {
            setSelectedMovie(movie);
            setShowDeleteModal(true);
          }}
        />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} movies
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
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
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        pageNum === pagination.page
                          ? 'bg-indigo-900 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        <TMDBFetchModal
          isOpen={showTMDBModal}
          onClose={() => setShowTMDBModal(false)}
          onSuccess={handleSyncStart}
        />

        <EditMovieModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          movie={selectedMovie}
          onSuccess={loadMovies}
        />

        <EditMovieModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          movie={null}
          onSuccess={loadMovies}
        />

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          movie={selectedMovie}
          onSuccess={loadMovies}
        />
      </div>
    </div>
  );
}
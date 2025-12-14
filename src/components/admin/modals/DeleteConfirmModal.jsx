'use client';

import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import movieService from '@/services/movieService';

export default function DeleteConfirmModal({ isOpen, onClose, movie, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!movie?.id) return;
    
    setLoading(true);
    const [success] = await movieService.deleteMovie(movie.id);
    setLoading(false);
    
    if (success) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-100">Delete Movie</h3>
          </div>
          
          <p className="text-gray-400 mb-6">
            Are you sure you want to delete <span className="text-gray-200 font-medium">{movie.title}</span>? 
            This will hide the movie from users but keep it in the database.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
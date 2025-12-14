'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import movieService from '@/services/movieService';
import { TMDB_TYPES } from '@/helpers/constants';

const TMDB_CATEGORIES = [
  { value: TMDB_TYPES.POPULAR, label: 'Popular' },
  { value: TMDB_TYPES.TOP_RATED, label: 'Top Rated' },
  { value: TMDB_TYPES.NOW_PLAYING, label: 'Now Playing' },
  { value: TMDB_TYPES.UPCOMING, label: 'Upcoming' },
  { value: TMDB_TYPES.TRENDING, label: 'Trending' }
];

export default function TMDBFetchModal({ isOpen, onClose, onSuccess }) {
  const [pages, setPages] = useState(1);
  const [category, setCategory] = useState(TMDB_TYPES.POPULAR);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    
    // Run sync in background 
    movieService.syncFromTMDB(category, pages).then(([success, data]) => {
      if (success) {
        console.log('Sync completed:', data.stats);
      }
    });
    
    setLoading(false);
    onClose(); // close immediately
    onSuccess(); // Notify that sync has been raised
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100">Fetch from TMDB</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-300 cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900 cursor-pointer"
            >
              {TMDB_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Pages
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={pages}
              onChange={(e) => setPages(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900"
            />
          </div>

          <div className="bg-indigo-900/20 border border-indigo-700/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-indigo-300">
              Each page contains approximately 20 movies. This will fetch around {pages * 20} movies.
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleFetch}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Fetching...' : 'Fetch Movies'}
          </button>
        </div>
      </div>
    </div>
  );
}
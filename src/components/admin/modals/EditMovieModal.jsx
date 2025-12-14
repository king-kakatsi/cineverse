'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';
import movieService from '@/services/movieService';
import { useMovies } from '@/context/MovieContext';

export default function EditMovieModal({ isOpen, onClose, movie, onSuccess }) {
  const { genres } = useMovies();
  const isEditMode = !!movie;
  const [useTMDB, setUseTMDB] = useState(true);
  
  const [formData, setFormData] = useState({
    tmdb_id: '',
    title: '',
    overview: '',
    director_id: '',
    director_name: '',
    release_date: '',
    runtime: '',
    vote_average: '',
    poster_path: '',
    backdrop_path: '',
    genreIds: []
  });

  const [directorSearch, setDirectorSearch] = useState('');
  const [directorResults, setDirectorResults] = useState([]);
  const [showDirectorDropdown, setShowDirectorDropdown] = useState(false);
  const [searchingDirectors, setSearchingDirectors] = useState(false);
  const [loading, setLoading] = useState(false);
  const directorInputRef = useRef(null);

  useEffect(() => {
    if (movie) {
      // Edit mode - populate form with movie data
      const initForm = () => {
      setFormData({
        tmdb_id: movie.tmdb_id || '',
        title: movie.title || '',
        overview: movie.overview || '',
        director_id: movie.director_id || '',
        director_name: movie.director?.name || '',
        release_date: movie.release_date || '',
        runtime: movie.runtime || '',
        vote_average: movie.vote_average || '',
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        genreIds: movie.genreIds || []
      });
      setDirectorSearch(movie.director?.name || '');
      }
      initForm();
    } else {
      // Create mode - reset form
      const resetData = () => {
      setFormData({
        tmdb_id: '',
        title: '',
        overview: '',
        director_id: '',
        director_name: '',
        release_date: '',
        runtime: '',
        vote_average: '',
        poster_path: '',
        backdrop_path: '',
        genreIds: []
      });
      setUseTMDB(true);
      setDirectorSearch('');
      }
      resetData();
    }
    const initDirectorResult = () =>{
    setDirectorResults([]);
    setShowDirectorDropdown(false);
    }
    initDirectorResult();
  }, [movie, isOpen]);

  // Search directors
  useEffect(() => {
    const searchDirectors = async () => {
      if (directorSearch.length < 2) {
        setDirectorResults([]);
        return;
      }

      setSearchingDirectors(true);
      const [success, dataSet] = await movieService.getPersons(directorSearch);
      setSearchingDirectors(false);

      if (success) {
        setDirectorResults(dataSet.data || []);
        setShowDirectorDropdown(true);
      }
    };

    const timeoutId = setTimeout(searchDirectors, 300);
    return () => clearTimeout(timeoutId);
  }, [directorSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (directorInputRef.current && !directorInputRef.current.contains(event.target)) {
        setShowDirectorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDirectorSelect = (person) => {
    setFormData({
      ...formData,
      director_id: person.id,
      director_name: person.name
    });
    setDirectorSearch(person.name);
    setShowDirectorDropdown(false);
  };

  const handleDirectorInputChange = (e) => {
    const value = e.target.value;
    setDirectorSearch(value);
    
    // Clear director_id if user is typing new name
    if (value !== formData.director_name) {
      setFormData({
        ...formData,
        director_id: '',
        director_name: value
      });
    }
  };

  const handleGenreToggle = (genreId) => {
    setFormData(prev => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter(id => id !== genreId)
        : [...prev.genreIds, genreId]
    }));
  };

  const handleSave = async () => {
    if (isEditMode) {
      // Update existing movie
      if (!movie?.id) return;
      setLoading(true);
      
      // Prepare data for update - keep only actual database fields
      const updateData = {
        title: formData.title,
        overview: formData.overview,
        release_date: formData.release_date,
        runtime: formData.runtime ? parseInt(formData.runtime) : null,
        vote_average: formData.vote_average ? parseFloat(formData.vote_average) : null,
        poster_path: formData.poster_path,
        backdrop_path: formData.backdrop_path,
        genreIds: formData.genreIds
      };

      // Only include director_id if it changed or is set
      if (formData.director_id) {
        updateData.director_id = formData.director_id;
      }
      
      const [success] = await movieService.updateMovie(movie.id, updateData);
      setLoading(false);
      
      if (success) {
        onSuccess();
        onClose();
      }
    } else {
      // Add new movie
      setLoading(true);
      
      if (useTMDB) {
        // Fetch from TMDB by ID
        if (!formData.tmdb_id) {
          setLoading(false);
          return;
        }
        const [success] = await movieService.addMovie(parseInt(formData.tmdb_id));
        setLoading(false);
        
        if (success) {
          onSuccess();
          onClose();
        }
      } else {
        // Create manually - your API expects director_id to contain the name
        const movieData = {
          title: formData.title,
          overview: formData.overview,
          director_id: directorSearch || 'anonymous', // API uses this field for director name
          release_date: formData.release_date,
          runtime: formData.runtime ? parseInt(formData.runtime) : null,
          vote_average: formData.vote_average ? parseFloat(formData.vote_average) : null,
          poster_path: formData.poster_path || null,
          backdrop_path: formData.backdrop_path || null,
          genreIds: formData.genreIds,
          is_visible: true
        };
        
        const [success] = await movieService.createMovieManually(movieData);
        setLoading(false);
        
        if (success) {
          onSuccess();
          onClose();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full border border-gray-700 my-8 max-h-[80vh] overflow-y-auto [scrollbar-width:none]">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100">
            {isEditMode ? 'Edit Movie' : 'Add Movie'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-300 cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Toggle TMDB / Manual for Add mode only */}
          {!isEditMode && (
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <input
                type="checkbox"
                id="useTMDB"
                checked={useTMDB}
                onChange={(e) => setUseTMDB(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="useTMDB" className="text-sm text-gray-300 cursor-pointer">
                Fetch movie data from TMDB (recommended)
              </label>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TMDB Mode - Just ID */}
            {!isEditMode && useTMDB && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  TMDB ID *
                </label>
                <input
                  type="number"
                  value={formData.tmdb_id}
                  onChange={(e) => setFormData({...formData, tmdb_id: e.target.value})}
                  placeholder="e.g. 550 for Fight Club"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Find TMDB ID on themoviedb.org (e.g., URL: /movie/550-fight-club → ID is 550)
                </p>
              </div>
            )}

            {/* Manual Mode or Edit - all fields */}
            {(isEditMode || !useTMDB) && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900"
                    required
                  />
                </div>

                {/* Director Search */}
                <div className="md:col-span-2 relative" ref={directorInputRef}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Director
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    <input
                      type="text"
                      value={directorSearch}
                      onChange={handleDirectorInputChange}
                      onFocus={() => directorSearch.length >= 2 && setShowDirectorDropdown(true)}
                      placeholder="Search or type director name..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900"
                    />
                    {searchingDirectors && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  {showDirectorDropdown && directorResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {directorResults.map((person) => (
                        <button
                          key={person.id}
                          onClick={() => handleDirectorSelect(person)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors cursor-pointer text-gray-200"
                        >
                          {person.name}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {directorSearch.length >= 2 && directorResults.length === 0 && !searchingDirectors && showDirectorDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3">
                      <p className="text-sm text-gray-400">
                        No director found. Type a name to create a new one.
                      </p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Search existing directors or type a new name to create one
                  </p>
                </div>

                {/* Genres Multi-select */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genres
                  </label>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {genres.map((genre) => (
                        <label
                          key={genre.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.genreIds.includes(genre.id)}
                            onChange={() => handleGenreToggle(genre.id)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm text-gray-300">{genre.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select all genres that apply
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Runtime (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.runtime}
                    onChange={(e) => setFormData({...formData, runtime: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating (0-10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.vote_average}
                    onChange={(e) => setFormData({...formData, vote_average: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Poster Path
                  </label>
                  <input
                    type="text"
                    value={formData.poster_path}
                    onChange={(e) => setFormData({...formData, poster_path: e.target.value})}
                    placeholder="/path/to/poster.jpg"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">TMDB poster path (optional)</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Overview
                  </label>
                  <textarea
                    value={formData.overview}
                    onChange={(e) => setFormData({...formData, overview: e.target.value})}
                    rows={4}
                    placeholder="Movie description..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-900 resize-none"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || (!isEditMode && useTMDB && !formData.tmdb_id) || (!isEditMode && !useTMDB && !formData.title)}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                isEditMode 
                  ? 'bg-indigo-900 hover:bg-indigo-800' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {loading ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Movie')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
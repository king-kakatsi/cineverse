'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import movieService from '@/services/movieService';

const MovieContext = createContext(null);

export function MovieProvider({ children }) {
  const [bestMovie, setBestMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    genre: null,
    director: null,
    year: null, 
    // sort: 'popularity',
    search: ''
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  async function loadMovies() {
    setLoading(true);
    setError(null);

    try {
      const [success, dataSet] = await movieService.getMovies(filters);
      if (success) {
        const data = dataSet.data;
        setMovies(data.movies);
        setPagination(data.pagination);
        
        // Set best movie (highest rated)
        if (data.movies && data.movies.length > 0) {
          const sorted = [...data.movies].sort((a, b) => b.vote_average - a.vote_average);
          setBestMovie(sorted[0]);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadGenres() {
  try {
    const [success, dataSet] = await movieService.getGenres();
    if (success) {
      const data = dataSet.data || dataSet;
      // Ensure genres is always an array
      setGenres(Array.isArray(data) ? data : []);
    }
  } catch (err) {
    // console.error('Failed to load genres:', err);
    setGenres([]); // Set empty array on error
  }
}

  function getBestMovie(theMovies = null) {
    const moviesToSort = theMovies || movies;
    if (!moviesToSort || moviesToSort.length === 0) return null;
    
    const sorted = [...moviesToSort].sort((a, b) => b.vote_average - a.vote_average);
    return sorted[0];
  }

  function updateFilters(newFilters) {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1
    }));
  }

  function resetFilters() {
    setFilters({
      page: 1,
      limit: 20,
      genre: null,
      director: null,
      sort: 'popularity',
      search: ''
    });
  }

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    loadMovies();
  }, [filters]);

  const value = {
    movies,
    genres,
    loading,
    error,
    filters,
    pagination,
    bestMovie,
    updateFilters,
    resetFilters,
    loadMovies,
    getBestMovie
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within MovieProvider');
  }
  return context;
}

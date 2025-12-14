'use client';

import { useMovies } from "@/context/MovieContext";
import { useState } from "react";

export default function MoviesFilter() {
  const { filters, genres, updateFilters } = useMovies();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedGenre, setSelectedGenre] = useState(filters.genre || '');
  const [selectedYear, setSelectedYear] = useState(filters.year || '');
  const [selectedSort, setSelectedSort] = useState(filters.sort || 'popularity');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm, page: 1 });
  };

  const handleGenreChange = (e) => {
    const value = e.target.value;
    setSelectedGenre(value);
    updateFilters({ genre: value || null, page: 1 });
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setSelectedYear(value);
    updateFilters({ year: value || null, page: 1 });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSelectedSort(value);
    updateFilters({ sort: value, page: 1 });
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-2 z-10">
      <div className="bg-linear-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-[#e50914]"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <h2 className="text-lg font-semibold text-white">Filter Movies</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onBlur={handleSearchSubmit}
              className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e50914] pl-10 bg-black/50 border-gray-700 text-white"
              placeholder="Search films..."
            />
          </form>

          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm bg-black/50 border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-[#e50914] cursor-pointer"
          >
            <option value="">All Genres</option>
            {Array.isArray(genres) && genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm bg-black/50 border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-[#e50914] cursor-pointer"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={selectedSort}
            onChange={handleSortChange}
            className="flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm bg-black/50 border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-[#e50914] cursor-pointer"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="date">Release Date</option>
            <option value="title">Title (A-Z)</option>
          </select>

          {/* Reset Button */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedGenre('');
              setSelectedYear('');
              setSelectedSort('popularity');
              updateFilters({
                search: '',
                genre: null,
                year: null,
                sort: 'popularity',
                page: 1
              });
            }}
            className="flex h-9 items-center justify-center rounded-md border border-gray-700 bg-black/50 px-4 text-sm text-white hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { getYearFromDate, isRecentMovie } from "@/helpers/dateHelper";
import { truncateText } from "@/helpers/stringHelper";
import { getImageUrl, getTrailerUrl, movieRate } from "@/helpers/movieHelper";
import { useMovies } from "@/context/MovieContext";
import Link from "next/link";

const DEFAULT_HERO = {
  id: 'default',
  title: 'The Godfather of Harlem',
  backdrop_path: null,
  release_date: '1972-03-14',
  genres: [{ name: 'Drama' }],
  director: { name: 'Francis Ford Coppola' },
  vote_average: 8.7,
  overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'
};

const DEFAULT_BACKDROP = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920';

export default function HeroSection() {
  const { bestMovie, loading } = useMovies();

  // Use bestMovie if available, otherwise use default
  const movie = bestMovie || DEFAULT_HERO;
  const backdropUrl = movie.backdrop_path 
    ? getImageUrl(movie.backdrop_path, 'original')
    : DEFAULT_BACKDROP;
  
  const genreNames = movie.genres?.map(g => g.name).join(', ') || 'Drama';
  const directorName = movie.director?.name || 'Unknown Director';

  return (
    <div 
      className="w-full relative h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%), url(${backdropUrl})`
      }}
    >
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl py-20">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-[#e50914] text-white text-xs font-semibold rounded-full">
              {isRecentMovie(movie.release_date) ? 'NEW' : 'CLASSIC'}
            </span>
            <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-semibold rounded-full flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {movieRate(movie).toFixed(1) || 'N/A'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-7xl font-bold mb-4 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {movie.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            <span>{getYearFromDate(movie.release_date)}</span>
            <span className="px-2 py-1 bg-gray-800/50 rounded">{genreNames}</span>
            <span>Directed by {directorName}</span>
          </div>

          {/* Overview */}
          <p className="text-gray-300 text-sm md:text-lg mb-8 line-clamp-3 break-all">
            {truncateText(movie.overview, 200) || "An exceptional film that captivates audiences with its compelling story and stellar performances."}
          </p>

          {/* Buttons */}
          <div className="flex gap-1 md:gap-4 justify-center">
            <Link
              href={movie.id !== 'default' ? `/movies/${movie.id}` : '#'}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 shadow h-11 py-2 bg-[#e50914] hover:bg-[#b20710] text-white px-3 md:px-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              More Info
            </Link>

            <a
              href={movie.id !== 'default' ? `${getTrailerUrl(movie?.video_key)}` : '#'} target="_blank"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 shadow h-11 py-2 bg-white/10 hover:bg-white/20 text-white px-3 md:px-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
              Watch Trailer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
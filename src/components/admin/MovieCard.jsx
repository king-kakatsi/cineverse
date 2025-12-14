/* eslint-disable @next/next/no-img-element */
import { Edit2, Trash2 } from 'lucide-react';
import { DEFAULT_POSTER, TMDB_IMAGE_SIZES } from '@/helpers/constants';
import { useRouter } from 'next/navigation';

function getImageUrl(path) {
  if (!path) return DEFAULT_POSTER;
  return `https://image.tmdb.org/t/p/${TMDB_IMAGE_SIZES.POSTER.SMALL}${path}`;
}

function getYear(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear();
}

export default function MovieCard({ movie, onEdit, onDelete }) {
  const router = useRouter();

  const handleCardClick = (e) => {
    // Should not navigate whe we click on buttons
    if (e.target.closest('button')) {
      return;
    }
    router.push(`/movies/${movie.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(movie);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(movie);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-linear-to-br from-gray-900/90 to-gray-800/90 rounded-xl border border-gray-700/50 hover:border-indigo-900/50 transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-900/20"
    >
      <div className="flex gap-4 p-5">
        <div className="shrink-0">
          <img 
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-24 h-36 object-cover rounded-lg shadow-lg"
          />
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-gray-100 truncate flex-1">
                {movie.title}
              </h3>
              {movie.vote_average && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-yellow-500">★</span>
                  <span className="text-gray-200 font-medium">{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-gray-500">Director:</span>
              <span className="text-gray-300">{movie.director?.name || 'Unknown'}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {movie.genres?.slice(0, 4).map((genre) => (
                <span 
                  key={genre.id}
                  className="px-2.5 py-1 bg-indigo-900/40 text-indigo-300 text-xs rounded-full border border-indigo-700/30"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">
              {getYear(movie.release_date)}
            </span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 rounded-lg transition-all cursor-pointer"
                aria-label="Edit movie"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-all cursor-pointer"
                aria-label="Delete movie"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
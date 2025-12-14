import MovieCard from './MovieCard';

export default function MoviesGrid({ movies, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading movies...</div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No movies found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937' }}>
      <div className="space-y-3 min-w-[600px]">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id}
            movie={movie}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
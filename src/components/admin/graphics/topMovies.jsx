import { BarChart3 } from "lucide-react";

export const TopMoviesBarChart = ({ data }) => {
  const topData = [...data]
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 10);
  const MAX_RATING = 10;
  const CHART_COLOR = "bg-[#e50914]";

  return (
    <div className="bg-zinc-900 p-6 rounded-lg shadow-xl col-span-full border border-gray-800">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <BarChart3 className="w-6 h-6 mr-3 text-[#e50914]" />
        Top {topData.length} Rated Movies
      </h3>

      <div className="flex flex-col space-y-4 pt-4">
        {/* Header */}
        <div className="grid grid-cols-12 items-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-zinc-700 pb-2">
          <div className="col-span-3">Movie Title</div>
          <div className="col-span-8">Rating (out of 10)</div>
          <div className="col-span-1 text-right">Reviews</div>
        </div>

        {/* Data Rows */}
        {topData.map((movie, index) => {
          const percentage = (movie.avgRating / MAX_RATING) * 100;
          return (
            <div
              key={movie.id}
              className="grid grid-cols-12 items-center gap-4 hover:bg-zinc-800/50 transition-colors py-1 rounded-sm"
            >
              {/* Rank and Title */}
              <div className="col-span-3 text-sm font-medium text-gray-300 truncate pr-2">
                <span className="text-red-500 font-bold mr-2">
                  {index + 1}.
                </span>
                {movie.title}
              </div>

              {/* Bar Visualization */}
              <div className="col-span-8 h-6 bg-zinc-800 rounded-full overflow-hidden relative">
                <div
                  className={`h-full ${CHART_COLOR} transition-all duration-1000 ease-out flex items-center justify-end`}
                  style={{ width: `${percentage}%` }}
                >
                  {/* Rating value displayed inside the bar */}
                  <span className="text-xs font-bold text-white px-2">
                    {movie.avgRating?.toFixed(1) || "N/A"}
                  </span>
                </div>
              </div>

              {/* Review Count */}
              <div className="col-span-1 text-sm text-gray-400 text-right">
                {movie.reviewCount}
              </div>
            </div>
          );
        })}
      </div>
      {topData.length === 0 && (
        <p className="text-gray-500 mt-4">No data to display.</p>
      )}
    </div>
  );
};

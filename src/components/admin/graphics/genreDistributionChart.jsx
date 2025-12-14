import { PieChart } from "lucide-react";

export const GenreDistributionChart = ({ data }) => {
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const colors = [
    "#e50914",
    "#ffd700",
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#ff7f50",
    "#00ced1",
    "#ff1493",
    "#7fff00",
    "#ffa500",
  ];

  return (
    <div className="bg-zinc-900 p-6 rounded-lg shadow-xl h-full min-h-96 border border-gray-800">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <PieChart className="w-6 h-6 mr-3 text-red-500" />
        Movie Distribution by Genre
      </h3>
      <div className="flex flex-col items-center justify-start h-full text-center p-2">
        <p className="text-gray-400 text-sm mb-3">
          Total films analyzed:{" "}
          <span className="text-white font-medium">{totalCount}</span>
        </p>
        <div className=" h-fit w-full">
          <ul className="text-sm text-gray-500 w-full max-w-xs mx-auto space-y-1">
            {data.map((g, index) => {
              const percentage = (
                totalCount > 0 ? (g.count / totalCount) * 100 : 0
              ).toFixed(1);
              const itemColor = colors[index % colors.length];
              return (
                <li
                  key={g.name}
                  className="flex justify-between w-full border-b border-zinc-800 pb-1 last:border-b-0"
                >
                  <div className="flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2`}
                      style={{ backgroundColor: itemColor }}
                    ></span>
                    <span className="text-gray-300 font-semibold">
                      {g.name}
                    </span>
                  </div>
                  <span className="text-white font-medium">
                    {g.count} ({percentage}%)
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

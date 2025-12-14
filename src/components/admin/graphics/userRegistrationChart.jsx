import { LineChart } from "lucide-react";

export const UserRegistrationTrendChart = ({ data }) => {
  const sortedData = data;
  const totalRegistrations = sortedData.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const chartData = sortedData.filter(
    (item) => typeof item.count === "number" && item.count >= 0
  );

  if (chartData.length < 2) {
    return (
      <div className="bg-zinc-900 p-6 rounded-lg shadow-xl border border-gray-800 h-full min-h-96 flex flex-col items-center justify-center">
        <LineChart className="w-10 h-10 text-blue-500 mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">
          User Registration Trend
        </h3>
        <p className="text-gray-500 text-sm">
          Not enough data to draw the trend line for the last 90 days.
        </p>
      </div>
    );
  }

  const width = 400;
  const height = 150;
  const padding = 10;
  const chartAreaHeight = height - 2 * padding;
  const chartAreaWidth = width - 2 * padding;

  const maxCount = Math.max(...chartData.map((d) => d.count)) || 1;
  const minDate = new Date(chartData[0].date).getTime();
  const maxDate = new Date(chartData[chartData.length - 1].date).getTime();
  const dateRange = maxDate - minDate || 1;

  // Convert data points to SVG coordinates
  const points = chartData
    .map((d) => {
      const x =
        padding +
        ((new Date(d.date).getTime() - minDate) / dateRange) * chartAreaWidth;
      const y = height - padding - (d.count / maxCount) * chartAreaHeight;
      return `${x},${y}`;
    })
    .join(" ");

  // Get X-axis labels for start and end
  const formatLabel = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  const startDateLabel =
    chartData.length > 0 ? formatLabel(chartData[0].date) : "";
  const endDateLabel =
    chartData.length > 0
      ? formatLabel(chartData[chartData.length - 1].date)
      : "";
  const maxCountLabel = maxCount;

  return (
    <div className="bg-zinc-900 p-6 rounded-lg shadow-xl border border-gray-800 h-full min-h-96 flex flex-col">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <LineChart className="w-6 h-6 mr-3 text-blue-500" />
        User Registration Trend
      </h3>

      <div className="grow flex flex-col justify-center items-center">
        <p className="text-gray-400 text-sm mb-4">
          Total new users in last 90 days:{" "}
          <span className="text-white font-medium">{totalRegistrations}</span>
        </p>

        <div className="w-full relative" style={{ height: "250px" }}>
          <svg
            viewBox={`0 0 ${width} ${height + 20}`}
            className="w-full h-full text-blue-500"
          >
            {/* Y-axis horizontal grid lines */}
            <line
              x1={padding}
              y1={padding}
              x2={width - padding}
              y2={padding}
              stroke="#374151"
              strokeDasharray="3 3"
            />
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="#374151"
              strokeDasharray="3 3"
            />

            {/* The Line */}
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              points={points}
            />

            {/* Data Points */}
            {chartData.map((d, index) => {
              const x =
                padding +
                ((new Date(d.date).getTime() - minDate) / dateRange) *
                  chartAreaWidth;
              const y =
                height - padding - (d.count / maxCount) * chartAreaHeight;
              return (
                <circle key={index} cx={x} cy={y} r="2" fill="currentColor" />
              );
            })}

            {/* Labels for Y-axis (Max Count) */}
            <text
              x={padding - 5}
              y={padding + 5}
              textAnchor="end"
              fill="#9ca3af"
              fontSize="8"
            >
              {maxCountLabel}
            </text>
            <text
              x={padding - 5}
              y={height - padding + 5}
              textAnchor="end"
              fill="#9ca3af"
              fontSize="8"
            >
              0
            </text>

            {/* Labels for X-axis (Start/End Dates) */}
            <text
              x={padding}
              y={height + padding + 5}
              textAnchor="start"
              fill="#9ca3af"
              fontSize="8"
            >
              {startDateLabel}
            </text>
            <text
              x={width - padding}
              y={height + padding + 5}
              textAnchor="end"
              fill="#9ca3af"
              fontSize="8"
            >
              {endDateLabel}
            </text>
          </svg>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Trend based on {chartData.length} data points (filtered to 90 days).
      </p>
    </div>
  );
};

import { RATING_EMOJIS } from "@/helpers/constants";

 export const RatingEmoji = ({ rating, size, interactive, onSelect }) => {
  // rating = rating / 2;
  if (!rating || rating <= 0) rating = 1;
  const roundedRating = Math.round(rating);
  const emoji = RATING_EMOJIS[roundedRating]?.emoji || RATING_EMOJIS[1].emoji;
  const label = RATING_EMOJIS[roundedRating]?.label || RATING_EMOJIS[1].label;


  if (interactive) {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((r) => (
          <span
            key={r}
            onClick={() => onSelect(r)}
            className={`cursor-pointer transition-transform hover:scale-110 text-${
              size === "lg" ? "4xl" : "xl"
            } ${r <= roundedRating ? "opacity-100 scale-105" : "opacity-50" }`}
          >
            {RATING_EMOJIS[r].emoji}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className={`flex flex-col items-center gap-1 text-${size === "lg" ? "4xl" : "xl"}`}>
      <span>{emoji}</span> 
      <span className={`text-${size === "lg" ? "sm" : "xs"} text-gray-300 font-medium`}>{label}</span>  
    </div>
  );
};
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import WishlistButton from "../WishlistButton";
import React from "react";
import { RatingEmoji } from "../ui/button/ratingEmoji";

const MovieCard = ({
  id,
  src,
  title,
  director,
  rating,
  year,
  alt,
  isInWishlist = false,
  onWishlistToggle,
}) => {
  function handleWishlistToggle(newState) {
    if (onWishlistToggle) {
      onWishlistToggle(id, newState);
    }
  }

  return (
    <Link href={`/movies/${id}`}>
      <div className="group relative overflow-hidden rounded-lg bg-gray-900 transition-transform hover:scale-105 cursor-pointer">
        <div className="aspect-2/3 relative overflow-hidden">
          <img
            src={src || "/placeholder-poster.jpg"}
            alt={alt || title}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 right-2 scale-75 text-center bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 -translate-y-[1000px] group-hover:translate-y-0">
              <div className="flex flex-col">
                <RatingEmoji rating={rating.toFixed(1)} size="lg" />
                <span className="text-white text-xs font-bold">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          <div className="absolute top-2 left-2">
            <WishlistButton
              movieId={id}
              isInWishlist={isInWishlist}
              onToggle={handleWishlistToggle}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
            <h3 className="font-semibold text-white mb-1 line-clamp-1">
              {title}
            </h3>
            <p className="text-xs text-gray-400">{director}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;

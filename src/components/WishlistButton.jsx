'use client';

import { useState, useEffect } from 'react';
import wishlistService from '@/services/wishlistService';

export default function WishlistButton({ movieId, isInWishlist, onToggle }) {
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isInWishlist);

  //  Synchronise avec la prop quand elle change
  useEffect(() => {
    setIsFavorite(isInWishlist);
  }, [isInWishlist]);

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    
    try {
      if (isFavorite) {
        // Enlever des favoris
        const [success] = await wishlistService.removeFromWishlist(movieId);
        if (success) {
          setIsFavorite(false);
          if (onToggle) onToggle(false);
        }
      } else {
        // Ajouter aux favoris
        const [success] = await wishlistService.addToWishlist(movieId);
        if (success) {
          setIsFavorite(true);
          if (onToggle) onToggle(true);
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="p-2 rounded-md bg-black/80 backdrop-blur-sm hover:bg-black transition-colors disabled:opacity-50"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-colors ${isFavorite ? 'text-[#e50914]' : 'text-white'}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}
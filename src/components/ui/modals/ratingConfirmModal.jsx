"use client";

import { RATING_EMOJIS } from "@/helpers/constants";
import { X } from "lucide-react";

export default function RatingConfirmModal({ isOpen, rating, onConfirm, onCancel, isLoading }) {
  if (!isOpen || !rating) return null;

  const ratingData = RATING_EMOJIS[rating] || RATING_EMOJIS[1];

  const handleConfirm = () => {
    onConfirm(rating);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
        {/* Bouton fermer */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          disabled={isLoading}
          type="button"
        >
          <X size={24} />
        </button>

        {/* Affichage du rating */}
        <div className="text-center mb-6">
          <div className="text-8xl mb-6 animate-bounce">{ratingData.emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Confirmer votre note
          </h2>
          <p className="text-2xl font-bold text-[#e50914] mb-2">
            {ratingData.label}
          </p>
          <p className="text-gray-400 text-sm">
            {rating}/5 étoiles
          </p>
        </div>

        {/* Message */}
        <p className="text-center text-gray-300 mb-8">
          Êtes-vous sûr de vouloir noter ce film <span className="font-semibold text-[#e50914]">{ratingData.label.toLowerCase()}</span> ?
        </p>

        {/* Boutons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            type="button"
            className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            type="button"
            className="flex-1 px-4 py-3 bg-[#e50914] hover:bg-[#b20710] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Envoi...</span>
              </>
            ) : (
              `Confirmer ${ratingData.label}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

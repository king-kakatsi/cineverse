export const CURRENT_USER_KEY = "user";
export const ACCESS_TOKEN_KEY = "token";

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  MOVIES: '/movies',
  MOVIE_BY_ID: (id) => `/movies/${id}`,
  TMDB_MOVIES: '/movies/tmdb',
  GENRES: '/movies/genres',
  WISHLIST: '/users/wishlist',
  WISHLIST_ADD: '/users/wishlist',
  WISHLIST_REMOVE: (id) => `/users/wishlist/${id}`
};

/**
 * TMDB Image Sizes
 */
export const TMDB_IMAGE_SIZES = {
  POSTER: {
    SMALL: 'w185',
    MEDIUM: 'w342',
    LARGE: 'w500',
    XLARGE: 'w780',
    ORIGINAL: 'original'
  },
  BACKDROP: {
    SMALL: 'w300',
    MEDIUM: 'w780',
    LARGE: 'w1280',
    ORIGINAL: 'original'
  },
  PROFILE: {
    SMALL: 'w45',
    MEDIUM: 'w185',
    LARGE: 'h632',
    ORIGINAL: 'original'
  }
};

/**
 * Movie sort options
 */
export const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'date', label: 'Newest First' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'revenue', label: 'Highest Revenue' }
];

/**
 * Movie filter options
 */
export const FILTER_OPTIONS = {
  YEARS: Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i),
  RATINGS: [
    { value: 0, label: 'All Ratings' },
    { value: 7, label: '7+ Stars' },
    { value: 8, label: '8+ Stars' },
    { value: 9, label: '9+ Stars' }
  ]
};

/**
 * Pagination defaults
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_PAGES_SHOWN: 5
};

/**
 * Movie status types
 */
export const MOVIE_STATUS = {
  RELEASED: 'Released',
  POST_PRODUCTION: 'Post Production',
  IN_PRODUCTION: 'In Production',
  PLANNED: 'Planned',
  RUMORED: 'Rumored',
  CANCELED: 'Canceled'
};

/**
 * TMDB movie types
 */
export const TMDB_TYPES = {
  POPULAR: 'popular',
  TOP_RATED: 'top_rated',
  NOW_PLAYING: 'now_playing',
  UPCOMING: 'upcoming',
  TRENDING: 'trending'
};

/**
 * Default movie poster (when no poster available)
 */
export const DEFAULT_POSTER = '/images/no-poster.jpg';

/**
 * Default backdrop
 */
export const DEFAULT_BACKDROP = '/images/no-backdrop.jpg';

/**
 * Movie page size options
 */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/**
 * Rating thresholds
 */
export const RATING_THRESHOLDS = {
  EXCELLENT: 8.0,
  GOOD: 7.0,
  AVERAGE: 5.0,
  POOR: 3.0
};

/**
 * Rating with emoji
 */
export const RATING_EMOJIS = {
  1: { emoji: "😞", label: "Terrible" },
  2: { emoji: "😕", label: "Poor" },
  3: { emoji: "😊", label: "Good" },
  4: { emoji: "😃", label: "Great" },
  5: { emoji: "🤩", label: "Amazing" },
};

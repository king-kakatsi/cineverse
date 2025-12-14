/**
 * Transform a default date time format in a human readable format
 * @param {DateTimeFormat} date
 * @returns {string|null}
 */
export function getFullDate(date) {
  if (date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    const options = {
      weekday: "short",
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Intl.DateTimeFormat('en-GB', options).format(dateObj);
  }
  return null;
}

/**
 * Converts a string format date into a date format
 * Returns null if invalid value is provided
 * @param {Mixed} date
 * @returns {Date|null}
 */
export function parseDate(date) {
  if (!date) return null;
  if (date instanceof Date) return date;
  return new Date(date);
}

/**
 * Formats date in YYYY-MM-DD format
 * @param {Date} date
 * @returns {string|null}
 */
export function getDateString(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Get year from date string
 * @param {string} dateString
 * @returns {number|null}
 */
export function getYearFromDate(dateString) {
  if (!dateString) return null;
  return new Date(dateString).getFullYear();
}

/**
 * Format release date for movies
 * @param {string} dateString
 * @returns {string}
 */
export function formatReleaseDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Check if movie is recent (released in last year)
 * @param {string} releaseDate
 * @returns {boolean}
 */
export function isRecentMovie(releaseDate) {
  if (!releaseDate) return false;
  const movieDate = new Date(releaseDate);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return movieDate >= oneYearAgo;
}

/**
 * Check if movie is upcoming
 * @param {string} releaseDate
 * @returns {boolean}
 */
export function isUpcomingMovie(releaseDate) {
  if (!releaseDate) return false;
  const movieDate = new Date(releaseDate);
  const today = new Date();
  return movieDate > today;
}
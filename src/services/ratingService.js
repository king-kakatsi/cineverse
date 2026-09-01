import { getFromApi, postWithApi } from './axiosService';

const ratingService = {
  /**
   * Get a user's rating for a specific movie
   * @param {string} movieId - Movie ID
   * @param {string} userId - User ID
   * @returns {Promise<[boolean, object]>} - Tuple of [success, data]
   */
  async getRating(movieId, userId) {
    return await getFromApi(
      `ratings?movie_id=${movieId}&user_id=${userId}`
    );
  },

  /**
   * Submit or update a rating for a movie
   * @param {string} movieId - Movie ID
   * @param {string} userId - User ID
   * @param {number} rating - Rating value (1-5)
   * @returns {Promise<[boolean, object]>} - Tuple of [success, data]
   */
  async submitRating(movieId, userId, rating) {
    return await postWithApi('ratings', {
      movie_id: movieId,
      user_id: userId,
      rating
    });
  },

  /**
   * Get all ratings for a specific movie
   * @param {string} movieId - Movie ID
   * @returns {Promise<[boolean, object]>} - Tuple of [success, data]
   */
  async getAllRatings(movieId) {
    return await getFromApi(`ratings?movie_id=${movieId}`);
  }
};

export default ratingService;

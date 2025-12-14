import { getFromApi, postWithApi } from './axiosService';

const ratingService = {
  async getRating(movieId, userId) {
    return await getFromApi(
      `movies/rate?movie_id=${movieId}&user_id=${userId}`
    );
  },

  async submitRating(movieId, userId, rating) {
    return await postWithApi('movies/rate', {
      movie_id: movieId,
      user_id: userId,
      rating
    });
  },

  async getAllRatings(movieId) {
    return await getFromApi(`movies/rate?movie_id=${movieId}`);
  }
};

export default ratingService;
import {
  getFromApi,
  postWithApi,
  updateWithApi,
  deleteWithApi,
} from "./axiosService";

class MovieService {
  async getMovies(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await getFromApi(`/movies?${query}`);
  }

  async getMovieById(movieId) {
    return await getFromApi(`/movies/${movieId}`);
  }

  async addMovie(tmdbId) {
    return await postWithApi(
      "/movies",
      { tmdb_id: tmdbId },
      { successStatus: 201 }
    );
  }

  async updateMovie(movieId, data) {
    return await updateWithApi(`/movies/${movieId}`, data);
  }

  async deleteMovie(movieId) {
    return await deleteWithApi(`/movies/${movieId}`);
  }

  async fetchFromTMDB(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await getFromApi(`/movies/tmdb?${query}`);
  }

  async searchTMDB(query, page = 1) {
    return await this.fetchFromTMDB({ query, page });
  }

  async getGenres() {
    return await getFromApi("/movies/genres");
  }

  async getPersons(search = "") {
    const query = search ? `?search=${search}` : "";
    return await getFromApi(`/movies/persons${query}`);
  }

  async addToWishlist(movieId) {
    return await postWithApi("/users/wishlist", { movieId });
  }

  async removeFromWishlist(movieId) {
    return await deleteWithApi(`/users/wishlist/${movieId}`);
  }

  async getWishlist() {
    return await getFromApi("/users/wishlist");
  }

  async syncFromTMDB(type, pages) {
    return await postWithApi(
      "/movies/sync",
      { type, pages },
      { successStatus: 200, timeout: 300000 } // timeout = 5 minutes
    );
  }

  async createMovieManually(movieData) {
    return await postWithApi("/movies/manual", movieData, {
      successStatus: 201,
    });
  }

  async getAdminDashboardStats() {
    const [success, data] = await getFromApi("/admin/dashboard-stats");
    if (success) {
      // contains totalFilms, totalUsers, totalReviews, adminUsers, avgRating
      return data;
    }
    console.error("Failed to fetch admin dashboard statistics:", data);
    return {
      totalFilms: 0,
      totalUsers: 0,
      totalReviews: 0,
      // totalLocalReviews:0,
      adminUsers: 0,
      avgRating: 0,
      avgRating: 0,
      // localAvgRating: 0,
    };
  }

  async getGenreDistributionStats() {
    const [success, data] = await getFromApi("/admin/stats/genre-distribution");
    if (success) {
      return data;
    }
    console.error("Failed to fetch genre distribution stats:", data);
    return [];
  }

  async getTopRatedMovies() {
    const [success, data] = await getFromApi(`/admin/stats/top-rated`);
    if (success) {
      return data;
    }
    console.error("Failed to fetch top-rated movies:", data);
    return [];
  }

  async getUserRegistrationTrend() {
    const [success, data] = await getFromApi("/admin/stats/user-growth");
    if (success) {
      return data;
    }
    console.error("Failed to fetch user registration trend:", data);
    return [];
  }

  async getReviewSentiment() {
    const [success, data] = await getFromApi("/admin/stats/review-sentiment");
    if (success) {
      return data;
    }
    console.error("Failed to fetch review sentiment:", data);
    return [];
  }
}

const movieService = new MovieService();
export default movieService;

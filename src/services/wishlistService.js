import { getFromApi, postWithApi, deleteWithApi } from './axiosService';

class WishlistService {
  async getWishlist(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await getFromApi(`/users/wishlist?${query}`);
  }

  async addToWishlist(movieId) {
    return await postWithApi('/users/wishlist', { movieId });
  }

  async removeFromWishlist(movieId) {
    return await deleteWithApi(`/users/wishlist/${movieId}`);
  }
}

const wishListService = new WishlistService();
export default wishListService;
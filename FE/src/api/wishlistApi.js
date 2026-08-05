import axiosInstance from './axiosInstance';

const wishlistApi = {
    getWishlist: () => axiosInstance.get('/wishlist'),
    getWishlistIds: () => axiosInstance.get('/wishlist/ids'),
    toggleWishlist: (productId) => axiosInstance.post(`/wishlist/toggle/${productId}`),
};

export default wishlistApi;

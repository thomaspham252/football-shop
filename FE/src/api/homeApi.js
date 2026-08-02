import axiosInstance from "./axiosInstance";

const homeApi = {
    getAllProducts() {
        return axiosInstance.get("/product");
    },

    getNewProducts(limit = 4, sort = "desc") {
        return axiosInstance.get("/product/new-products", {
            params: { limit, sort }
        });
    },

    getBestSellingProducts(limit = 4) {
        return axiosInstance.get("/product/best-selling", {
            params: { limit }
        });
    },

    getPromotionProducts(limit = 4) {
        return axiosInstance.get("/product/hot-deal", {
            params: { limit }
        });
    }
};

export default homeApi;
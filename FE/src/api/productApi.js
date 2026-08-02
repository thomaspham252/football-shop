import axiosInstance from "./axiosInstance";

const productApi = {
    getProductDetail(id) {
        return axiosInstance.get(`/product/${id}`);
    }
};

export default productApi;

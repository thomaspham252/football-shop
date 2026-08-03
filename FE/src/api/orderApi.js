import axiosInstance from "./axiosInstance";

const orderApi = {
    validateCart(items) {
        return axiosInstance.post('/orders/cart/validate', { items });
    },
    createOrder(orderData) {
        return axiosInstance.post('/orders', orderData);
    },
    getOrder(orderId) {
        return axiosInstance.get(`/orders/${orderId}`);
    },
    initiatePayment(orderId) {
        return axiosInstance.post(`/orders/${orderId}/payment`);
    },
    applyCoupon(code, subtotal) {
        return axiosInstance.post('/coupons/apply', { code, subtotal });
    }
};

export default orderApi;

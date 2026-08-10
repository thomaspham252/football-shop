import axiosInstance from "./axiosInstance";

export const adminApi = {
  // 1. Thống kê Dashboard
  getDashboardStats: async () => {
    const response = await axiosInstance.get("/admin/dashboard");
    return response.data;
  },

  // 2. Quản lý Đơn hàng
  getOrders: async (params = {}) => {
    const response = await axiosInstance.get("/admin/orders", { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await axiosInstance.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, orderStatus, paymentStatus, note) => {
    const response = await axiosInstance.put(`/admin/orders/${id}/status`, {
      orderStatus,
      paymentStatus,
      note,
    });
    return response.data;
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    const response = await axiosInstance.put(`/admin/orders/${id}/payment-status`, {
      paymentStatus,
    });
    return response.data;
  },

  cancelOrder: async (id, reason = "") => {
    const response = await axiosInstance.post(`/admin/orders/${id}/cancel`, {
      reason,
    });
    return response.data;
  },

  // 3. Quản lý Người dùng (ROLE_ADMIN)
  getUsers: async (params = {}) => {
    const response = await axiosInstance.get("/admin/users", { params });
    return response.data;
  },

  getUserCounts: async () => {
    const response = await axiosInstance.get("/admin/users/counts");
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axiosInstance.post("/admin/users", userData);
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await axiosInstance.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await axiosInstance.put(`/admin/users/${userId}/status`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // 4. Quản lý Sản phẩm (ROLE_ADMIN & ROLE_STAFF)
  getProducts: async (params = {}) => {
    const response = await axiosInstance.get("/admin/products", { params });
    return response.data;
  },

  getProductVariants: async (params = {}) => {
    const response = await axiosInstance.get("/admin/products/variants", { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axiosInstance.get(`/admin/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axiosInstance.post("/admin/products", productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axiosInstance.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/admin/products/${id}`);
    return response.data;
  },

  deleteVariant: async (variantId) => {
    const response = await axiosInstance.delete(`/admin/products/variants/${variantId}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosInstance.get("/admin/products/categories");
    return response.data;
  },

  saveCategory: async (categoryData) => {
    const response = await axiosInstance.post("/admin/products/categories", categoryData);
    return response.data;
  },

  getBrands: async () => {
    const response = await axiosInstance.get("/admin/products/brands");
    return response.data;
  },

  saveBrand: async (brandData) => {
    const response = await axiosInstance.post("/admin/products/brands", brandData);
    return response.data;
  },

  // 5. Quản lý Tồn kho & Kiểm kê (ROLE_ADMIN & ROLE_STAFF)
  getInventory: async (params = {}) => {
    const response = await axiosInstance.get("/admin/inventory", { params });
    return response.data;
  },

  getInventoryHistory: async (params = {}) => {
    const response = await axiosInstance.get("/admin/inventory/history", { params });
    return response.data;
  },

  updateInventoryStock: async (id, data) => {
    const response = await axiosInstance.put(`/admin/inventory/${id}`, data);
    return response.data;
  },

  importInventoryStock: async (data) => {
    const response = await axiosInstance.post("/admin/inventory/import", data);
    return response.data;
  },

  // 6. BotAdmin AI Chatbot Management
  getBotStats: async (timeRange = "week") => {
    const response = await axiosInstance.get("/admin/chatbot/stats", { params: { timeRange } });
    return response.data;
  },

  getBotSessions: async (params = {}) => {
    const response = await axiosInstance.get("/admin/chatbot/sessions", { params });
    return response.data;
  },

  getBotSessionMessages: async (sessionId) => {
    const response = await axiosInstance.get(`/admin/chatbot/sessions/${sessionId}/messages`);
    return response.data;
  },

  toggleBotIntervention: async (sessionId) => {
    const response = await axiosInstance.post(`/admin/chatbot/sessions/${sessionId}/intervene`);
    return response.data;
  },

  sendBotStaffReply: async (sessionId, message) => {
    const response = await axiosInstance.post(`/admin/chatbot/sessions/${sessionId}/send`, { message });
    return response.data;
  },
};

export default adminApi;

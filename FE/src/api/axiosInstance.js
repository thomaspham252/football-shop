import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
});

// Interceptor to attach JWT token to requests if available
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
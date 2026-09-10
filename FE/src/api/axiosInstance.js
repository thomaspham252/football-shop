import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
    timeout: 10000,
});

const getStoredToken = () => {
    let token = localStorage.getItem('token')?.trim();
    while (token && ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'")))) {
        token = token.slice(1, -1).trim();
    }
    while (token && /^Bearer\s+/i.test(token)) {
        token = token.replace(/^Bearer\s+/i, '').trim();
    }
    return token;
};

// Interceptor to attach JWT token to requests if available
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getStoredToken();
        if (token && token !== 'undefined' && token !== 'null') {
            localStorage.setItem('token', token);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Pass response or reject error to caller
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

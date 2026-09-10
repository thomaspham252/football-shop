import axiosInstance from "./axiosInstance";

const authApi = {
  register(data) {
    return axiosInstance.post('/auth/register', data);
  },
  login(data) {
    return axiosInstance.post('/auth/login', data);
  },
  googleLogin(idToken) {
    return axiosInstance.post('/auth/google', { idToken });
  },
  getProfile() {
    return axiosInstance.get('/auth/profile');
  },
  updateProfile(data) {
    return axiosInstance.put('/auth/profile', data);
  },
  forgotPassword(data) {
    return axiosInstance.post('/auth/forgot-password', data);
  },
  resetPassword(data) {
    return axiosInstance.post('/auth/reset-password', data);
  }
};

export default authApi;

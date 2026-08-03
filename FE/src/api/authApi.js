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
  }
};

export default authApi;

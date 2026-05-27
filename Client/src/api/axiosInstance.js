import axios from "axios";
import useAuthStore from "../store/authStore";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach admin token automatically for protected APIs
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auto logout when token is expired or invalid
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error?.response?.status;

    if (statusCode === 401) {
      const logout = useAuthStore.getState().logout;
      logout();

      const currentPath = window.location.pathname;

      if (currentPath.startsWith("/admin") && currentPath !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
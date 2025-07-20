import axios from "axios";

export const apiUrl = "http://localhost:5000";

export const apiService = axios.create({
  baseURL: apiUrl,
  // withCredentials: true, // if using cookies
});

// Attach token automatically to Authorization header
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

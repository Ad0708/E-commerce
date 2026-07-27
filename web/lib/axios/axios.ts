import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      // Clear local authentication data
      localStorage.clear();
      
      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
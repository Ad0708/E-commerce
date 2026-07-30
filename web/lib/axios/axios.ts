import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      // Ignore automatic window redirect if endpoint is /auth/me or products
      const isAuthMe = error.config?.url?.includes("/auth/me");
      const isProducts = error.config?.url?.includes("/products");

      if (!isAuthMe && !isProducts && typeof window !== "undefined") {
        const publicPaths = ["/home", "/products", "/login", "/signup", "/forgot-password"];
        const isPublicPath = publicPaths.some((p) => window.location.pathname.startsWith(p)) || window.location.pathname.startsWith("/product/");

        if (!isPublicPath) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
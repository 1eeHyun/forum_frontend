import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const instance = axios.create({ 
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in the headers
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiRequest = async ({ method, url, data, params }) => {
  try {
    const response = await axios({ method, url, data, params });
    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Error handling for 401 and 403
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const currentPath = window.location.pathname;

    const isUnauthorized = status === 401 || status === 403;
    const isOnLoginPage = currentPath === "/";

    const ignore401Urls = ["/auth/me"];

    let shouldIgnore = false;
    try {
      const url = new URL(requestUrl, window.location.origin);
      const path = url.pathname.replace("/api", "");
      shouldIgnore = ignore401Urls.some((ignoreUrl) =>
        path === ignoreUrl || path.startsWith(ignoreUrl)
      );
    } catch (e) {
      console.error("Failed to parse request URL", e);
    }

    if (isUnauthorized && !shouldIgnore && !isOnLoginPage) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default instance;

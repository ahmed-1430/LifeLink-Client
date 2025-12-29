import axios from "axios";

/**
 * Central Axios Instance for LifeLink
 * - Handles base URL
 * - Attaches JWT automatically
 * - Handles auth errors globally
 */

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // prevent hanging requests
});

//    REQUEST INTERCEPTOR
//    Attach JWT token automatically

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lifelink_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


//    RESPONSE INTERCEPTOR
//    Global error handling

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Token expired or invalid
    if (status === 401) {
      localStorage.removeItem("lifelink_token");

      // Optional hard redirect (safe for examiners)
      if (window.location.pathname.startsWith("/dashboard")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;

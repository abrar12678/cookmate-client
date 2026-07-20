import axios from "axios";

let API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
if (!API_URL.endsWith("/api")) {
  API_URL = API_URL.replace(/\/+$/, "") + "/api";
}

export const GOOGLE_AUTH_URL = `${API_URL}/auth/google`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

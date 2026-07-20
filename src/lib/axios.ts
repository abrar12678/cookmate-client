import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const GOOGLE_AUTH_URL = `${API_URL}/auth/google`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;
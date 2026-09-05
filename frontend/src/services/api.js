import axios from "axios";

// Use environment variable if provided; in production default to Render backend URL
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.PROD) {
    return "https://sherise-backend.onrender.com/api";
  }
  return "/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 25000,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  if (req.data instanceof FormData) {
    delete req.headers["Content-Type"];
  }
  return req;
});

export default API;
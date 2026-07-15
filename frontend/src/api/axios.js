import axios from "axios";

const API = axios.create({
  baseURL: "https://mini-recruitment-system-production.up.railway.app/api",
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("rec_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
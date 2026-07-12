import axios from "axios";

const API = axios.create({
baseURL: import.meta.env.VITE_API_URL
});

API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("rec_token") ||
    sessionStorage.getItem("rec_token");

  console.log("TOKEN:", token);
  console.log("REQUEST:", config.method, config.url);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => {
    console.log("SUCCESS:", response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.log("FAILED:", error.response?.status);
    console.log(error.response?.data);
    return Promise.reject(error);
  }
);

export default API;
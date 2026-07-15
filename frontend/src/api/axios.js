import axios from "axios";

const API = axios.create({
  baseURL: "https://mini-recruitment-system-production.up.railway.app/api",
});

export default API;
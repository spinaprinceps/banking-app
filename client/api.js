import axios from "axios";

// Create an Axios instance with defaults
const API = axios.create({
  baseURL: "http://localhost:3002", // 🔹 change this for production
  withCredentials: true,            // send cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;

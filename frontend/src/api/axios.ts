// src/api/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8081", // 👈 backend Spring Boot port
  withCredentials: false,           // nếu không dùng cookie
});

// ✅ Thêm interceptor để tự inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // luôn lấy token mới nhất
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

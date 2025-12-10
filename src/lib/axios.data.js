//Chủ yếu lấy các thông tin dữ liệu cục bộ cung cấp thông tin cho web
import { CONFIG } from "@/config";
import { getToken } from "@/utils";
import axios from "axios";

export const BASE_URL = CONFIG.api.database;

// Tạo axios instance
export const instanceBase = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": CONFIG.keys.apiKey,
  },
});

// Thêm interceptor để cập nhật Authorization trước mỗi request
instanceBase.interceptors.request.use(
  (config) => {
    const { idToken } = getToken();
    if (idToken) {
      config.headers["Authorization"] = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

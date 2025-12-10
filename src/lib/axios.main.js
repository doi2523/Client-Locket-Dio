//Chủ yếu dùng cho các yêu cầu của khách truy cập và lấy dữ liệu xem trước
import { CONFIG } from "@/config";
import { getToken } from "@/utils";
import axios from "axios";

const BASE_URL = CONFIG.api.baseUrl;

// Tạo axios instance
export const instanceMain = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": CONFIG.keys.apiKey,
  },
});

// Thêm interceptor để cập nhật Authorization trước mỗi request
instanceMain.interceptors.request.use(
  (config) => {
    const { idToken } = getToken();
    if (idToken) {
      config.headers["Authorization"] = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

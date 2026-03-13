//Chủ yếu dùng cho các yêu cầu của khách truy cập và lấy dữ liệu xem trước
import { CONFIG } from "@/config";
import { getToken } from "@/utils";
import axios from "axios";

const BASE_URL = CONFIG.api.authUrl;

// meta tĩnh của app
const APP_META = {
  "x-app-author": CONFIG.app.author,
  "x-app-name": CONFIG.app.shortname,
  "x-app-client": CONFIG.app.clientVersion,
  "x-app-api": CONFIG.app.apiVersion,
  "x-app-env": CONFIG.app.env,
};

// Tạo axios instance
export const instanceAuth = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": CONFIG.keys.apiKey,
    ...APP_META,
  },
});

// Thêm interceptor để cập nhật Authorization trước mỗi request
instanceAuth.interceptors.request.use(
  (config) => {
    const { idToken } = getToken();
    if (idToken) {
      config.headers["Authorization"] = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

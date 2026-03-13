//Chủ yếu lấy các thông tin dữ liệu cục bộ cung cấp thông tin cho web
import { CONFIG } from "@/config";
import { getToken } from "@/utils";
import axios from "axios";

export const BASE_URL = CONFIG.api.data;

// meta tĩnh của app
const APP_META = {
  "x-app-author": CONFIG.app.author,
  "x-app-name": CONFIG.app.shortname,
  "x-app-client": CONFIG.app.clientVersion,
  "x-app-api": CONFIG.app.apiVersion,
  "x-app-env": CONFIG.app.env,
};

// Tạo axios instance
export const instanceBaseData = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": CONFIG.keys.apiKey,
    ...APP_META,
  },
});

// Interceptor request
instanceBaseData.interceptors.request.use(
  (config) => {
    const { idToken } = getToken();
    if (idToken) {
      config.headers["Authorization"] = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


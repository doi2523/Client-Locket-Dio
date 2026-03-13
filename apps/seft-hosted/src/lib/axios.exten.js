import { CONFIG } from "@/config";
import { getToken } from "@/utils";
import axios from "axios";

export const BASE_URL_LOCKET = CONFIG.api.extenApi;

export const instanceExten = axios.create({
  baseURL: BASE_URL_LOCKET,
  httpAgent: "http",
  httpsAgent: "https",
  timeout: 30000,
});

// Interceptor: thêm token động trước mỗi request
instanceExten.interceptors.request.use(
  (config) => {
    const { idToken } = getToken();
    if (idToken) {
      config.headers["Authorization"] = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

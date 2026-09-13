import { CONFIG } from "@/config";
import { loginHeader } from "@/constants/constrain";
import { getToken } from "@/utils";
import axios from "axios";

export const BASE_URL_LOCKET = CONFIG.api.locketApi;

export const instanceLocket = axios.create({
  baseURL: BASE_URL_LOCKET,
  httpAgent: "http",
  httpsAgent: "https",
  timeout: 30000,
});

export const instanceLocketV2 = axios.create({
  baseURL: BASE_URL_LOCKET,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...loginHeader,
  },
});

// Interceptor: thêm token động trước mỗi request
instanceLocketV2.interceptors.request.use(
  (config) => {
    const { idToken } = getToken();
    if (idToken) {
      config.headers["Authorization"] = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

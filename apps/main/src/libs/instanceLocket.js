import axios from "axios";

import { CONFIG } from "@/config";
import { loginHeader } from "@/constants/constrain";

import { getToken, saveToken } from "@/utils";
import { instanceAuth } from "./instanceAuth";

export const BASE_URL_LOCKET = CONFIG.api.locketApi;

export const instanceLocket = axios.create({
  baseURL: BASE_URL_LOCKET,
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

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

// =========================
// REQUEST
// =========================

instanceLocketV2.interceptors.request.use(
  async (config) => {
    const { idToken } = getToken();

    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// =========================
// RESPONSE
// =========================

instanceLocketV2.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // chỉ retry 1 lần
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // đang refresh -> queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return instanceLocketV2(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const { refreshToken } = getToken();

        const res = await instanceAuth.post("locket/refresh-token", {
          refreshToken,
        });
        const newIdToken = res?.data?.data?.id_token;
        const newRefreshToken = res?.data?.data?.refresh_token;

        // lưu token mới
        saveToken({
          ...getToken(),
          idToken: newIdToken,
          refreshToken: newRefreshToken,
        });

        // update default header
        instanceLocketV2.defaults.headers.Authorization = `Bearer ${newIdToken}`;

        processQueue(null, newIdToken);

        // retry request cũ
        originalRequest.headers.Authorization = `Bearer ${newIdToken}`;

        return instanceLocketV2(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // clearToken();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

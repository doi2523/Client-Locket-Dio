import axios from "axios";
import { CONFIG } from "@/config";
import { getToken, getMemberToken } from "@/utils";

// Meta của app gửi lên server
const APP_META = {
  "x-app-author": CONFIG.app.author,
  "x-app-name": CONFIG.app.shortname,
  "x-app-client": CONFIG.app.clientVersion,
  "x-app-api": CONFIG.app.apiVersion,
  "x-app-env": CONFIG.app.env,
};

// Hàm gắn headers chung
const attachHeaders = (config) => {
  const { idToken } = getToken();
  const member = getMemberToken();

  // Firebase idToken
  if (idToken) {
    config.headers["Authorization"] = `Bearer ${idToken}`;
  }

  // Member token của server bạn
  if (member?.token && member?.header) {
    config.headers[member.header] = member.token;
  }

  // App meta
  Object.assign(config.headers, APP_META);

  return config;
};

// Tạo axios instance factory
export const createHttpClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CONFIG.keys.apiKey,
    },
  });

  instance.interceptors.request.use(attachHeaders, (error) =>
    Promise.reject(error),
  );

  return instance;
};

export const createUploadClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CONFIG.keys.apiKey,
    },
  });

  instance.interceptors.request.use(attachHeaders);
  return instance;
};

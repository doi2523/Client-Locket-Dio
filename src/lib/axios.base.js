import { CONFIG } from "@/config";
import axios from "axios";

export const BASE_URL = CONFIG.api.database;

export const instanceBase = axios.create({
  baseURL: BASE_URL,
  httpAgent: "http",
  httpsAgent: "https",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": CONFIG.keys.apiKey, // ví dụ thêm x-key mặc định
  },
});

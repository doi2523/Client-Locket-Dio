//Chủ yếu lấy các thông tin dữ liệu cục bộ cung cấp thông tin cho web
import { CONFIG } from "@/config";
import { createHttpClient } from "./createBase";

const BASE_URL = CONFIG.api.data;

// Tạo axios instance
export const instanceBaseData = createHttpClient(BASE_URL);

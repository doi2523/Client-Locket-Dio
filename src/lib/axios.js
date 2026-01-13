import axios from "axios";
import { API_URL, clearLocalData, removeToken, removeUser } from "../utils";
import { CONFIG } from "@/config";
import { parseJwt } from "@/utils/auth";
import { SonnerInfo } from "@/components/ui/SonnerToast";

// ==== Kiểm tra token sắp hết hạn (dưới 5 phút) ====
let cachedExp = null;
function isTokenExpired(token) {
  if (!token) return true;

  const now = Math.floor(Date.now() / 1000);

  if (!cachedExp) {
    const payload = parseJwt(token);
    if (!payload) return true;
    cachedExp = payload.exp;
  }

  const timeLeft = cachedExp - now;

  // console.log(
  //   `⏰ Token còn lại: ${timeLeft}s (hết hạn lúc: ${new Date(
  //     cachedExp * 1000
  //   ).toLocaleString()})`
  // );

  return timeLeft < 300; // < 5 phút thì coi là sắp hết hạn
}

// ==== Biến toàn cục để tránh gọi refresh nhiều lần ====
let isRefreshing = false;
let refreshPromise = null;

// ==== Gọi API để refresh idToken (nếu cookie còn hiệu lực) ====
async function refreshIdToken() {
  try {
    const res = await axios.post(
      API_URL.REFESH_TOKEN_URL,
      {},
      { withCredentials: true }
    );
    const newToken = res?.data?.data?.id_token;
    const newLocalId = res?.data?.data?.user_id;

    if (newToken) {
      localStorage.setItem("idToken", newToken);
      localStorage.setItem("localId", newLocalId);
      cachedExp = null; // Reset lại cache khi nhận token mới
      return newToken;
    }

    return null;
  } catch (err) {
    const status = err?.response?.status;

    if (status === 401) {
      handleLogout();
    } else if (status === 429) {
      SonnerInfo("Bạn đang thao tác quá nhanh. Vui lòng thử lại sau.");
    } else {
      SonnerInfo("Lỗi máy chủ. Vui lòng thử lại sau.");
    }

    console.error("Không thể refresh idToken:", err);
    return null;
  }
}

// ==== Đăng xuất tập trung ====
function handleLogout() {
  isRefreshing = false;
  refreshPromise = null;
  cachedExp = null;

  clearLocalData();
  removeUser();
  removeToken();
  localStorage.removeItem("idToken");
  localStorage.removeItem("localId");

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

// ==== Khởi tạo axios instance ====
const api = axios.create({
  baseURL: CONFIG.api.baseUrl,
  withCredentials: true,
});

// ==== Request Interceptor ====
api.interceptors.request.use(async (config) => {
  // const requireAuth = config.requireAuth === true;

  // if (!requireAuth) {
  //   // 👉 API public, bỏ qua toàn bộ auth logic
  //   return config;
  // }

  let token = localStorage.getItem("idToken");

  if (!token) {
    // ❗ CHƯA LOGIN → KHÔNG REFRESH, KHÔNG LOGOUT
    return Promise.reject({
      status: 401,
      message: "Not authenticated",
    });
  }

  if (isTokenExpired(token)) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshIdToken();
    }

    token = await refreshPromise;

    isRefreshing = false;
    refreshPromise = null;

    if (!token) {
      handleLogout();
      return Promise.reject(new Error("Token refresh failed"));
    }
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==== Response Interceptor ====
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status || error.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.error?.message;

    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (status === 401) {
      originalRequest._retry = true;

      if (
        !originalRequest.url?.includes("refresh-token") &&
        !isRefreshing &&
        !originalRequest.skipAuthRefresh
      ) {
        isRefreshing = true;
        refreshPromise = refreshIdToken();

        try {
          const newToken = await refreshPromise;
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } else {
            handleLogout();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          handleLogout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      } else {
        handleLogout();
        SonnerInfo("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.");
        return Promise.reject(error);
      }
    }

    if (status === 403) {
      SonnerInfo(message || "Bạn không có quyền truy cập!");
    }

    if (status === 404) {
      SonnerInfo(message || "Không tìm thấy nội dung yêu cầu.");
    }
    if (status === 429) {
      SonnerInfo(
        message || "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau."
      );
    }

    if (status === 500) {
      SonnerInfo(message || "Lỗi máy chủ. Vui lòng thử lại sau.");
    }

    if (status === 502) {
      SonnerInfo(
        message || "Máy chủ phản hồi không hợp lệ. Vui lòng thử lại sau."
      );
    }

    if (status === 503) {
      SonnerInfo(
        message || "Dịch vụ hiện không khả dụng. Vui lòng quay lại sau."
      );
    }

    if (status === 504) {
      SonnerInfo(
        message || "Hết thời gian phản hồi từ máy chủ. Vui lòng thử lại sau."
      );
    }

    return Promise.reject(error);
  }
);

export default api;

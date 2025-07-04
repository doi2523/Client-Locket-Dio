import axios from "axios";
import { API_URL, clearLocalData, removeToken, removeUser } from "../utils";
import { showInfo } from "../components/Toast";

// Hàm giải mã JWT
function parseJwt(token) {
  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// Kiểm tra token sắp hết hạn (dưới 1 phút)
function isTokenExpired(token) {
  const payload = parseJwt(token);
  const now = Math.floor(Date.now() / 1000);
  return !payload || payload.exp - now < 60;
}

// Biến để track trạng thái refresh và promise
let isRefreshing = false;
let refreshPromise = null;

// Gọi API để refresh idToken (nếu cookie refreshToken còn hiệu lực)
async function refreshIdToken() {
  try {
    const res = await axios.post(
      API_URL.REFESH_TOKEN_URL,
      {},
      { withCredentials: true }
    );

    const newToken = res?.data?.data?.id_token;
    const newlocalId = res?.data?.data?.user_id;

    if (newToken) {
      localStorage.setItem("idToken", newToken);
      localStorage.setItem("localId", newlocalId);
      return newToken;
    }

    return null;
  } catch (err) {
    const status = err?.response?.status;

    if (status === 401) {
      // ❌ Phiên hết hạn thật → cần logout
      handleLogout();
    } else if (status === 429) {
      // ⚠️ Quá nhiều yêu cầu → không logout
      showInfo("Bạn đang thao tác quá nhanh. Vui lòng thử lại sau.");
    } else {
      // ❗Lỗi khác → báo lỗi nhẹ
      showInfo("Lỗi máy chủ. Vui lòng thử lại sau.");
    }

    console.error("Không thể refresh idToken:", err);
    return null;
  }
}

// Hàm logout tập trung
function handleLogout() {
  // Ngăn chặn việc gọi refresh token nữa
  isRefreshing = false;
  refreshPromise = null;

  clearLocalData();
  removeUser();
  removeToken();
  localStorage.removeItem("localId");
  localStorage.removeItem("idToken");

  // Chỉ redirect một lần và tránh loop
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

// Khởi tạo axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    // Bỏ qua nếu đang ở trang login hoặc là request refresh token
    if (
      window.location.pathname === "/login" ||
      config.url?.includes("refresh-token") ||
      config.url === API_URL.REFESH_TOKEN_URL
    ) {
      return config;
    }

    let token = localStorage.getItem("idToken");

    // Nếu không có token hoặc token hết hạn
    if (!token || isTokenExpired(token)) {
      // Nếu đang refresh, chờ kết quả
      if (isRefreshing && refreshPromise) {
        try {
          token = await refreshPromise;
        } catch (error) {
          // Nếu refresh thất bại, logout
          handleLogout();
          return Promise.reject(new Error("Token refresh failed"));
        }
      } else if (!isRefreshing) {
        // Bắt đầu refresh token
        isRefreshing = true;
        refreshPromise = refreshIdToken();

        try {
          token = await refreshPromise;
          if (!token) {
            // Nếu refresh thất bại, logout
            handleLogout();
            return Promise.reject(new Error("Token refresh failed"));
          }
        } catch (error) {
          handleLogout();
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      }
    }

    // Chỉ thêm token nếu có
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error);

    const status = error.response?.status || error.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.error?.message;
    const originalRequest = error.config;

    // Tránh retry liên tục
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (status === 401) {
      // Đánh dấu request đã retry
      originalRequest._retry = true;

      // Nếu không phải request refresh token và chưa đang refresh
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
            // Retry request với token mới
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
        // Nếu là refresh token request bị 401 hoặc đã retry
        handleLogout();
        showInfo("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.");
        return Promise.reject(error);
      }
    }

    if (status === 403) {
      showInfo("Bạn không có quyền truy cập!");
    }

    if (status === 429) {
      showInfo(
        message || "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau."
      );
    }

    return Promise.reject(error);
  }
);

export default api;

import { refreshIdToken } from "../../services";
import { getRefreshToken } from "./cookie";

// Lưu vào storage với thời gian hết hạn
export const setAuthStorage = (idToken, localId, type = "local", expiresAt) => {
  const storage = type === "local" ? localStorage : sessionStorage;
  storage.setItem("idToken", idToken);
  storage.setItem("localId", localId);
  storage.setItem("expiresAt", expiresAt.toString());
};

// Lấy thông tin token
export const getAuthStorage = () => {
  const storage =
    localStorage.getItem("idToken") !== null ? localStorage : sessionStorage;
  return {
    idToken: storage.getItem("idToken"),
    localId: storage.getItem("localId"),
    expiresAt: parseInt(storage.getItem("expiresAt")),
  };
};
// Xoá token khỏi cả localStorage và sessionStorage
export const clearAuthStorage = () => {
  localStorage.removeItem("idToken");
  localStorage.removeItem("localId");
  localStorage.removeItem("expiresAt");

  sessionStorage.removeItem("idToken");
  sessionStorage.removeItem("localId");
  sessionStorage.removeItem("expiresAt");
};

// Kiểm tra token và tự xin lại nếu gần hết hạn
export const checkAndRefreshToken = async () => {
  const { idToken, localId, expiresAt } = getAuthStorage();

  if (!idToken || !localId) return null;

  const currentTime = Date.now();
  const isExpired = !expiresAt || currentTime >= expiresAt;

  if (!isExpired) return { idToken, localId };

  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const newTokenData = await refreshIdToken(refreshToken);
    if (!newTokenData?.idToken) return null;

    const newExpiresAt = Date.now() + 3600 * 1000; // 1 giờ
    setAuthStorage(
      newTokenData.idToken,
      newTokenData.localId,
      "local",
      newExpiresAt
    );
    setAuthCookies(newTokenData.idToken, newTokenData.localId);
    saveUser(newTokenData);

    return {
      idToken: newTokenData.idToken,
      localId: newTokenData.localId,
    };
  } catch (err) {
    return null;
  }
};

const storage = {
  set(key, value, rememberMe) {
    const target = rememberMe ? localStorage : sessionStorage;
    target.setItem(key, value);
  },

  get(key) {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  },

  remove(key) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};

// Lưu rememberMe vào localStorage để tái sử dụng
export function saveToken(
  { idToken, refreshToken, localId },
  rememberMe
) {
  const finalRememberMe = rememberMe ?? (storage.get("rememberMe") === "true");

  // Nếu rememberMe được truyền, lưu lại vào localStorage
  if (rememberMe !== undefined) {
    localStorage.setItem("rememberMe", rememberMe);
  }

  storage.set("idToken", idToken, finalRememberMe);
  storage.set("refreshToken", refreshToken, finalRememberMe);
  storage.set("localId", localId, finalRememberMe);
}

export function getToken() {
  const idToken = storage.get("idToken"); // có thể null nếu hết hạn
  const refreshToken = storage.get("refreshToken");
  const localId = storage.get("localId");

  if (!refreshToken || !localId) return null;

  return { idToken, refreshToken, localId }; // ⚠️ idToken có thể null (hợp lệ)
}

export function removeToken() {
  storage.remove("idToken");
  storage.remove("refreshToken");
  storage.remove("localId");
  localStorage.removeItem("rememberMe");
}
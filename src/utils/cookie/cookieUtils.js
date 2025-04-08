// cookies.js

// Hàm đặt cookie
export const setCookie = (name, value, maxAgeSeconds = 3600) => {
  document.cookie = `${name}=${value}; path=/; Secure; SameSite=None; max-age=${maxAgeSeconds}`;
};

// Hàm lấy giá trị cookie theo tên
export const getCookie = (name) => {
  const nameEQ = name + "=";
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
};

// Hàm xóa cookie
export const deleteCookie = (name) => {
  document.cookie = `${name}=; path=/; max-age=0; Secure; SameSite=None`;
};

// Lấy cả idToken & localId từ cookie
export const getAuthCookies = () => ({
  idToken: getCookie("idToken"),
  localId: getCookie("localId"),
});

// ✅ Hàm lưu cookie với giá trị mặc định là 1 giờ (3600 giây)
export const setAuthCookies = (
  idToken,
  localId,
  expiresInSeconds = 3600
) => {
  setCookie("idToken", idToken, expiresInSeconds);
  setCookie("localId", localId, expiresInSeconds);
};

// Xóa cookies
export const clearAuthCookies = () => {
  deleteCookie("idToken");
  deleteCookie("localId");
};

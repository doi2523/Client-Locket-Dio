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

// Lưu refreshToken (7 ngày mặc định)
export const setRefreshTokenCookie = (
  refreshToken,
  expiresInSeconds = 7 * 24 * 60 * 60
) => {
  setCookie("refreshToken", refreshToken, expiresInSeconds);
};

// Lấy refreshToken từ cookie
export const getRefreshToken = () => getCookie("refreshToken");

// Xóa refreshToken cookie
export const deleteRefreshToken = () => {
  deleteCookie("refreshToken");
};

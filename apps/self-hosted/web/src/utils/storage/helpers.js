export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

const USER_KEY = "userData";

export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem(USER_KEY)) || null;
export const removeUser = () => localStorage.removeItem(USER_KEY);

const TOKEN_KEY = "idToken";
const LOCAL_ID_KEY = "localId";
const TOKEN_EXPIRY_KEY = "expiresIn";

// Lưu thông tin đăng nhập vào sessionStorage
export const saveAuthData = (idToken, localId, expiresIn) => {
  sessionStorage.setItem(TOKEN_KEY, idToken);
  sessionStorage.setItem(LOCAL_ID_KEY, localId);
  sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiresIn);
};
// Kiểm tra token có còn hạn không
export const isTokenValid = () => {
  const expiresIn = parseInt(sessionStorage.getItem(TOKEN_EXPIRY_KEY), 10);
  if (!expiresIn) return false;
  return Date.now() < expiresIn; // Nếu thời gian hiện tại < expiry thì token còn hạn
};
// Lấy token từ sessionStorage
export const getAuthToken = () => sessionStorage.getItem(TOKEN_KEY) || null;

// Lấy localId từ sessionStorage
export const getLocalId = () => sessionStorage.getItem(LOCAL_ID_KEY) || null;

// Xóa dữ liệu đăng nhập
export const clearAuthData = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(LOCAL_ID_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
};
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return now > exp;
  } catch (e) {
    return true;
  }
};

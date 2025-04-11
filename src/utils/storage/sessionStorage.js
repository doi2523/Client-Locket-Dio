// Kiểm tra môi trường browser
const isBrowser = typeof window !== "undefined";

// Key mặc định
const ID_TOKEN_KEY = "idToken";

// Lưu token tùy vào trạng thái rememberMe
export const saveIdToken = (token, rememberMe) => {
  if (!isBrowser) return;
  if (rememberMe) {
    localStorage.setItem(ID_TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(ID_TOKEN_KEY, token);
  }
};

// Lấy token từ nơi có
export const getIdToken = () => {
  if (!isBrowser) return null;
  return (
    localStorage.getItem(ID_TOKEN_KEY) ||
    sessionStorage.getItem(ID_TOKEN_KEY)
  );
};

// Xóa token
export const clearIdToken = () => {
  if (!isBrowser) return;
  localStorage.removeItem(ID_TOKEN_KEY);
  sessionStorage.removeItem(ID_TOKEN_KEY);
};

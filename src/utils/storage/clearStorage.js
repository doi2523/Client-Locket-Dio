// storageUtils.js

import { removeToken } from "./storage";

export const clearLocalData = () => {
  try {
    //Xoá dữ liệu xác thực: idToken, refreshToken, localId
    removeToken();
    // Xoá các key liên quan đến đăng nhập / context
    localStorage.removeItem("friendsList");
    localStorage.removeItem("friendDetails");
    localStorage.removeItem("userPlan");

    // (Không nên xoá toàn bộ cookie nếu không thật cần)
    // Xoá cookie cụ thể nếu biết tên
    // document.cookie =
    //   "refreshToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  } catch (e) {
    console.error("❌ Lỗi khi xoá dữ liệu local:", e);
  }
};

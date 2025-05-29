import { getToken } from "../storage";
import { checkAndRefreshIdTokenV2 } from "./checkAndRefreshToken";

// Lấy idToken và uid từ user hiện tại
export const getCurrentUserTokenAndUid = async () => {
  // Lấy token
  const { idToken, localId, refreshToken } = getToken() || {};
  if (!idToken || !localId) {
    showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    return null;
  }
  // Kiểm tra và làm mới token nếu cần
  const response = await checkAndRefreshIdTokenV2(idToken, refreshToken);
  return {
    idToken: response.idToken || idToken,
    localId: response.localId || localId,
    refreshToken: response.refreshToken || refreshToken,
  };
};

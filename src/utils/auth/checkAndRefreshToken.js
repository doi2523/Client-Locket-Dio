import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_URL } from "../API/apiRoutes";
import * as utils from "."; // hoặc đường dẫn đúng tới utils

/**
 * Kiểm tra idToken và tự động refresh nếu gần hết hạn
 * @param {string} idToken - JWT token hiện tại
 * @param {string} refreshToken - Firebase refreshToken
 * @param {number} bufferSeconds - Thời gian "dự phòng" (mặc định 5 phút)
 * @returns {Promise<string>} idToken mới nếu được refresh, hoặc cũ nếu vẫn còn hạn
 */
export const checkAndRefreshIdToken = async (
  idToken,
  refreshToken,
  bufferSeconds = 300
) => {
  if (!idToken || typeof idToken !== "string") return null;

  const parts = idToken.split(".");
  if (parts.length !== 3) {
    console.error("❌ idToken không đúng định dạng JWT:", idToken);
    return null;
  }

  try {
    const decoded = jwtDecode(idToken);
    if (!decoded.exp) return null;

    const currentTime = Date.now() / 1000;
    const timeLeft = decoded.exp - currentTime;

    console.log(
      `⏳ Token còn hạn khoảng ${Math.max(0, Math.floor(timeLeft))} giây`
    );

    if (decoded.exp > currentTime + bufferSeconds) {
      return idToken; // Token còn đủ hạn dùng
    }

    // Token sắp hết hạn → gọi refresh
    console.log("🔄 Token sắp hết hạn, đang gọi refresh...");
    const res = await axios.post(API_URL.REFESH_TOKEN_URL, {
      refreshToken,
    });

    const updatedTokens = {
      idToken: res?.data?.id_token,
      refreshToken: res?.data?.refresh_token || refreshToken,
    };

    utils.saveToken(updatedTokens);
    return updatedTokens.idToken;
  } catch (err) {
    console.error("❌ Lỗi khi kiểm tra hoặc refresh token:", err);
    return null;
  }
};

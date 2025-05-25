import { jwtDecode } from "jwt-decode";

/**
 * Kiểm tra idToken còn hạn không
 * @param {string} idToken - JWT token được cấp bởi Firebase
 * @param {number} bufferSeconds - Thời gian "dự phòng" (mặc định 5 phút)
 * @returns {boolean} true nếu hết hạn hoặc không hợp lệ, false nếu vẫn còn hạn
 */
export function isIdTokenExpired(idToken, bufferSeconds = 300) {
  if (!idToken || typeof idToken !== "string") return true;

  // Kiểm tra định dạng token JWT: phải có 3 phần cách nhau bởi dấu '.'
  const parts = idToken.split(".");
  if (parts.length !== 3) {
    console.error("❌ idToken không đúng định dạng JWT:", idToken);
    return true;
  }

  try {
    const decoded = jwtDecode(idToken);
    if (!decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    const timeLeft = decoded.exp - currentTime;

    console.log(
      `⏳ Token còn hạn khoảng ${Math.max(0, Math.floor(timeLeft))} giây`
    );

    return decoded.exp < currentTime + bufferSeconds;
  } catch (err) {
    console.error("❌ Không thể decode idToken:", err);
    return true;
  }
}


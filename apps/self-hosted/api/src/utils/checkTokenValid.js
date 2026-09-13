const jwt = require("jsonwebtoken");

/**
 * Kiểm tra idToken còn hạn hay không
 * @param {string} idToken - Firebase ID Token
 * @returns {{ valid: boolean, message?: string }}
 */
function checkTokenValid(idToken) {
  if (!idToken) {
    return { valid: false, message: "Thiếu idToken!" };
  }

  const decoded = jwt.decode(idToken);
  const now = Math.floor(Date.now() / 1000);

  if (!decoded || !decoded.exp) {
    return { valid: false, message: "Token không hợp lệ!" };
  }

  if (decoded.exp < now) {
    return { valid: false, message: "Token đã hết hạn!" };
  }

  return { valid: true };
}

module.exports = { checkTokenValid };

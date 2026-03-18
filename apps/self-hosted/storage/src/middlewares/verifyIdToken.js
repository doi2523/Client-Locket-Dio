const jwt = require("jsonwebtoken");
const { logInfo, logSuccess } = require("../utils/logEventUtils");

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

const verifyIdToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Thiếu Authorization" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    // Bước 1: kiểm tra token hợp lệ (nếu có hàm checkTokenValid riêng)
    const { valid, message } = checkTokenValid(idToken);
    if (!valid) {
      logInfo("verifyIdToken", `❌ Token validation failed: ${message}`);
      return res.status(401).json({ message });
    }

    // Bước 2: decode idToken để lấy thông tin người dùng
    const payloadBase64 = idToken.split(".")[1];
    const decodedPayload = JSON.parse(
      Buffer.from(payloadBase64, "base64").toString("utf-8")
    );

    // Bước 3: Ghi log và gán vào req.user
    logSuccess(
      "verifyIdToken",
      `✅ Authenticated: ${decodedPayload.email} (${decodedPayload.user_id})`
    );

    req.user = {
      idToken, // token gốc
      localId: decodedPayload.user_id || decodedPayload.uid,
      uid: decodedPayload.user_id || decodedPayload.uid,
      email: decodedPayload.email,
      name: decodedPayload.name,
      picture: decodedPayload.picture,
      exp: decodedPayload.exp,
      iat: decodedPayload.iat,
    };
    next();
  } catch (error) {
    console.error("❌ Token không hợp lệ:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = {
  verifyIdToken,
};

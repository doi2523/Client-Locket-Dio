const { checkTokenValid } = require("../utils/checkTokenValid");
const { logInfo, logSuccess } = require("../utils/logEventUtils");

const verifyIdToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
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
      Buffer.from(payloadBase64, "base64").toString("utf-8"),
    );

    // Bước 3: Ghi log và gán vào req.user
    logSuccess(
      "verifyIdToken",
      `✅ Authenticated: ${decodedPayload?.email} ${decodedPayload?.phone_number} (${decodedPayload.user_id})`,
    );
    // console.log(decodedPayload);

    req.user = {
      idToken, // token gốc
      localId: decodedPayload.user_id || decodedPayload.uid,
      uid: decodedPayload.user_id || decodedPayload.uid,
      email: decodedPayload?.email,
      phone: decodedPayload?.phone_number,
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

/**
 * Kiểm tra idToken còn hạn không (client-side)
 * @param {string} idToken - Firebase ID Token
 * @returns {{ valid: boolean, message?: string, payload?: object }}
 */
export function checkTokenValid(idToken) {
  if (!idToken) {
    return { valid: false, message: "Thiếu idToken!" };
  }
  try {
    const payloadBase64 = idToken.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    if (!decodedPayload.exp) {
      return { valid: false, message: "Token không hợp lệ!" };
    }
    if (decodedPayload.exp < now) {
      return { valid: false, message: "Token đã hết hạn!" };
    }

    return { valid: true, payload: decodedPayload };
  } catch (err) {
    return { valid: false, message: "Không thể giải mã token!" };
  }
}

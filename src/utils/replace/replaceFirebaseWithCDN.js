/**
 * Thay thế host từ firebase storage sang CDN LocketCamera
 * @param {string} url - URL gốc firebase storage
 * @returns {string} - URL đã đổi sang CDN
 */
export function replaceFirebaseWithCDN(url) {
  if (!url) return "";
  return url.replace(
    "https://firebasestorage.googleapis.com",
    "https://cdn.locketcamera.com"
  );
}

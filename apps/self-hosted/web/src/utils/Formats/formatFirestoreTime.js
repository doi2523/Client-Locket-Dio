/**
 * Format Firestore Timestamp sang chuỗi thời gian theo locale vi-VN.
 *
 * @param {Object} ts - Firestore Timestamp object
 * @param {number} ts._seconds - Số giây kể từ Unix epoch
 * @param {number} ts._nanoseconds - Số nano giây
 * @param {Object} [options] - Tuỳ chọn format thêm cho toLocaleString
 *
 * @returns {string} Chuỗi thời gian đã format (VD: 22/01/2026, 19:57:00)
 *
 * Ví dụ:
 * formatFirestoreTime(item.viewedAt)
 * formatFirestoreTime(item.viewedAt, { dateStyle: "short" })
 */
export function formatFirestoreTime(ts, options) {
  if (!ts || !ts._seconds) return "";

  const date = new Date(ts._seconds * 1000 + (ts._nanoseconds || 0) / 1e6);

  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
    ...options,
  });
}

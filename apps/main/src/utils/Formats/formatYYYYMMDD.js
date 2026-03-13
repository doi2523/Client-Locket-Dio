/**
 * Chuyển Date → số dạng YYYYMMDD
 * Ví dụ:
 *   new Date("2025-12-31") → 20251231
 *
 * Dùng để:
 * - So sánh ngày (streak, cache, version data…)
 * - Tránh lệch giờ khi chỉ quan tâm đến ngày
 *
 * @param {Date} date - Ngày cần format (mặc định là ngày hiện tại)
 * @returns {number}  - Ngày ở dạng YYYYMMDD
 */
export const formatYYYYMMDD = (date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return Number(`${yyyy}${mm}${dd}`);
};


/**
 * Cộng số ngày vào một chuỗi YYYYMMDD
 * @param {string} yyyymmdd - Ví dụ: "20260110"
 * @param {number} days - số ngày muốn cộng
 * @returns {string} YYYYMMDD mới
 */
export function addDaysToYYYYMMDD(yyyymmdd, days) {
  if (!yyyymmdd) return null;

  // Ép kiểu về string để dùng slice
  const str = String(yyyymmdd);

  const year = parseInt(str.slice(0, 4), 10);
  const month = parseInt(str.slice(4, 6), 10) - 1; // JS month 0-index
  const day = parseInt(str.slice(6, 8), 10);

  const date = new Date(year, month, day);
  date.setDate(date.getDate() + days);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}${mm}${dd}`;
}

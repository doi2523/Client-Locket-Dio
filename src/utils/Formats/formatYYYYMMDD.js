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

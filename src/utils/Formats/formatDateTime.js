export const formatDateTime = (isoString) => {
  const date = new Date(isoString);

  // ví dụ format thành dd/MM/yyyy HH:mm:ss
  const pad = (n) => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// utils/date.ts hoặc date.js
export function getWeekdayFromFirestore(timestamp) {
  if (!timestamp?._seconds) return "";

  const date = new Date(timestamp._seconds * 1000);
  const day = date.getDay(); // 0 = CN, 1 = T2, ...

  const map = [
    "Chủ nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];

  return map[day];
}

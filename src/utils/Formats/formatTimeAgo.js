export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";

  const now = new Date();
  const target = new Date(timestamp);
  const diffMs = now.getTime() - target.getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 3) return `${diffDays} ngày trước`;

  const day = target.getDate();
  const month = target.getMonth() + 1;
  const year = target.getFullYear();

  // ✅ Nếu cùng năm thì chỉ hiển thị "6 thg 8"
  if (year === now.getFullYear()) {
    return `${day} thg ${month}`;
  }

  // ✅ Nếu khác năm thì hiện "ngày 6 thg 8, 2024"
  return `ngày ${day} thg ${month}, ${year}`;
};

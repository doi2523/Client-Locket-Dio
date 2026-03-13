// 📦 Lấy dữ liệu từ localStorage theo key
export const getLocalStorageData = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`❌ Lỗi khi đọc localStorage key="${key}":`, error);
    return defaultValue;
  }
};

// 👤 Lấy user từ friendDetails theo uid
export const getUserFromFriendDetails = (uid) => {
  if (!uid) return null;

  // lấy friendDetails trước
  const friendDetails = getLocalStorageData("friendDetails", []);
  if (!Array.isArray(friendDetails)) return null;

  // tìm user trong danh sách
  const user = friendDetails.find((user) => user.uid === uid) || null;
  return user;
};
// cache/momentDB.js
import Dexie from "dexie";

export const momentDB = new Dexie("LocketMomentDB");

momentDB.version(1).stores({
  moments: "id, user, date", // id là primary key
});
//Nhập dữ liệu mảng vào indexdb
export const bulkAddMoments = async (moments) => {
  try {
    // Sắp xếp theo ngày mới nhất trước
    const sortedMoments = [...moments].sort((a, b) => {
      return new Date(b.date) - new Date(a.date); // DESC
    });

    await momentDB.moments.bulkPut(sortedMoments);
    console.log(`💾 Đã lưu ${sortedMoments.length} moments vào cache`);
  } catch (err) {
    console.error("❌ Lỗi khi lưu bulk moments:", err);
  }
};

// Optional: Thêm hàm tiện ích
export const addMoment = async (moment) => {
  try {
    await momentDB.moments.put(moment);
  } catch (err) {
    console.error("❌ Lỗi khi lưu moment:", err);
  }
};

export const getAllMoments = async () => {
  return await momentDB.moments.toArray();
};

export const getMomentsByUser = async (userId) => {
  return await momentDB.moments.where("user").equals(userId).toArray();
};

export const clearMoments = async () => {
  await momentDB.moments.clear();
};
//Lấy 10 moment mới nhất
export const getLatestMoments = async (limit = 10) => {
  return await momentDB.moments
    .orderBy("date")
    .reverse()
    .limit(limit)
    .toArray();
};

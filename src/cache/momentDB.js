// cache/momentDB.js
import Dexie from "dexie";

export const momentDB = new Dexie("LocketMomentDB");

momentDB.version(1).stores({
  moments: "id, user, date", // id là primary key
});
//Nhập dữ liệu mảng vào indexdb
const MAX_MOMENTS_CACHE = 1000; // Giới hạn cache tối đa

export const bulkAddMoments = async (moments) => {
  try {
    // Sắp xếp bài mới nhất trước
    const sortedMoments = [...moments].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    await momentDB.moments.bulkPut(sortedMoments);
    // console.log(`💾 Đã lưu ${sortedMoments.length} moments vào cache`);

    // Sau khi lưu, kiểm tra tổng số lượng
    const total = await momentDB.moments.count();

    if (total > MAX_MOMENTS_CACHE) {
      const excess = total - MAX_MOMENTS_CACHE;

      // Lấy danh sách ID của những bài cũ nhất để xoá
      const oldMoments = await momentDB.moments
        .orderBy("date")
        .limit(excess)
        .toArray();

      const idsToDelete = oldMoments.map((item) => item.id);
      await momentDB.moments.bulkDelete(idsToDelete);

      // console.log(`🧹 Đã xoá ${excess} moments cũ để giữ trong giới hạn ${MAX_MOMENTS_CACHE}`);
    }
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

// Lấy moment theo id
export const getMomentById = async (id) => {
  try {
    const moment = await momentDB.moments.get(id);
    return moment || null; // trả về null nếu không tìm thấy
  } catch (err) {
    console.error("❌ Lỗi khi lấy moment theo id:", err);
    return null;
  }
};

//Lấy 10 moment mới nhất
export const getLatestMoments = async (limit = 10) => {
  return await momentDB.moments
    .orderBy("date")
    .reverse()
    .limit(limit)
    .toArray();
};

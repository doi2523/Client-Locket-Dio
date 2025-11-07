import Dexie from "dexie";

const db = new Dexie("LocketDioDB");

db.version(1).stores({
  friendIds: "uid, createdAt", // uid là primary key
  friendDetails: "uid, username, badge, isCelebrity",
  moments: "id, user, date",
  conversations: " uid, with_user, update_time",
  conversationWithUser: "uid, with_user, update_time",
});

export default db;

// Xoá toàn bộ database (mọi bảng)
export async function clearAllDB() {
  try {
    await db.delete(); // Xoá hoàn toàn database khỏi IndexedDB
    console.log("🔥 Deleted entire LocketDioDB");
  } catch (err) {
    console.error("❌ Failed to delete DB:", err);
  }
}
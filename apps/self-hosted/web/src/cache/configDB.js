import Dexie from "dexie";

// 👉 Khởi tạo lại DB
export function createLocketDioDB() {
  const db = new Dexie("LocketDioDB");

  db.version(1).stores({
    meta: "&key",
    friendIds: "uid, createdAt", // uid là primary key
    friendDetails: "uid, username, badge, isCelebrity",
    moments: "id, user, date",
    conversations: "uid, with_user, update_time",
    messages: "id, uid, update_time, [uid+update_time]",
    rollcalls: "uid, user, week_of_year, create_time",
    viewedMoments: "id, user, viewedAt"
  });

  return db;
}
// 👉 Tạo instance ban đầu
let db = createLocketDioDB();

export default db;

// Xoá toàn bộ database (mọi bảng)
export async function clearAllDB() {
  try {
    await Promise.all(
      db.tables.map((table) => table.clear())
    );
    console.log("🧹 Cleared all tables (DB still exists)");
  } catch (err) {
    console.error("❌ Failed to delete DB:", err);
  }
}

export async function setDBOwner(uid) {
  await db.meta.put({
    key: "owner",
    uid,
    author: "Dio",
    createdAt: Date.now(),
  });
}

export async function ensureDBOwner(currentUid) {
  const owner = await db.meta.get("owner");

  if (!owner || owner.uid !== currentUid) {
    console.warn("⚠️ DB owner mismatch → clearing DB");
    await clearAllDB();
    await setDBOwner(currentUid);    // set owner mới
  }
}

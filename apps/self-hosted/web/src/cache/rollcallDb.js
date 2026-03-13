import db from "./configDB";

const rollcallDB = db;

export async function saveRollcalls(raw = []) {
  const data = raw.map((r) => ({
    uid: r.uid,
    user: r.user,
    week_of_year: r.week_of_year,
    created_at: r.created_at._seconds * 1000,

    // 🔥 để nguyên
    items: r.items,
    comments: r.comments,
    tagged_users: r.tagged_users,
  }));

  await rollcallDB.rollcalls.bulkPut(data);
}

import Dexie from "dexie";

// ===== Diary DB setup =====
const diaryDB = new Dexie("DiaryDB");

diaryDB.version(1).stores({
  // lưu friendId đã bị xoá khỏi danh sách bạn bè
  removedFriends: "uid, removedAt",
});

export const addRemovedFriend = async (uid) => {
  await diaryDB.removedFriends.put({
    uid,
    removedAt: Date.now(),
  });
};

export const getRemovedFriends = async () => {
  return await diaryDB.removedFriends.toArray();
};

export const isFriendRemoved = async (uid) => {
  const record = await diaryDB.removedFriends.get(uid);
  return !!record;
};

export const clearRemovedFriends = async () => {
  await diaryDB.removedFriends.clear();
};

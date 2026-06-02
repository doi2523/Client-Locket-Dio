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

export const cleanupRemovedFriends = async (currentFriendIds = []) => {
  const removed = await diaryDB.removedFriends.toArray();

  const friendSet = new Set(currentFriendIds);

  const valid = [];
  const needDelete = [];

  for (const item of removed) {
    if (friendSet.has(item.uid)) {
      needDelete.push(item.uid);
    } else {
      valid.push(item);
    }
  }

  if (needDelete.length) {
    await Promise.all(
      needDelete.map((uid) => diaryDB.removedFriends.delete(uid)),
    );
  }

  return valid;
};

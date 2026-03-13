// src/store/friend/friend.sync.js
import {
  getFriendIds,
  getAllFriendDetails,
  setFriendDetailsBulk,
  putNewFriendId,
  removeFriendToCache,
} from "@/cache/friendsDB";
import { addRemovedFriend } from "@/cache/diaryDB";
import { getListIdFriends, loadFriendDetailsV3 } from "@/services";
import { diffFriendIds } from "./friend.diff";

export const syncFriendsWithServer = async () => {
  let localDetails = await getAllFriendDetails();

  // [{ uid, hidden, sharedHistoryOn, isCelebrity, createdAt, updatedAt }]
  const apiFriends = await getListIdFriends();

  if (!apiFriends || apiFriends.length === 0) {
    return {
      details: localDetails,
      friendRelationsMap: {},
    };
  }

  // 👉 build friendRelationsMap full data
  const friendRelationsMap = Object.fromEntries(
    apiFriends.map((f) => [
      f.uid,
      {
        hidden: f.hidden ?? false,
        sharedHistoryOn: f.sharedHistoryOn ?? null,
        isCelebrity: f.isCelebrity ?? false,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      },
    ])
  );

  const cachedIds = await getFriendIds();
  const { newIds, removedIds } = diffFriendIds(apiFriends, cachedIds);

  // REMOVE
  if (removedIds.length > 0) {
    for (const f of removedIds) {
      await removeFriendToCache(f.uid);
      await addRemovedFriend(f.uid);
    }

    const removedSet = new Set(removedIds.map((f) => f.uid));

    localDetails = localDetails.filter(
      (f) => !removedSet.has(f.uid)
    );

    // remove khỏi relation map luôn cho sạch
    for (const uid of removedSet) {
      delete friendRelationsMap[uid];
    }
  }

  // ADD
  if (newIds.length > 0) {
    await putNewFriendId(newIds);

    const newDetails = await loadFriendDetailsV3(newIds);
    if (newDetails?.length > 0) {
      localDetails = [...localDetails, ...newDetails];
      await setFriendDetailsBulk(localDetails);
    }
  }

  return {
    details: localDetails,
    friendRelationsMap,
  };
};
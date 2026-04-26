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
import { diffFriendIds } from "./diffFriendIds";

export const syncFriendsWithServer = async () => {
  let localDetails = await getAllFriendDetails();

  try {
    const apiFriends = await getListIdFriends();

    // ❗ fallback nếu API rỗng hoặc fail logic
    if (!apiFriends || apiFriends.length === 0) {
      return {
        details: localDetails,
        friendRelationsMap: buildLocalRelations(localDetails),
        isFallback: true,
      };
    }

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
      ]),
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

      localDetails = localDetails.filter((f) => !removedSet.has(f.uid));

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
      isFallback: false,
    };
  } catch (err) {
    console.error("sync failed → fallback local", err);

    return {
      details: localDetails,
      friendRelationsMap: buildLocalRelations(localDetails),
      isFallback: true,
    };
  }
};

// helper
const buildLocalRelations = (localDetails) => {
  const map = {};
  for (const f of localDetails) {
    map[f.uid] = {
      hidden: f.hidden ?? false,
      sharedHistoryOn: f.sharedHistoryOn ?? null,
      isCelebrity: f.isCelebrity ?? false,
      createdAt: f.createdAt ?? 0,
      updatedAt: f.updatedAt ?? null,
    };
  }
  return map;
};

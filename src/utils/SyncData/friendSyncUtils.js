import db from "@/cache/configDB";
import {
  getFriendIds,
  getAllFriendDetails,
  setFriendDetailsBulk,
  deleteFriendId,
  deleteFriendDetail,
} from "@/cache/friendsDB";
import { getListIdFriends, loadFriendDetailsV3 } from "@/services";

/**
 * Đồng bộ danh sách bạn bè ID giữa API và DB
 */
export const syncFriendsWithCache = async (apiFriends) => {
  try {
    const cachedIds = await getFriendIds();
    const cachedMap = new Map(cachedIds.map((f) => [f.uid, f]));

    const apiUids = new Set(apiFriends.map((f) => f.uid));
    const cachedUids = new Set(cachedIds.map((f) => f.uid));

    const newFriends = apiFriends.filter((f) => !cachedMap.has(f.uid));
    const removedFriends = cachedIds.filter((f) => !apiUids.has(f.uid));

    if (newFriends.length > 0) {
      await db.friendIds.bulkPut(newFriends);
    }
    if (removedFriends.length > 0) {
      for (const f of removedFriends) {
        await deleteFriendId(f.uid);
        await deleteFriendDetail(f.uid);
      }
    }

    return { newFriends, removedFriends };
  } catch (err) {
    console.error("❌ syncFriendsWithCache error:", err);
    return { newFriends: [], removedFriends: [] };
  }
};

/**
 * Đồng bộ toàn bộ friend detail (fetch mới cho bạn mới, xoá bạn cũ khỏi cache)
 */
export const fetchAndSyncFriendDetails = async () => {
  try {
    // 1. Lấy danh sách bạn từ API
    const apiFriends = await getListIdFriends();
    if (!apiFriends?.length) {
      await setFriendDetailsBulk([]);
      return [];
    }

    // 2. Đồng bộ ID với cache
    const { newFriends, removedFriends } = await syncFriendsWithCache(
      apiFriends
    );

    // 3. Lấy cache details
    let cachedDetails = await getAllFriendDetails();

    // 4. Fetch thêm detail cho friend mới
    if (newFriends.length > 0) {
      const freshDetails = await loadFriendDetailsV3(newFriends);
      if (freshDetails?.length > 0) {
        cachedDetails = [...cachedDetails, ...freshDetails];
        await setFriendDetailsBulk(cachedDetails);
      }
    }

    // 5. Xoá friend bị remove khỏi cache
    if (removedFriends.length > 0) {
      const removedUids = new Set(removedFriends.map((f) => f.uid));
      cachedDetails = cachedDetails.filter((f) => !removedUids.has(f.uid));
    }

    return cachedDetails;
  } catch (error) {
    console.error("❌ fetchAndSyncFriendDetails error:", error);
    return [];
  }
};

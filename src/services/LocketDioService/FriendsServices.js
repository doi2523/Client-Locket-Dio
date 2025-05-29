import axios from "axios";
import * as utils from "../../utils";

export const getListIdFriends = async () => {
  // Đợi lấy token & uid
  const auth = await utils.getCurrentUserTokenAndUid();;

  if (!auth) {
    console.error("Không lấy được token và uid hiện tại.");
    return [];
  }

  const { idToken, localId, refreshToken } = auth;

  try {
    const res = await axios.post(utils.API_URL.GET_LIST_FRIENDS_URL, {
      idToken, // gửi đúng tên biến
      localId,
    });

    const allFriends = res?.data?.data || [];

    const cleanedFriends = allFriends.map((friend) => ({
      uid: friend.uid,
      createdAt: friend.date,
    }));

    sessionStorage.setItem("friendsList", JSON.stringify(cleanedFriends));

    return cleanedFriends;
  } catch (err) {
    console.error("❌ Lỗi khi gọi API get-friends:", err);
    return [];
  }
};

export const getListRequestFriend = async (
  pageToken = null
) => {
      // Đợi lấy token & uid
  const auth = await utils.getCurrentUserTokenAndUid();;

  if (!auth) {
    console.error("Không lấy được token và uid hiện tại.");
    return [];
  }

  const { idToken, localId, refreshToken } = auth;

  try {
    const res = await axios.post(utils.API_URL.GET_INCOMING_URL, {
      idToken,
      localId,
      pageToken,
    });

    const friends = res?.data?.data || [];
    const cleanedFriends = friends.map((friend) => ({
      uid: friend.uid,
      createdAt: friend.date,
    }));

    const next = res?.data?.data?.nextPageToken || null;

    return {
      friends: cleanedFriends,
      nextPageToken: next,
    };
  } catch (err) {
    console.error("❌ Lỗi khi gọi API get-incoming_friends:", err);
    return {
      friends: [],
      nextPageToken: null,
    };
  }
};
// Hàm xoá nhiều lời mời (tối đa 50 mỗi lần)
export const rejectMultipleFriendRequests = async (
  uidList = [],
  delay = 200
) => {
          // Đợi lấy token & uid
  const auth = await utils.getCurrentUserTokenAndUid();;

  if (!auth) {
    console.error("Không lấy được token và uid hiện tại.");
    return [];
  }

  const { idToken, localId, refreshToken } = auth;

  const results = [];
  const MAX_BATCH = 50;

  // Chia uidList thành các nhóm 50
  for (let i = 0; i < uidList.length; i += MAX_BATCH) {
    const batch = uidList.slice(i, i + MAX_BATCH);

    // Promise all xoá từng uid trong batch
    const batchResults = await Promise.all(
      batch.map(async (uid) => {
        const res = await rejectFriendRequest(idToken, uid);
        return { uid, ...res };
      })
    );

    results.push(...batchResults);

    // Nếu còn batch tiếp theo thì chờ delay
    if (i + MAX_BATCH < uidList.length) {
      console.log(`⏳ Đợi ${delay}ms trước khi xử lý batch tiếp theo...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return results;
};
export const fetchUser = async (user_uid, idToken) => {
  return await axios.post(
    "https://api.locketcamera.com/fetchUserV2",
    {
      data: {
        user_uid,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};
export const removeFriend = async (user_uid, idToken) => {};

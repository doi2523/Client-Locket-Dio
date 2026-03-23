import * as utils from "@/utils";
import api from "@/libs/axios";
import { instanceMain } from "@/libs/instanceMain";
import { fetchUserById } from "../LocketServices";

//lấy toàn bộ danh sách bạn bè (uid, createdAt) từ API
// {
//     "uid": "",
//     "createdAt": 1753470386025,
//     "updatedAt": 1753470389669,
//     "sharedHistoryOn": 1753470389647
//     "hidden": true
// }
export const getListIdFriends = async () => {
  try {
    const res = await api.post("locket/getAllFriendsV2");

    const allFriends = res?.data?.data || [];

    return allFriends;
  } catch (err) {
    console.error("❌ Lỗi khi gọi API get-friends:", err);
    return null;
  }
};

export const loadFriendDetailsV3 = async (friends) => {
  if (!friends || friends.length === 0) {
    return []; // Không fetch nếu không có bạn bè
  }

  const batchSize = 20;
  const allResults = [];

  for (let i = 0; i < friends.length; i += batchSize) {
    const batch = friends.slice(i, i + batchSize);

    try {
      const results = await Promise.allSettled(
        batch.map((friend) =>
          fetchUserById(friend?.uid).then((res) =>
            utils.normalizeFriendDataV2(res),
          ),
        ),
      );

      const successResults = results
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);

      allResults.push(...successResults);

      // Nghỉ một chút nếu còn batch
      if (i + batchSize < friends.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (err) {
      console.error("❌ Lỗi khi xử lý batch:", err);
    }
  }

  return allResults;
};

// Hàm tìm bạn qua username
export const FindFriendByUserName = async (eqfriend) => {
  try {
    const body = {
      username: eqfriend,
    };
    const response = await instanceMain.post(
      "https://api-beta.locket-dio.com/locket/getUserByData",
      body,
    );

    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi tìm bạn:", error.response?.data || error.message);
    throw error;
  }
};

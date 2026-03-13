import axios from "axios";
import * as utils from "@/utils";
import api from "@/lib/axios";
import { instanceLocketV2 } from "@/lib/axios.locket";
import { SonnerWarning } from "@/components/ui/SonnerToast";
import { instanceMain } from "@/lib/axios.main";

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
export const loadFriendDetailsV4 = async (friends) => {
  if (!friends || friends.length === 0) return [];

  const batchSize = 20;
  const allResults = [];

  for (let i = 0; i < friends.length; i += batchSize) {
    const batch = friends.slice(i, i + batchSize);

    try {
      const results = await Promise.allSettled(
        batch.map(async (friend) => {
          const res = await fetchUser(friend.uid);

          const normalized = utils.normalizeFriendData(res.data);

          // 🔥 merge meta friend vào profile
          return {
            ...normalized,
            createdAt: friend.createdAt ?? 0,
            updatedAt: friend.updatedAt ?? 0,
            hidden: friend.hidden ?? false,
            sharedHistoryOn: friend.sharedHistoryOn ?? null,
            isCelebrity: friend.isCelebrity ?? false,
          };
        }),
      );

      const successResults = results
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);

      allResults.push(...successResults);

      if (i + batchSize < friends.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (err) {
      console.error("❌ Lỗi khi xử lý batch:", err);
    }
  }

  return allResults;
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
          fetchUser(friend?.uid).then((res) =>
            utils.normalizeFriendData(res.data),
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

//fetch dữ liệu chi tiết về user qua uid
export const fetchUser = async (user_uid) => {
  // Đợi lấy token & uid
  const { idToken } = utils.getToken() || {};

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
    },
  );
};

export const fetchUserV2 = async (user_uid) => {
  // Đợi lấy token & uid
  const body = {
    data: {
      user_uid: user_uid,
    },
  };
  const res = await instanceLocketV2.post("fetchUserV2", body);
  return res?.data?.result?.data;
};
//Tích hợp 2 hàm getListfirend và fetchuser cho thuận tiện việc lấy dữ liệu
export const refreshFriends = async () => {
  try {
    // Lấy danh sách bạn bè (uid, createdAt)
    const friends = await getListIdFriends();
    if (!friends.length) return;

    const { idToken, localId } = utils.getToken() || {};
    if (!idToken || !localId) {
      SonnerWarning("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }
    const friendDetails = await loadFriendDetailsV3(friends);

    // Lưu thời gian cập nhật
    const updatedAt = new Date().toISOString();
    localStorage.setItem("friendsUpdatedAt", updatedAt);
    return {
      friends,
      friendDetails,
      updatedAt,
    };
  } catch (error) {
    console.error("❌ Lỗi khi làm mới danh sách bạn bè:", error);
    return null;
  }
};

export const loadFriendDetails = async (friends) => {
  // Ưu tiên lấy dữ liệu từ localStorage trước
  const savedDetails = localStorage.getItem("friendDetails");

  if (savedDetails) {
    try {
      const parsedDetails = JSON.parse(savedDetails);
      return parsedDetails;
    } catch (error) {
      console.error("❌ Parse friendDetails error:", error);
      // Tiếp tục fetch nếu lỗi
    }
  }

  if (!friends || friends.length === 0) {
    return []; // Không fetch nếu không có bạn bè
  }

  const batchSize = 10;
  const allResults = [];

  for (let i = 0; i < friends.length; i += batchSize) {
    const batch = friends.slice(i, i + batchSize);
    try {
      const results = await Promise.allSettled(
        batch.map((friend) =>
          fetchUser(friend?.uid).then((res) =>
            utils.normalizeFriendData(res.data),
          ),
        ),
      );

      const successResults = results
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);

      allResults.push(...successResults);

      if (i + batchSize < friends.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (err) {
      console.error("❌ Lỗi khi xử lý batch:", err);
    }
  }

  try {
    localStorage.setItem("friendDetails", JSON.stringify(allResults));
  } catch (error) {
    console.error("❌ Lỗi khi lưu vào localStorage:", error);
  }

  return allResults;
};

export const loadFriendDetailsV2 = async (friends) => {
  if (!friends || friends.length === 0) {
    return []; // Không fetch nếu không có bạn bè
  }

  const batchSize = 10;
  const allResults = [];

  for (let i = 0; i < friends.length; i += batchSize) {
    const batch = friends.slice(i, i + batchSize);

    try {
      const results = await Promise.allSettled(
        batch.map((friend) =>
          fetchUser(friend?.uid).then((res) =>
            utils.normalizeFriendData(res.data),
          ),
        ),
      );

      const successResults = results
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);

      allResults.push(...successResults);

      // Thêm delay nhỏ để tránh spam server nếu quá nhiều user
      if (i + batchSize < friends.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (err) {
      console.error("❌ Lỗi khi xử lý batch:", err);
    }
  }

  return allResults;
};

export const removeFriend = async (uid) => {
  try {
    const body = {
      data: {
        user_uid: uid,
      },
    };

    const response = await instanceLocketV2.post("removeFriend", body);
    return response.data?.result?.data?.user_uid;
  } catch (error) {
    console.error("❌ Lỗi khi xoá bạn:", error);
    throw error;
  }
};

export const toggleHiddenFriend = async (uid) => {
  const body = {
    data: {
      user_uid: uid,
    },
  };

  const response = await instanceLocketV2.post("toggleFriendHidden", body);

  return {
    success: response.status === 200,
    uid,
  };
};

// Hàm tìm bạn qua username
export const FindFriendByUserName = async (eqfriend) => {
  try {
    const body = {
      username: eqfriend,
    };
    const response = await instanceMain.post("https://api-beta.locket-dio.com/locket/getUserByData", body);

    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi tìm bạn:", error.response?.data || error.message);
    throw error;
  }
};

import axios from "axios";
import * as utils from "@/utils";
import { showError } from "@/components/Toast";
import api from "@/lib/axios";
import { instanceLocketV2 } from "@/lib/axios.locket";
import { chunkArray } from "@/helpers/chunkArray";

//lấy toàn bộ danh sách bạn bè (uid, createdAt) từ API
export const getListIdFriends = async () => {
  try {
    const res = await api.post("locket/getAllFriendsV2");

    const allFriends = res?.data?.data || [];

    const cleanedFriends = allFriends.map((friend) => ({
      uid: friend.uid,
      createdAt: friend.date,
    }));

    return cleanedFriends;
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
          fetchUser(friend?.uid).then((res) =>
            utils.normalizeFriendData(res.data)
          )
        )
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
    }
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
      showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
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

export const getAllRequestFriend = async (pageToken = null, limit = 100) => {
  try {
    const res = await api.post("/locket/getAllRequestsV2", {
      pageToken,
      limit,
    });

    const { success, message, data, nextPageToken } = res.data;

    if (!success) {
      return {
        friends: [],
        nextPageToken: null,
        errorMessage: message || "Lỗi khi lấy danh sách lời mời",
      };
    }

    const cleanedFriends = (data || []).map((friend) => ({
      uid: friend.uid,
      createdAt: friend.date,
    }));

    return {
      friends: cleanedFriends,
      nextPageToken: nextPageToken || null,
      errorMessage: null,
    };
  } catch (err) {
    console.error("❌ Lỗi khi gọi API getListRequestFriend:", err);

    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Lỗi không xác định";

    return {
      friends: [],
      nextPageToken: null,
      errorMessage,
    };
  }
};

export const getListRequestFriendV2 = async (pageToken = null, limit = 10) => {
  try {
    const res = await api.post("/locket/getIncomingFriendRequestsV2", {
      pageToken,
      limit,
    });

    const { success, message, data, nextPageToken } = res.data;

    if (!success) {
      return {
        friends: [],
        nextPageToken: null,
        errorMessage: message || "Lỗi khi lấy danh sách lời mời",
      };
    }

    const cleanedFriends = (data || []).map((friend) => ({
      uid: friend.uid,
      createdAt: friend.date,
    }));

    return {
      friends: cleanedFriends,
      nextPageToken: nextPageToken || null,
      errorMessage: null,
    };
  } catch (err) {
    console.error("❌ Lỗi khi gọi API getListRequestFriend:", err);

    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Lỗi không xác định";

    return {
      friends: [],
      nextPageToken: null,
      errorMessage,
    };
  }
};

export const getOutgoingRequestFriend = async (
  pageToken = null,
  limit = 100
) => {
  try {
    const res = await api.post("/locket/getOutgoingFriendRequestsV2", {
      pageToken,
      limit,
    });

    const { success, message, data, nextPageToken } = res.data;

    if (!success) {
      return {
        friends: [],
        nextPageToken: null,
        errorMessage: message || "Lỗi khi lấy danh sách lời mời",
      };
    }

    const cleanedFriends = (data || []).map((friend) => ({
      uid: friend.to,
      createdAt: friend.date,
    }));

    return {
      friends: cleanedFriends,
      nextPageToken: nextPageToken || null,
      errorMessage: null,
    };
  } catch (err) {
    console.error("❌ Lỗi khi gọi API getListRequestFriend:", err);

    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Lỗi không xác định";

    return {
      friends: [],
      nextPageToken: null,
      errorMessage,
    };
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
            utils.normalizeFriendData(res.data)
          )
        )
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
            utils.normalizeFriendData(res.data)
          )
        )
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

export const rejectMultipleFriendRequests = async (
  uidList,
  direction = "incoming",
  batchSize = 50
) => {
  try {
    const batches = chunkArray(uidList, batchSize);

    let successCount = 0;
    let successUidList = [];

    for (const batch of batches) {
      const promises = batch.map((uid) => {
        const body = { data: { user_uid: uid, direction } };
        return instanceLocketV2
          .post("deleteFriendRequest", body)
          .then(() => uid); // nếu thành công thì trả lại uid
      });

      const responses = await Promise.allSettled(promises);

      responses.forEach((r) => {
        if (r.status === "fulfilled") {
          successCount++;
          successUidList.push(r.value);
        }
      });

      // tránh spam server
      await new Promise((r) => setTimeout(r, 500));
    }

    return { successCount, successUidList, total: uidList.length };
  } catch (error) {
    console.error("❌ Lỗi khi xoá lời mời:", error.message);
    return { successCount: 0, successUidList: [], total: uidList.length };
  }
};

export const rejectFriendRequests = async (uid, direction = "outgoing") => {
  try {
    const body = {
      data: {
        user_uid: uid,
        direction: direction,
      },
    };

    const response = await instanceLocketV2.post("deleteFriendRequest", body);

    return response; // giả sử response trả về dữ liệu thành công
  } catch (error) {
    console.error("Lỗi khi xoá lời mời:", error.message);
    return [];
  }
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
      data: {
        username: eqfriend,
      },
    };
    const response = await instanceLocketV2.post("getUserByUsername", body);

    return response.data?.result?.data;
  } catch (error) {
    console.error("❌ Lỗi khi tìm bạn:", error.response?.data || error.message);
    throw error;
  }
};

// Hàm tìm bạn qua username
export const SendRequestToFriend = async (uid) => {
  try {
    const response = await api.post(
      "/locket/sendFriendRequestV2",
      {
        data: { friendUid: uid },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data?.result?.data;
  } catch (error) {
    console.error("❌ Lỗi khi tìm bạn:", error.response?.data || error.message);
    throw error;
  }
};

export const AcceptRequestToFriend = async (uid) => {
  try {
    const body = { data: { user_uid: uid } };

    const response = await instanceLocketV2.post("acceptFriendRequest", body);

    const acceptedUid = response?.data?.result?.data?.user_uid || uid;
    if (!acceptedUid) throw new Error("Không nhận được UID hợp lệ từ server");
    // ✅ Lấy chi tiết user từ API
    const newFriend = await fetchUserV2(acceptedUid);
    // ✅ Chuẩn hoá dữ liệu friend
    const normalized = utils.normalizeFriendDataV2(newFriend);
    // ✅ Trả về kết quả đồng nhất
    return normalized;
  } catch (error) {
    console.error(
      "❌ Lỗi khi chấp nhận lời mời:",
      error.response?.data || error.message
    );
    return null; // fallback an toàn
  }
};

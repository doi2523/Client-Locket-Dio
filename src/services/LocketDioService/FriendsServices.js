import axios from "axios";
import * as utils from "../../utils";
import { showError } from "../../components/Toast";
import api from "../../lib/axios";

//lấy toàn bộ danh sách bạn bè (uid, createdAt) từ API
export const getListIdFriends = async () => {
  try {
    const res = await api.post(utils.API_URL.GET_LIST_FRIENDS_URL);

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
  const { idToken } = utils.getToken() || {};

  const res = await axios.post(
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
  return res?.data?.result?.data;
};
//Tích hợp 2 hàm getListfirend và fetchuser cho thuận tiện việc lấy dữ liệu
export const refreshFriends = async () => {
  try {
    // Xoá dữ liệu cũ
    localStorage.removeItem("friendsList");
    localStorage.removeItem("friendDetails");

    // Lấy danh sách bạn bè (uid, createdAt)
    const friends = await getListIdFriends();
    if (!friends.length) return;

    // Lưu danh sách bạn bè vào localStorage
    localStorage.setItem("friendsList", JSON.stringify(friends));

    const { idToken, localId } = utils.getToken() || {};
    if (!idToken || !localId) {
      showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }

    // Tiến hành fetch
    const batchSize = 20;
    const allResults = [];

    for (let i = 0; i < friends.length; i += batchSize) {
      const batch = friends.slice(i, i + batchSize);

      try {
        const results = await Promise.all(
          batch.map((friend) =>
            fetchUser(friend.uid, idToken)
              .then((res) => utils.normalizeFriendData(res.data))
              .catch((err) => {
                console.error(
                  `❌ fetchUser(${friend.uid}) failed:`,
                  err?.response?.data || err
                );
                return null;
              })
          )
        );

        const filtered = results.filter(Boolean);
        allResults.push(...filtered);
      } catch (err) {
        console.error("❌ Lỗi khi xử lý batch:", err);
      }
    }

    // setFriendDetails(allResults);
    // Lưu thời gian cập nhật
    const updatedAt = new Date().toISOString();
    localStorage.setItem("friendsUpdatedAt", updatedAt);
    // Lưu thông tin chi tiết vào localStorage
    localStorage.setItem("friendDetails", JSON.stringify(allResults));

    console.log("✅ Làm mới danh sách bạn bè hoàn tất");
    return {
      friends,
      friendDetails: allResults,
      updatedAt,
    };
  } catch (error) {
    console.error("❌ Lỗi khi làm mới danh sách bạn bè:", error);
    return null;
  }
};

export const getListRequestFriend = async (pageToken = null, limit = 100) => {
  try {
    const res = await api.post("/locket/get-incoming-friends", {
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

export const rejectMultipleFriendRequests = async (uidList) => {
  try {
    const response = await api.post(
      "/locket/delete-incoming-friends",
      {
        uids: uidList,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response; // giả sử response trả về dữ liệu thành công
  } catch (error) {
    console.error("Lỗi khi xoá lời mời:", error.message);
    return [];
  }
};

export const removeFriend = async (user_uid) => {
  try {
    const response = await api.post(utils.API_URL.DELETE_FRIEND_URL, {
      uid: user_uid,
    });

    console.log("✅ Đã xoá:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi xoá bạn:", error);
    throw error;
  }
};

// Hàm tìm bạn qua username
export const FindFriendByUserName = async (eqfriend) => {
  const { idToken } = utils.getToken();
  try {
    const response = await axios.post(
      "https://api.locketcamera.com/getUserByUsername",
      {
        data: { username: eqfriend },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
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
      "/locket/sendrq_friend",
      {
        data: { uid: uid },
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
    const response = await api.post(
      "/locket/accept-friend-request",
      { uid },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || "Không thể chấp nhận lời mời");
    }

    return result?.data; // trả về dữ liệu cần thiết nếu có
  } catch (error) {
    console.error(
      "❌ Lỗi khi chấp nhận lời mời:",
      error.response?.data || error.message
    );
    throw error;
  }
};

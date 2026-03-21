import api from "@/lib/axios";
import { instanceLocketV2 } from "@/lib/axios.locket";
import { normalizeFriendDataV2 } from "@/utils";
import { fetchUserV2 } from "./FriendsServices";
import { chunkArray } from "@/helpers/chunkArray";

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
  limit = 100,
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

export const rejectMultipleFriendRequests = async (
  uidList,
  direction = "incoming",
  batchSize = 50,
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

export const SendRequestToFriend = async (uid) => {
  try {
    const response = await api.post(
      "/locket/sendFriendRequestV2",
      {
        data: { friendUid: uid },
      },
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
    const normalized = normalizeFriendDataV2(newFriend);
    // ✅ Trả về kết quả đồng nhất
    return normalized;
  } catch (error) {
    console.error(
      "❌ Lỗi khi chấp nhận lời mời:",
      error.response?.data || error.message,
    );
    return null; // fallback an toàn
  }
};

export const SendRequestToCelebrity = async (uid) => {
  try {
    const response = await api.post("https://api-beta.locket-dio.com/locket/sendCelebrityRequestV2", {
      friendUid: uid,
    });
    return response?.data;
  } catch (error) {
    console.error("❌ Lỗi khi tìm bạn:", error.response?.data || error.message);
    throw error;
  }
};

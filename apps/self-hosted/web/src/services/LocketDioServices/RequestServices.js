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

import { instanceLocketV2 } from "@/lib/axios.locket";
import { normalizeFriendDataV2 } from "@/utils";
import { chunkArray } from "@/helpers/chunkArray";
import { fetchUserById } from "./fetch.services";

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

export const AcceptRequestToFriend = async (uid) => {
  try {
    const body = { data: { user_uid: uid } };

    const response = await instanceLocketV2.post("acceptFriendRequest", body);

    const acceptedUid = response?.data?.result?.data?.user_uid || uid;
    if (!acceptedUid) throw new Error("Không nhận được UID hợp lệ từ server");
    // ✅ Lấy chi tiết user từ API
    const newFriend = await fetchUserById(acceptedUid);
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

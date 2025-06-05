import axios from "axios";
import * as utils from "../../utils";
import { showError } from "../../components/Toast";

//lấy toàn bộ danh sách bạn bè (uid, createdAt) từ API
export const getListIdFriends = async () => {
  // Đợi lấy token & uid
  const auth = await utils.getCurrentUserTokenAndUid();

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
//fetch dữ liệu chi tiết về user qua uid
export const fetchUser = async (user_uid) => {
  // Đợi lấy token & uid
  const auth = await utils.getCurrentUserTokenAndUid();

  if (!auth) {
    console.error("Không lấy được token và uid hiện tại.");
    return [];
  }

  const { idToken, localId, refreshToken } = auth;

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

    const auth = await utils.getCurrentUserTokenAndUid();
    if (!auth) {
      console.error("Không có token người dùng");
      return;
    }
    const { idToken } = auth;

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
export const getListRequestFriend = async (pageToken = null) => {
  // Đợi lấy token & uid
  const auth = await utils.getCurrentUserTokenAndUid();

  if (!auth) {
    console.error("Không lấy được token và uid hiện tại.");
    return {
      friends: [],
      nextPageToken: null,
      errorMessage: "Không xác định được người dùng",
    };
  }

  const { idToken, localId } = auth;

  try {
    const res = await axios.post(utils.API_URL.GET_INCOMING_URL, {
      idToken,
      localId,
      pageToken,
    });

    console.log("Response data:", res.data);

    if (res.data.success === false) {
      // API trả về lỗi, truyền message cho client
      return {
        friends: [],
        nextPageToken: null,
        errorMessage: res.data.message || "Lỗi khi lấy danh sách lời mời",
      };
    }

    const friends = res?.data?.data || [];
    const cleanedFriends = friends.map((friend) => ({
      uid: friend.uid,
      createdAt: friend.date,
    }));

    // Nếu nextPageToken nằm trong res.data, không trong data array
    const next = res?.data?.nextPageToken || null;

    return {
      friends: cleanedFriends,
      nextPageToken: next,
      errorMessage: null,
    };
  } catch (err) {
    // Lấy chi tiết lỗi từ response nếu có
    if (err.response) {
      console.error("API lỗi, status:", err.response.status);
      console.error("API lỗi data:", err.response.data);

      return {
        friends: [],
        nextPageToken: null,
        errorMessage:
          err.response.data?.message ||
          `Lỗi API với status code ${err.response.status}`,
      };
    } else {
      // Lỗi mạng hoặc lỗi khác
      console.error("Lỗi không xác định khi gọi API:", err.message);
      return {
        friends: [],
        nextPageToken: null,
        errorMessage: err.message || "Lỗi khi gọi API",
      };
    }
  }
};
// Hàm xoá nhiều lời mời (tối đa 50 mỗi lần)
// export const rejectMultipleFriendRequests = async (
//   uidList = [],
//   delay = 200
// ) => {
//   // Đợi lấy token & uid
//   const auth = await utils.getCurrentUserTokenAndUid();

//   if (!auth) {
//     console.error("Không lấy được token và uid hiện tại.");
//     return [];
//   }

//   const { idToken, localId, refreshToken } = auth;

//   const results = [];
//   const MAX_BATCH = 50;

//   // Chia uidList thành các nhóm 50
//   for (let i = 0; i < uidList.length; i += MAX_BATCH) {
//     const batch = uidList.slice(i, i + MAX_BATCH);

//     // Promise all xoá từng uid trong batch
//     const batchResults = await Promise.all(
//       batch.map(async (uid) => {
//         const res = await rejectFriendRequest(idToken, uid);
//         return { uid, ...res };
//       })
//     );

//     results.push(...batchResults);

//     // Nếu còn batch tiếp theo thì chờ delay
//     if (i + MAX_BATCH < uidList.length) {
//       console.log(`⏳ Đợi ${delay}ms trước khi xử lý batch tiếp theo...`);
//       await new Promise((resolve) => setTimeout(resolve, delay));
//     }
//   }

//   return results;
// };

export const rejectMultipleFriendRequests = async (uidList) => {
  // Lấy token & uid hiện tại
  const auth = await utils.getCurrentUserTokenAndUid();

  if (!auth) {
    console.error("Không lấy được token và uid hiện tại.");
    return [];
  }

  const { idToken } = auth;

  try {
    const response = await axios.post(
      API_URL.DELETE_FRIEND_REQUEST_URL,
      {
        idToken,
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
    const auth = await utils.getCurrentUserTokenAndUid();
    const { idToken } = auth;

    const response = await axios.post(utils.API_URL.DELETE_FRIEND_URL, {
      uid: user_uid,
      idToken,
    });

    console.log("✅ Đã xoá:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi xoá bạn:", error);
    throw error;
  }
};

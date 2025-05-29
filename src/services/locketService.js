import axios from "axios";
import * as utils from "../utils";

//Login
export const login = async (email, password) => {
  try {
    const res = await axios.post(
      utils.API_URL.LOGIN_URL_V2,
      { email, password },
      { withCredentials: true } // Nhận cookie từ server
    );

    // Kiểm tra nếu API trả về lỗi nhưng vẫn có status 200
    if (res.data?.success === false) {
      console.error("Login failed:", res.data.message);
      return null;
    }

    return res.data; // Trả về dữ liệu từ server
  } catch (error) {
    if (error.response && error.response.data?.error) {
      throw error.response.data.error; // ⬅️ Ném lỗi từ `error.response.data.error`
    }
    console.error("❌ Network Error:", error.message);
    throw new Error(
      "Có sự cố khi kết nối đến hệ thống, vui lòng thử lại sau ít phút."
    );
  }
};
export const refreshIdToken = async (refreshToken) => {
  try {
    const res = await axios.post(
      utils.API_URL.REFESH_TOKEN_URL,
      { refreshToken },
      { withCredentials: true } // Nhận cookie từ server
    );
    // Kiểm tra nếu API trả về lỗi nhưng vẫn có status 200
    // if (res.data?.success === false) {
    //   console.error("Login failed:", res.data.message);
    //   return null;
    // }

    return res.data.idToken; // Trả về dữ liệu từ server
  } catch (error) {
    if (error.response && error.response.data?.error) {
      throw error.response.data.error; // ⬅️ Ném lỗi từ `error.response.data.error`
    }
    console.error("❌ Network Error:", error.message);
    throw new Error(
      "Có sự cố khi kết nối đến hệ thống, vui lòng thử lại sau ít phút."
    );
  }
};
//Logout
export const logout = async () => {
  try {
    const response = await axios.get(utils.API_URL.LOGOUT_URL, {
      withCredentials: true,
    });
    return response.data; // ✅ Trả về dữ liệu từ API (ví dụ: { message: "Đã đăng xuất!" })
  } catch (error) {
    console.error(
      "❌ Lỗi khi đăng xuất:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message; // ✅ Trả về lỗi nếu có
  }
};
export const getInfocheckAuth = async (idToken, localId) => {
  try {
    if (!idToken) {
      throw new Error("Thiếu idToken! Vui lòng đăng nhập lại.");
    }

    const res = await axios.post(utils.API_URL.CHECK_AUTH_URL, {
      idToken,
      localId,
    });

    return res.status; // Chỉ trả về status
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra xác thực:", error);

    if (error.response) {
      throw new Error(error.response.status); // Quăng lỗi với mã trạng thái từ server
    } else if (error.request) {
      throw new Error("503"); // Lỗi kết nối, giả định mã 503 (Service Unavailable)
    } else {
      throw new Error("500"); // Lỗi không xác định, giả định mã 500
    }
  }
};
export const getInfo = async (idToken, localId) => {
  try {
    if (!idToken) {
      throw new Error("Thiếu idToken! Vui lòng đăng nhập lại.");
    }

    const res = await axios.post(utils.API_URL.GET_INFO_URL, {
      idToken,
      localId,
    });

    if (!res.data || !res.data.user) {
      throw new Error("Dữ liệu trả về không hợp lệ!");
    }

    return res.data.user;
  } catch (error) {
    let errorMessage = "Lỗi không xác định!";

    if (error.response) {
      // Lỗi từ server
      errorMessage = error.response.data?.message || "Lỗi từ server!";
    } else if (error.request) {
      // Lỗi kết nối (không nhận được phản hồi)
      errorMessage = "Không thể kết nối đến server! Kiểm tra mạng của bạn.";
    } else {
      // Lỗi khác
      errorMessage = error.message;
    }

    console.error("❌ Lỗi khi lấy thông tin người dùng:", errorMessage);
    throw new Error(errorMessage); // Quăng lỗi để xử lý trong component
  }
};
//Get Momemnt
export const getLatestMoment = async (idToken) => {
  try {
    const res = await axios.post(
      utils.API_URL.GET_LASTEST_URL,
      { idToken },
      { withCredentials: true }
    );

    console.log("Moment mới nhất:", res.data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy moment:", error.response?.data || error.message);
    throw error; // Quăng lỗi để xử lý trong component
  }
};
export const uploadMedia = async (formData, setUploadProgress) => {
  let timeOutId;
  try {
    const fileType = formData.get("images") ? "image" : "video";

    // Thời gian chờ tùy vào loại file
    timeOutId = setTimeout(
      () => {
        console.log("⏳ Uploading is taking longer than expected...");
      },
      fileType === "image" ? 5000 : 10000
    );

    const response = await axios.post(
      utils.API_URL.UPLOAD_MEDIA_URL,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (setUploadProgress && typeof setUploadProgress === "function") {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            let currentProgress = 0;
            if (percent > currentProgress) {
              const updateProgress = (target) => {
                if (currentProgress < target) {
                  currentProgress += 1;
                  setUploadProgress(currentProgress);
                  setTimeout(() => updateProgress(target), 50);
                }
              };
              updateProgress(percent);
            }
          }
        },
      }
    );

    clearTimeout(timeOutId);
    console.log("✅ Upload thành công:", response.data);
    return response.data;
  } catch (error) {
    clearTimeout(timeOutId);

    // Log lỗi chi tiết hơn
    console.error("❌ Lỗi khi upload:", error.response?.data || error.message);

    if (error.response) {
      // Xử lý lỗi từ server
      console.error("Server Error:", error.response);
    } else {
      // Xử lý lỗi kết nối hoặc khác
      console.error("Network Error:", error.message);
    }

    throw error;
  }
};
export const uploadMediaV2 = async (payload) => {
  try {
    // Lấy mediaInfo từ payload
    const { mediaInfo } = payload;
    // Lấy type từ mediaInfo để xác định là ảnh hay video
    const fileType = mediaInfo.type;

    // Đặt timeout tùy theo loại tệp (ảnh hoặc video)
    const timeoutDuration =
      fileType === "image" ? 5000 : fileType === "video" ? 10000 : 5000;
    const timeoutId = setTimeout(() => {
      console.log("⏳ Uploading is taking longer than expected...");
    }, timeoutDuration);

    // Gửi request với payload và header Content-Type: application/json
    const response = await axios.post(utils.API_URL.UPLOAD_MEDIA_URL, payload, {
      headers: {
        "Content-Type": "application/json", // Sử dụng JSON thay vì FormData
      },
    });

    clearTimeout(timeoutId); // Hủy timeout khi upload thành công
    console.log("✅ Upload thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi upload:", error.response?.data || error.message);

    if (error.response) {
      console.error("📡 Server Error:", error.response);
    } else {
      console.error("🌐 Network Error:", error.message);
    }

    throw error;
  }
};
// export const fetchAndStoreFriends = async (idToken, localId) => {
//   const allFriends = [];
//   let nextPageToken = null;

//   try {
//     do {
//       const res = await axios.post(`http://localhost:5004/locket/get-friends`, {
//         idToken,
//         localId,
//         pageToken: nextPageToken,
//       });

//       const friends = res?.data?.data?.friendsList || [];
//       const cleanedFriends = friends.map(friend => ({
//         uid: friend.uid,
//         createdAt: friend.date,
//       }));

//       allFriends.push(...cleanedFriends);

//       nextPageToken = res?.data?.data?.nextPageToken;
//     } while (nextPageToken);

//     // Lưu vào sessionStorage ngay trong service
//     sessionStorage.setItem('friendsList', JSON.stringify(allFriends));

//     return allFriends;
//   } catch (err) {
//     console.error("❌ Lỗi khi gọi API get-friends:", err);
//     return [];
//   }
// };

export const fetchAndStoreFriends = async (idToken, localId) => {
    // Lấy token
    const { refreshToken } = utils.getToken() || {};
    if (!idToken || !localId) {
      showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }
    // Kiểm tra và làm mới token nếu cần
    const freshIdToken = await utils.checkAndRefreshIdToken(
      idToken,
      refreshToken
    );

  try {
    const res = await axios.post(utils.API_URL.GET_LIST_FRIENDS_URL, {
      freshIdToken,
      localId,
    });

    const allFriends = res?.data?.data || [];

    const cleanedFriends = allFriends.map((friend) => ({
      uid: friend.uid,
      createdAt: friend.date,
    }));

    // Lưu vào sessionStorage
    sessionStorage.setItem("friendsList", JSON.stringify(cleanedFriends));

    return cleanedFriends;
  } catch (err) {
    console.error("❌ Lỗi khi gọi API get-friends:", err);
    return [];
  }
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

// export const getListRequestFriend = async (idToken, localId) => {
//   const allFriends = [];
//   let nextPageToken = null;

//   try {
//     do {
//       const res = await axios.post(`http://localhost:5004/locket/get-incoming_friends`, {
//         idToken,
//         localId,
//         pageToken: nextPageToken,
//       });

//       const friends = res?.data?.data?.friendsList || [];
//       const cleanedFriends = friends.map(friend => ({
//         uid: friend.uid,
//         createdAt: friend.date,
//       }));

//       allFriends.push(...cleanedFriends);
//       nextPageToken = res?.data?.data?.nextPageToken;
//     } while (nextPageToken);

//     return allFriends;
//   } catch (err) {
//     console.error("❌ Lỗi khi gọi API get-incoming_friends:", err);
//     return [];
//   }
// };

export const getListRequestFriend = async (
  idToken,
  localId,
  pageToken = null
) => {
  // Lấy token
  const { refreshToken } = utils.getToken() || {};
  if (!idToken || !localId) {
    showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    return null;
  }
  // Kiểm tra và làm mới token nếu cần
  const freshIdToken = await utils.checkAndRefreshIdToken(
    idToken,
    refreshToken
  );

  try {
    const res = await axios.post(utils.API_URL.GET_INCOMING_URL, {
      freshIdToken,
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
// headers như bạn đã có sẵn
const loginHeader = {
  "Content-Type": "application/json",
  "User-Agent":
    "FirebaseAuth.iOS/10.23.1 com.locket.Locket/1.82.0 iPhone/18.0 hw/iPhone12_1",
  "X-Ios-Bundle-Identifier": "com.locket.Locket",
};

// ✅ Hàm rejectFriendRequest không dùng Redux
export const rejectFriendRequest = async (idToken, uid) => {
  const url = "https://api.locketcamera.com/deleteFriendRequest";

  const body = {
    data: {
      user_uid: uid,
      direction: "outgoing", // hoặc "incoming" tùy use case
    },
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        ...loginHeader,
      },
    });

    if (response.data?.result?.data === null) {
      // Xoá thành công
      console.log("✅ Xoá lời mời kết bạn thành công:", uid);
      return { success: true, uid };
    } else {
      // API báo lỗi logic
      console.error("❌ Xoá thất bại:", response.data?.result?.message);
      return {
        success: false,
        message: response.data?.result?.message || "Unknown error",
      };
    }
  } catch (error) {
    // Lỗi khi gọi API
    console.error(
      "❌ Lỗi khi gọi API xoá lời mời:",
      error?.response?.data || error.message
    );
    return { success: false, message: error?.response?.data || error.message };
  }
};
// Hàm xoá nhiều lời mời (tối đa 50 mỗi lần)
export const rejectMultipleFriendRequests = async (
  idToken,
  uidList = [],
  delay = 200
) => {
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

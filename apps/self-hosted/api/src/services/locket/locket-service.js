const constants = require("./constants.js");
const fs = require("fs");
const { logInfo, logError } = require("../logger.service.js");
const crypto = require("crypto");

const videoService = require("./video-service.js");
const { createGoogleInstance } = require("../../libs/instanceGoogleBase.js");
const { instanceFirestore } = require("../../libs/instanceFirestore.js");

const login = async (email, password) => {
  logInfo("login Locket", "Start");

  const body = {
    email: email,
    password: password,
    returnSecureToken: true,
    clientType: "CLIENT_TYPE_IOS",
  };

  try {
    const firebaseAuthApi = createGoogleInstance("auth");

    const response = await firebaseAuthApi.post("verifyPassword", body);

    if (!response.data) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.data;

    logInfo("login Locket", "End");
    return data;
  } catch (error) {
    logError("login Locket", error.message);
    throw error;
  }
};

const logout = async () => {
  logInfo("logout Locket", "Start");

  try {
    logInfo("logout Locket", "End");
    return null;
  } catch (error) {
    logError("logout Locket", error.message);
    throw error;
  }
};

const getAllFriends = async (idToken, localId) => {
  const GET_ACCOUNT_INFO_URL_V2 = process.env.FIRESTORE_DEFAULT;

  const baseUrl = `${GET_ACCOUNT_INFO_URL_V2}${localId}/friends`;
  console.log(baseUrl);

  let pageToken = null;
  const allFriends = [];

  try {
    do {
      const url = pageToken
        ? `${baseUrl}?pageSize=100&pageToken=${pageToken}`
        : `${baseUrl}?pageSize=100`;

      const response = await instanceFirestore.get(url, { meta: { idToken } });
      const documents = response.data.documents || [];

      const parsedFriends = documents.map((doc) => ({
        uid: doc.fields?.user?.stringValue,
        date: doc.createTime,
      }));

      allFriends.push(...parsedFriends);
      pageToken = response.data.nextPageToken || null;
    } while (pageToken);

    return allFriends;
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy danh sách bạn bè:",
      error.response?.data || error.message,
    );
    return []; // Trả về mảng rỗng nếu lỗi
  }
};

const getLocketMoments = async (
  idToken,
  userId,
  pageToken,
  userUid,
  limit = 20
) => {
  const headers = {
    Authorization: `Bearer ${idToken}`,
    Accept: "application/json",
  };

  const params = {
    orderBy: "date desc",
    pageSize: pageToken ? 100 : limit,
  };
  if (pageToken) params.pageToken = pageToken;

  try {
    const response = await axios.get(url, { headers, params });
    const documents = response.data.documents || [];

    // ✅ Chuẩn hoá ngay tại server
    const moments = documents
      .map((doc) => {
        const moment = normalizeMoment(doc);
        if (userUid && moment?.user !== userUid) return null;
        return moment;
      })
      .filter(Boolean);

    return {
      moments,
      nextPageToken: response.data.nextPageToken || null,
    };
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy moments:",
      error.response?.data || error.message
    );
    return {
      moments: [],
      nextPageToken: null,
    };
  }
};

const getAllMessages = async (idToken, userId, pageToken, limit = 20) => {

  const headers = {
    ...LOGIN_HEADERS,
    Authorization: `Bearer ${idToken}`,
    Accept: "application/json",
  };

  const params = {
    pageSize: limit,
    orderBy: "last_updated desc", // hoặc "updateTime desc"
  };

  if (pageToken) params.pageToken = pageToken;

  try {
    const response = await axios.get(url, { headers, params });

    const documents = response.data.documents || [];
    // Chuẩn hoá dữ liệu Firestore -> plain object
    const conversations = documents.map((doc) => normalizeMessage(doc));

    return {
      messages: conversations,
      nextPageToken: response.data.nextPageToken || null,
    };
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy mess:",
      error.response?.data || error.message
    );
    return {
      messages: [],
      nextPageToken: null,
    };
  }
};

//#region Image handlers

/**
 * Uploads an image to Firebase Storage.
 *
 * @param {string} userId
 * @param {string} idToken
 * @param {File|Buffer} image - The image to be uploaded. Can be a `File` object or a `Buffer`.
 * @returns
 */
const uploadImageToFirebaseStorage = async (userId, idToken, image) => {
  try {
    logInfo("uploadImageToFirebaseStorage", "Start");
    const imageName = `${Date.now()}_vtd182.webp`;

    // Bước 1: Khởi tạo quá trình upload
    const url = `https://firebasestorage.googleapis.com/v0/b/locket-img/o/users%2F${userId}%2Fmoments%2Fthumbnails%2F${imageName}?uploadType=resumable&name=users%2F${userId}%2Fmoments%2Fthumbnails%2F${imageName}`;
    const initHeaders = {
      "content-type": "application/json; charset=UTF-8",
      authorization: `Bearer ${idToken}`,
      "x-goog-upload-protocol": "resumable",
      accept: "*/*",
      "x-goog-upload-command": "start",
      "x-goog-upload-content-length": `${image.size || image.length}`,
      "accept-language": "vi-VN,vi;q=0.9",
      "x-firebase-storage-version": "ios/10.13.0",
      "user-agent":
        "com.locket.Locket/1.43.1 iPhone/17.3 hw/iPhone15_3 (GTMSUF/1)",
      "x-goog-upload-content-type": "image/webp",
      "x-firebase-gmpid": "1:641029076083:ios:cc8eb46290d69b234fa609",
    };

    const data = JSON.stringify({
      name: `users/${userId}/moments/thumbnails/${imageName}`,
      contentType: "image/*",
      bucket: "",
      metadata: { creator: userId, visibility: "private" },
    });

    const response = await fetch(url, {
      method: "POST",
      headers: initHeaders,
      body: data,
    });

    if (!response.ok) {
      throw new Error(`Failed to start upload: ${response.statusText}`);
    }

    const uploadUrl = response.headers.get("X-Goog-Upload-URL");

    // Bước 2: Tải dữ liệu hình ảnh lên thông qua URL resumable trả về từ bước 1
    let imageBuffer;
    if (image instanceof Buffer) {
      imageBuffer = image;
    } else {
      imageBuffer = fs.readFileSync(image.path);
    }

    let uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: constants.UPLOADER_HEADERS,
      body: imageBuffer,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload image: ${uploadResponse.statusText}`);
    }

    // Lấy URL tải về hình ảnh từ Firebase Storage
    const getUrl = `https://firebasestorage.googleapis.com/v0/b/locket-img/o/users%2F${userId}%2Fmoments%2Fthumbnails%2F${imageName}`;
    const getHeaders = {
      "content-type": "application/json; charset=UTF-8",
      authorization: `Bearer ${idToken}`,
    };

    const getResponse = await fetch(getUrl, {
      method: "GET",
      headers: getHeaders,
    });

    if (!getResponse.ok) {
      throw new Error(
        `Failed to get download token: ${getResponse.statusText}`,
      );
    }

    const downloadToken = (await getResponse.json()).downloadTokens;
    logInfo("uploadImageToFirebaseStorage", "End");

    return `${getUrl}?alt=media&token=${downloadToken}`;
  } catch (error) {
    logError("uploadImageToFirebaseStorage", error.message);
    throw error;
  } finally {
    // Xoá file ảnh tạm
    if (image.path) {
      fs.unlinkSync(image.path);
    }
  }
};

const postImage = async (userId, idToken, image, caption) => {
  try {
    logInfo("postImage", "Start");
    const imageUrl = await uploadImageToFirebaseStorage(userId, idToken, image);

    // Tạo bài viết mới
    const postHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    };

    const postData = JSON.stringify({
      data: {
        thumbnail_url: imageUrl,
        caption: caption,
        sent_to_all: true,
      },
    });

    const postResponse = await fetch(constants.CREATE_POST_URL, {
      method: "POST",
      headers: postHeaders,
      body: postData,
    });

    if (!postResponse.ok) {
      throw new Error(`Failed to create post: ${postResponse.statusText}`);
    }

    logInfo("postImage", "End");
  } catch (error) {
    logError("postImage", error.message);
    throw error;
  }
};

//#endregion

//#region Video handlers
const getMd5Hash = (str) => {
  return crypto.createHash("md5").update(str).digest("hex");
};

const uploadThumbnailFromVideo = async (userId, idToken, video) => {
  try {
    const thumbnailBytes = await videoService.thumbnailData(
      video.path,
      "jpeg",
      128,
      75,
    );

    return await uploadImageToFirebaseStorage(userId, idToken, thumbnailBytes);
  } catch (error) {
    logError("uploadThumbnailFromVideo", error.message);
    return null;
  }
};

/**
 *
 * @param {*} userId
 * @param {*} idToken
 * @param {Byte} video
 */
const uploadVideoToFirebaseStorage = async (userId, idToken, video) => {
  try {
    const videoName = `${Date.now()}_vtd182.mp4`;
    const videoSize = video.length;

    // Giai đoạn 1: Khởi tạo quá trình upload, sẽ nhận lại được URL tạm thời để tải video lên
    const url = `https://firebasestorage.googleapis.com/v0/b/locket-video/o/users%2F${userId}%2Fmoments%2Fvideos%2F${videoName}?uploadType=resumable&name=users%2F${userId}%2Fmoments%2Fvideos%2F${videoName}`;
    const headers = {
      "content-type": "application/json; charset=UTF-8",
      authorization: `Bearer ${idToken}`,
      "x-goog-upload-protocol": "resumable",
      accept: "*/*",
      "x-goog-upload-command": "start",
      "x-goog-upload-content-length": `${videoSize}`,
      "accept-language": "vi-VN,vi;q=0.9",
      "x-firebase-storage-version": "ios/10.13.0",
      "user-agent":
        "com.locket.Locket/1.43.1 iPhone/17.3 hw/iPhone15_3 (GTMSUF/1)",
      "x-goog-upload-content-type": "video/mp4",
      "x-firebase-gmpid": "1:641029076083:ios:cc8eb46290d69b234fa609",
    };

    const data = JSON.stringify({
      name: `users/${userId}/moments/videos/${videoName}`,
      contentType: "video/mp4",
      bucket: "",
      metadata: { creator: userId, visibility: "private" },
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: data,
    });

    if (!response.ok) {
      throw new Error(`Failed to start upload: ${response.statusText}`);
    }

    // Giai đoạn 2: Tải video lên thông qua URL resumable trả về từ bước 1
    const uploadUrl = response.headers.get("X-Goog-Upload-URL");
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: constants.UPLOADER_HEADERS,
      body: video,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload video: ${uploadResponse.statusText}`);
    }

    // Giai đoạn 3: Lấy URL của video đã tải lên và download token. download token này sẽ quyết định quyền truy cập vào video
    const getUrl = `https://firebasestorage.googleapis.com/v0/b/locket-video/o/users%2F${userId}%2Fmoments%2Fvideos%2F${videoName}`;
    const getHeaders = {
      "content-type": "application/json; charset=UTF-8",
      authorization: `Bearer ${idToken}`,
    };

    const getResponse = await fetch(getUrl, {
      method: "GET",
      headers: getHeaders,
    });
    const downloadToken = (await getResponse.json()).downloadTokens;

    logInfo("uploadVideoToFirebaseStorage", "End");
    return `${getUrl}?alt=media&token=${downloadToken}`;
  } catch (error) {
    logError("uploadVideoToFirebaseStorage", error.message);
    throw error;
  }
};

const postVideoToLocket = async (idToken, videoUrl, thumbnailUrl, caption) => {
  try {
    const postHeaders = {
      "content-type": "application/json",
      authorization: `Bearer ${idToken}`,
    };

    const data = {
      data: {
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl,
        md5: getMd5Hash(videoUrl),
        recipients: [],
        analytics: {
          experiments: {
            flag_4: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "43",
            },
            flag_10: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "505",
            },
            flag_23: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "400",
            },
            flag_22: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "1203",
            },
            flag_19: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "52",
            },
            flag_18: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "1203",
            },
            flag_16: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "303",
            },
            flag_15: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "501",
            },
            flag_14: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "500",
            },
            flag_25: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "23",
            },
          },
          amplitude: {
            device_id: "BF5D1FD7-9E4D-4F8B-AB68-B89ED20398A6",
            session_id: {
              value: "1722437166613",
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
            },
          },
          google_analytics: {
            app_instance_id: "5BDC04DA16FF4B0C9CA14FFB9C502900",
          },
          platform: "ios",
        },
        sent_to_all: true,
        caption: caption,
        overlays: [
          {
            data: {
              text: caption,
              text_color: "#FFFFFFE6",
              type: "standard",
              max_lines: {
                "@type": "type.googleapis.com/google.protobuf.Int64Value",
                value: "4",
              },
              background: {
                material_blur: "ultra_thin",
                colors: [],
              },
            },
            alt_text: caption,
            overlay_id: "caption:standard",
            overlay_type: "caption",
          },
        ],
      },
    };

    const response = await fetch(constants.CREATE_POST_URL, {
      method: "POST",
      headers: postHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.statusText}`);
    }

    logInfo("postVideoToLocket", "End");
  } catch (error) {
    logError("postVideoToLocket", error.message);
    throw error;
  }
};

const postVideo = async (userId, idToken, video, caption) => {
  try {
    logInfo("postVideo", "Start");
    const videoAsBuffer = fs.readFileSync(video.path);
    const thumbnailUrl = await uploadThumbnailFromVideo(userId, idToken, video);

    if (!thumbnailUrl) {
      throw new Error("Failed to upload thumbnail");
    }

    const videoUrl = await uploadVideoToFirebaseStorage(
      userId,
      idToken,
      videoAsBuffer,
    );

    if (!videoUrl) {
      throw new Error("Failed to upload video");
    }

    await postVideoToLocket(idToken, videoUrl, thumbnailUrl, caption);

    logInfo("postVideo", "End");
  } catch (error) {
    logError("postVideo", error.message);
    throw error;
  } finally {
    fs.unlinkSync(video.path);
  }
};

//#endregion

function normalizeMoment(doc) {
  if (!doc || !doc.fields) return null;

  const f = doc.fields;
  const overlays = f.overlays?.arrayValue?.values || [];

  // chỉ lấy overlay đầu tiên (nếu có)
  const overlay = overlays[0]?.mapValue?.fields || {};
  const overlayData = overlay.data?.mapValue?.fields || {};

  const backgroundFields = overlayData.background?.mapValue?.fields || {};

  const getIsPublic = (f) => {
    const sentToAll = parseFirestoreValue(f.sent_to_all);
    const sentToSelfOnly = parseFirestoreValue(f.sent_to_self_only);

    // Ưu tiên sent_to_self_only nếu có true
    if (sentToSelfOnly) return false;
    if (sentToAll) return true;
    return false;
  };

  return {
    id: f.canonical_uid?.stringValue || doc.name.split("/").pop(),
    caption: f.caption?.stringValue || overlay.alt_text?.stringValue || "",
    user: f.user?.stringValue || null,
    thumbnailUrl: replaceFirebaseWithCDN(f.thumbnail_url?.stringValue),
    videoUrl: replaceFirebaseWithCDN(f.video_url?.stringValue),
    md5: f.md5?.stringValue || null,
    date: f.date?.timestampValue || doc.createTime || null,
    isPublic: getIsPublic(f),
    overlays: {
      id: overlay.overlay_id?.stringValue || null,
      type: overlay.overlay_type?.stringValue || null,
      text: overlayData.text?.stringValue || null,
      textColor: overlayData.text_color?.stringValue || null,
      maxLines: overlayData.max_lines?.integerValue
        ? parseInt(overlayData.max_lines.integerValue, 10)
        : null,
      background: {
        materialBlur:
          overlayData.background?.mapValue?.fields?.material_blur
            ?.stringValue || null,
        colors: parseFirestoreValue(backgroundFields.colors) || [],
      },
      icon: parseFirestoreValue(overlayData.icon),
      payload: parseFirestoreValue(overlayData.payload),
    },
    createTime: doc.createTime || null,
    updateTime: doc.updateTime || null,
  };
}

function normalizeMessage(doc) {
  if (!doc || !doc.fields) return null;

  const f = doc.fields;

  return {
    id: f.uid?.stringValue || doc.name?.split("/").pop(),
    members: f.members?.arrayValue?.values?.map((v) => v.stringValue) || [],
    unreadCount: parseInt(f.unread_count?.integerValue || "0", 10),
    isRead: f.is_read?.booleanValue || false,

    lastReadAt: f.last_read_at?.timestampValue || null,
    otherLastReadAt: f.other_last_read_at?.timestampValue || null,
    lastUpdated: f.last_updated?.timestampValue || null,

    sender: f.latest_message.mapValue.fields.sender?.stringValue || "",

    // Tin nhắn mới nhất
    latestMessage: f.latest_message?.mapValue?.fields
      ? {
          body: f.latest_message.mapValue.fields.body?.stringValue || "",
          sender: f.latest_message.mapValue.fields.sender?.stringValue || "",
          createdAt:
            f.latest_message.mapValue.fields.created_at?.timestampValue || null,
          replyMoment:
            f.latest_message.mapValue.fields.reply_moment?.stringValue || null,
          thumbnailUrl: replaceFirebaseWithCDN(
            f.latest_message.mapValue.fields.thumbnail_url?.stringValue
          ),
        }
      : null,

    otherLastDeliveredAt: f.other_last_delivered_at?.timestampValue || null,
    otherLastDeliveredMessageCreatedAt:
      f.other_last_delivered_message_created_at?.timestampValue || null,

    createTime: doc.createTime || null,
    updateTime: doc.updateTime || null,
  };
}

function replaceFirebaseWithCDN(url) {
  if (!url) return null; // hoặc "" nếu bạn muốn
  return url.replace(
    "https://firebasestorage.googleapis.com",
    "https://cdn.locketcamera.com"
  );
}

module.exports = {
  login,
  logout,
  getAllFriends,
  getLocketMoments,
  uploadImageToFirebaseStorage,
  postImage,
  uploadVideoToFirebaseStorage,
  postVideo,
};

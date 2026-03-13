const constants = require("./constants.js");
const fs = require("fs");
const { logInfo, logError } = require("../logger.service.js");
const crypto = require("crypto");

const videoService = require("./video-service.js");
const { decryptLoginData } = require("./security-service.js");

const login = async (email, password) => {
  logInfo("login Locket", "Start");
  const { decryptedEmail, decryptedPassword } = decryptLoginData(
    email,
    password,
  );

  const requestData = JSON.stringify({
    email: decryptedEmail,
    password: decryptedPassword,
    returnSecureToken: true,
    clientType: "CLIENT_TYPE_IOS",
  });

  try {
    const response = await fetch(constants.LOGIN_URL, {
      method: "POST",
      headers: constants.LOGIN_HEADERS,
      body: requestData,
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();

    logInfo("login Locket", "End");
    return data;
  } catch (error) {
    logError("login Locket", error.message);
    throw error;
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

module.exports = {
  login,
  uploadImageToFirebaseStorage,
  postImage,
  uploadVideoToFirebaseStorage,
  postVideo,
};

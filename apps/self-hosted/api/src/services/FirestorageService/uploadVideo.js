const videoService = require("../DataProcessing/generateThumbnail.js");
const { instanceFirestoreUpload } = require("../../libs/index.js");
const { uploadImageToFirebaseStorage } = require("./uploadImage.js");
const { logError, logInfo } = require("../../utils/logEventUtils.js");

//#region Video handlers

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

    try {
      await instanceFirestoreUpload.put(uploadUrl, video);
    } catch (err) {
      console.error("Upload error:", err);
      throw new Error("Failed to upload image");
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

//#endregion

module.exports = {
  uploadVideoToFirebaseStorage,
  uploadThumbnailFromVideo,
};

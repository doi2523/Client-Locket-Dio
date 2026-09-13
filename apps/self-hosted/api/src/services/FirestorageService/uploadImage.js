const fs = require("fs");
const { logInfo, logError } = require("../../utils/logEventUtils");
const { instanceFirestoreUpload } = require("../../libs");

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

    if (!uploadUrl) {
      throw new Error("Firebase did not return upload URL");
    }
    // Bước 2: Tải dữ liệu hình ảnh lên thông qua URL resumable trả về từ bước 1
    let imageBuffer;
    if (image instanceof Buffer) {
      imageBuffer = image;
    } else {
      imageBuffer = fs.readFileSync(image.path);
    }

    try {
      await instanceFirestoreUpload.put(uploadUrl, imageBuffer);
    } catch (err) {
      console.error("Upload error:", err);
      throw new Error("Failed to upload image");
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
//#endregion

module.exports = {
  uploadImageToFirebaseStorage,
};

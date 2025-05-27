import { showError } from "../../components/Toast";
import { checkAndRefreshIdToken } from "../auth";
import {
  prepareMediaInfo,
  uploadToCloudinary,
} from "../cloudinary/uploadFileAndGetInfo";
import { checkAndRefreshToken, getToken } from "../storage"; // Import hàm getToken từ utils

export const createRequestPayload = (mediaInfo, caption, selectedColors) => {
  // Lấy token bằng getToken()
  const { idToken, localId } = getToken() || {};

  if (!idToken || !localId) {
    showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    return null;
  }

  const tokenData = {
    idToken,
    localId,
  };

  const optionsData = {
    caption,
    text_color: "#FFFFFF",
    colorTop: selectedColors.top,
    colorBottom: selectedColors.bottom,
  };

  return {
    userData: tokenData,
    options: optionsData,
    model: "uploadmediaV1",
    mediaInfo,
  };
};

//Payload cho phiên bản mới hơn, sử dụng checkAndRefreshIdToken
//Payload của PostMoments
export const createRequestPayloadV2 = async (mediaInfo, postOverlay) => {
  try {
    // Lấy token
    const { idToken, localId, refreshToken } = getToken() || {};

    if (!idToken || !localId) {
      showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }

    // Kiểm tra và làm mới token nếu cần
    const freshIdToken = await checkAndRefreshIdToken(idToken, refreshToken);

    const tokenData = {
      idToken: freshIdToken || idToken,
      localId,
    };

    const optionsData = {
      caption: postOverlay.caption,
      overlay_id: postOverlay.overlay_id,
      type: postOverlay.type,
      icon: postOverlay.icon,
      text_color: postOverlay.text_color,
      color_top: postOverlay.color_top,
      color_bottom: postOverlay.color_bottom,
    };

    return {
      userData: tokenData,
      options: optionsData,
      model: "uploadmediaV2",
      mediaInfo,
    };
  } catch (error) {
    console.error("Lỗi tạo payload:", error);
    showError("Đã xảy ra lỗi khi tạo dữ liệu gửi đi.");
    return null;
  }
};


// utils.js
export const createRequestPayloadV3 = async (
  selectedFile,
  previewType,
  postOverlay
) => {
  try {
    const { idToken, localId, refreshToken } = getToken() || {};

    const freshIdToken = await checkAndRefreshToken(
      idToken,
      refreshToken
    );

    if (!idToken || !localId) {
      showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }

    const fileData = await uploadToCloudinary(selectedFile, previewType);
    const mediaInfo = prepareMediaInfo(fileData);

    const optionsData = {
      caption: postOverlay.caption,
      overlay_id: postOverlay.overlay_id,
      type: postOverlay.type,
      icon: postOverlay.icon,
      text_color: postOverlay.text_color,
      color_top: postOverlay.color_top,
      color_bottom: postOverlay.color_bottom,
    };

    return {
      userData: { idToken, localId },
      options: optionsData,
      model: "Version-UploadmediaV3.1",
      mediaInfo,
    };
  } catch (error) {
    console.error("Lỗi khi tạo payload:", error);
    throw error;
  }
};

//tạo payload tải file lên cloudinary xử lý và lấy thông tin media
// Sắp xếp payload gửi lên Server
//Payload của LocketUI
export const createRequestPayloadV4 = async (
  selectedFile,
  previewType,
  postOverlay,
  audience,
  selectedRecipients
) => {
  try {
    // Lấy token
    const { idToken, localId, refreshToken } = getToken() || {};

    if (!idToken || !localId) {
      showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }
    // Kiểm tra và làm mới token nếu cần
    const freshIdToken = await checkAndRefreshIdToken(idToken, refreshToken);

    // Upload file & chuẩn bị thông tin media
    const fileData = await uploadToCloudinary(selectedFile, previewType);
    const mediaInfo = prepareMediaInfo(fileData);

    // Chuẩn bị dữ liệu tùy chọn (caption, overlay, v.v.)
    const optionsData = {
      caption: postOverlay.caption,
      overlay_id: postOverlay.overlay_id,
      type: postOverlay.type,
      icon: postOverlay.icon,
      text_color: postOverlay.text_color,
      color_top: postOverlay.color_top,
      color_bottom: postOverlay.color_bottom,
      audience, // Gắn audience vào options luôn
      recipients: audience === "selected" ? selectedRecipients : [],
    };

    // Tạo payload cuối cùng
    const payload = {
      userData: { idToken: freshIdToken, localId },
      options: optionsData,
      model: "Version-UploadmediaV3.1",
      mediaInfo,
    };

    return payload;
  } catch (error) {
    console.error("Lỗi khi tạo payload:", error);
    throw error;
  }
};


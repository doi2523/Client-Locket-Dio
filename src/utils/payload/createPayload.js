import { showError } from "../../components/Toast";
import {
  prepareMediaInfo,
  uploadToCloudinary,
} from "../cloudinary/uploadFileAndGetInfo";
import { getToken } from "../storage"; // Import hàm getToken từ utils

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

export const createRequestPayloadV2 = (mediaInfo, postOverlay) => {
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
};

// utils.js
export const createRequestPayloadV3 = async (
  selectedFile,
  previewType,
  postOverlay
) => {
  try {
    const { idToken, localId, refreshToken } = getToken() || {};

    const freshIdToken = await checkAndRefreshIdToken(
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

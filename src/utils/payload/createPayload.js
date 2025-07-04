import { showError, showInfo } from "../../components/Toast";
import { getCurrentUserTokenAndUid } from "../auth";
import {
  prepareMediaInfo,
  uploadToCloudinary,
} from "../cloudinary/uploadFileAndGetInfo";
import { uploadFileAndGetInfo } from "../firebase/uploadfiletofirebase";
import { getToken } from "../storage";

export const createRequestPayload = (mediaInfo, caption, selectedColors) => {
  // Lấy token bằng getToken()
  // const { idToken, localId } = getToken() || {};

  // if (!idToken || !localId) {
  //   showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
  //   return null;
  // }

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
    // Đợi lấy token & uid
    const auth = await utils.getCurrentUserTokenAndUid();

    if (!auth) {
      console.error("Không lấy được token và uid hiện tại.");
      return [];
    }

    const { idToken, localId, refreshToken } = auth;

    const tokenData = {
      idToken: idToken,
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
    // Đợi lấy token & uid
    const auth = await getCurrentUserTokenAndUid();

    if (!auth) {
      console.error("Không lấy được token và uid hiện tại.");
      return [];
    }

    const { idToken, localId, refreshToken } = auth;

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
    // Đợi lấy token & uid
    const auth = await getCurrentUserTokenAndUid();

    if (!auth) {
      console.error("Không lấy được token và uid hiện tại.");
      return [];
    }

    const { idToken, localId, refreshToken } = auth;

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
      music: postOverlay?.music || "",
    };

    // Tạo payload cuối cùng
    const payload = {
      userData: { idToken: idToken, localId },
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
//Bản chính mới nhất
export const createRequestPayloadV5 = async (
  selectedFile,
  previewType,
  postOverlay,
  audience,
  selectedRecipients
) => {
  try {
    const { localId } = getToken() || {};
    
    if (!localId) {
      showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }
    // Upload file & chuẩn bị thông tin media
    const fileInfo = await uploadFileAndGetInfo(
      selectedFile,
      previewType,
      localId
    );
    // console.log(fileInfo);

    const mediaInfo = {
      url: fileInfo.downloadURL,
      path: fileInfo.metadata.fullPath, // đường dẫn đầy đủ trong Storage
      name: fileInfo.metadata.name, // tên file
      size: fileInfo.metadata.size, // kích thước file (bytes)
      contentType: fileInfo.metadata.contentType, // loại file (image/jpg,...)
      timeCreated: fileInfo.metadata.timeCreated, // thời gian tạo
      type: previewType,
    };

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
      music: postOverlay?.music || "",
    };

    // Tạo payload cuối cùng
    const payload = {
      // userData: { idToken: idToken, localId },
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

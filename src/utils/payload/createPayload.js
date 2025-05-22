import { prepareMediaInfo, uploadToCloudinary } from "../cloudinary/uploadFileAndGetInfo";
import { getAuthCookies } from "../cookie/cookieUtils";

export const createRequestPayload = (mediaInfo, caption, selectedColors) => {
  // Tạo đối tượng token (bao gồm idToken và localId)
  const { idToken, localId } = getAuthCookies();
  const tokenData = {
    idToken: idToken,
    localId: localId,
  };

  // Tạo đối tượng options (bao gồm các lựa chọn như caption, colors...)
  const optionsData = {
    caption: caption,
    text_color: "#FFFFFF",
    colorTop: selectedColors.top,
    colorBottom: selectedColors.bottom,
  };

  // Tạo đối tượng payload chứa tất cả dữ liệu cần gửi
  const payload = {
    userData: tokenData,
    options: optionsData,
    model: "uploadmediaV1",
    mediaInfo: mediaInfo,
  };

  return payload;
};
export const createRequestPayloadV2 = (mediaInfo, postOverlay) => {
  // Tạo đối tượng token (bao gồm idToken và localId)
  const { idToken, localId } = getAuthCookies();
  const tokenData = {
    idToken: idToken,
    localId: localId,
  };
  // Tạo đối tượng options (bao gồm các lựa chọn như caption, colors...)
  const optionsData = {
    caption: postOverlay.caption,
    overlay_id: postOverlay.overlay_id,
    type: postOverlay.type,
    icon: postOverlay.icon,
    text_color: postOverlay.text_color,
    color_top: postOverlay.color_top,
    color_bottom: postOverlay.color_bottom,
  };

  // Tạo đối tượng payload chứa tất cả dữ liệu cần gửi
  const payload = {
    userData: tokenData,
    options: optionsData,
    model: "uploadmediaV2",
    mediaInfo: mediaInfo,
  };

  return payload;
};

// utils.js
//Main
export const createRequestPayloadV3 = async (selectedFile, previewType, postOverlay) => {
  try {
    // Upload file lên Cloudinary
    const fileData = await uploadToCloudinary(selectedFile, previewType);
    const mediaInfo = prepareMediaInfo(fileData);

    // Lấy token từ cookie
    const { idToken, localId } = getAuthCookies();
    const tokenData = {
      idToken: idToken,
      localId: localId,
    };

    // Tạo đối tượng options (bao gồm các lựa chọn như caption, colors...)
    const optionsData = {
      caption: postOverlay.caption,
      overlay_id: postOverlay.overlay_id,
      type: postOverlay.type,
      icon: postOverlay.icon,
      text_color: postOverlay.text_color,
      color_top: postOverlay.color_top,
      color_bottom: postOverlay.color_bottom,
    };

    // Tạo đối tượng payload chứa tất cả dữ liệu cần gửi
    const payload = {
      userData: tokenData,
      options: optionsData,
      model: "Version-UploadmediaV3.1",
      mediaInfo: mediaInfo,
    };

    return payload;
  } catch (error) {
    console.error("Lỗi khi tạo payload:", error);
    throw error;
  }
};

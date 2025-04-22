import { getAuthCookies } from "../cookie/cookieUtils";
import { getAuthStorage } from "../storage";

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
export const createRequestPayloadV2 = (mediaInfo, caption, selectedColors) => {
  // Tạo đối tượng token (bao gồm idToken và localId)
  const { idToken, localId } = getAuthCookies();
  const tokenData = {
    idToken: idToken,
    localId: localId,
  };

  // Tạo đối tượng options (bao gồm các lựa chọn như caption, colors...)
  const optionsData = {
    caption: caption,
    theme_caption: selectedColors.caption,
    id: selectedColors.preset_id,
    type: selectedColors.type,
    icon: selectedColors.icon,
    text_color: selectedColors.text_color,
    colorTop: selectedColors.top,
    colorBottom: selectedColors.bottom,
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
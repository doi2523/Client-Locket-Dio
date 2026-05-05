import { getToken } from "@/utils";
import { uploadFileAndGetInfoR2 } from "./StorageServices";
import { useOverlayEditorStore, usePostStore, useStreakStore } from "@/stores";
import { SonnerWarning } from "@/components/ui/SonnerToast";

// Hàm con xác định recipients
const determineRecipients = (audience, selectedRecipients, localId) => {
  if (audience === "selected") return selectedRecipients || [];
  if (audience === "private") return localId ? [localId] : [];
  // Trường hợp public hoặc khác trả về mảng rỗng
  return [];
};

export const createRequestPayloadV4 = async (selectedFile, previewType) => {
  try {
    const { localId } = getToken() || {};

    const restoreStreakData = usePostStore.getState().restoreStreakData;

    const overlayData = useOverlayEditorStore.getState().overlayData;

    const audience = usePostStore.getState().audience;
    const selectedRecipients = usePostStore.getState().selectedRecipients;

    if (!restoreStreakData) {
      SonnerWarning("Dữ liệu khôi phục không hợp lệ vui lòng chọn lại!");
      return null;
    }

    if (!localId) {
      SonnerWarning("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }
    // Upload file & chuẩn bị thông tin media
    const fileInfo = await uploadFileAndGetInfoR2(
      selectedFile,
      previewType,
      localId,
    );
    // console.log(fileInfo);

    const mediaInfo = {
      ...fileInfo,
      type: previewType,
    };

    const optionsDataObj = {
      ...overlayData,
      audience, // Gắn audience vào options luôn
      recipients: determineRecipients(audience, selectedRecipients, localId),
    };

    // Chỉ thêm restoreStreakDate nếu mode là "restore"
    if (restoreStreakData?.mode === "restore") {
      optionsDataObj.restoreStreakDate = restoreStreakData;
      optionsDataObj.restoreStreakData = restoreStreakData;
    }

    // Tạo payload cuối cùng
    const payload = {
      optionsData: optionsDataObj,
      model: "Version-UploadmediaV3.1",
      mediaInfo,
      contentType: previewType,
    };

    return payload;
  } catch (error) {
    console.error("Lỗi khi tạo payload:", error);
    throw error;
  }
};

export const createRequestPayloadV6 = async (selectedFile, previewType) => {
  try {
    const { localId } = getToken() || {};

    const streakData = useStreakStore.getState().getTodayIfNotUpdated();

    const overlayData = useOverlayEditorStore.getState().overlayData;

    const audience = usePostStore.getState().audience;
    const selectedRecipients = usePostStore.getState().selectedRecipients;

    if (!localId) {
      SonnerWarning("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }
    // Upload file & chuẩn bị thông tin media
    const fileInfo = await uploadFileAndGetInfoR2(
      selectedFile,
      previewType,
      localId,
    );
    // console.log(fileInfo);

    const mediaInfo = {
      ...fileInfo,
      type: previewType,
    };

    // Chuẩn bị dữ liệu tùy chọn (caption, overlay, v.v.)
    const optionsDataObj = {
      ...overlayData,
      audience, // Gắn audience vào options luôn
      recipients: determineRecipients(audience, selectedRecipients, localId),
    };

    //Gửi dữ liệu streak (nếu có) để backend quyết định có Streak hay không
    if (streakData) {
      optionsDataObj.streakData = streakData;
    }
    // Tạo payload cuối cùng
    const payload = {
      model: "Version-UploadmediaV3.1",
      mediaInfo,
      contentType: previewType,
      optionsData: optionsDataObj, // Thêm optionsData vào payload
    };

    return payload;
  } catch (error) {
    console.error("Lỗi khi tạo payload:", error);
    throw error;
  }
};

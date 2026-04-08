import React, { useRef, useCallback, useEffect } from "react";
import {
  FolderOpen,
  RotateCcw,
  Send,
  Palette,
  Pencil,
  FileImage,
} from "lucide-react";
import * as utils from "@/utils";
import * as services from "@/services";
import LoadingRing from "@/components/ui/Loading/ring.jsx";
import { useApp } from "@/context/AppContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import Hourglass from "@/components/ui/Loading/hourglass.jsx";
import MediaSizeInfo from "@/components/ui/MediaSizeInfo";
import { getMaxUploads } from "@/hooks/useFeature.js";
import PlanBadge from "@/components/ui/PlanBadge/PlanBadge.jsx";
import {
  SonnerError,
  SonnerInfo,
  SonnerSuccess,
  SonnerWarning,
} from "@/components/ui/SonnerToast";
import {
  useAuthStore,
  useOverlayEditorStore,
  usePostStore,
  useStreakStore,
  useUploadQueueStore,
} from "@/stores";
import { getCaptionStyle } from "@/helpers/styleHelpers";

const RestoreStreak = () => {
  const { post, useloading } = useApp();
  const navigate = useNavigate();
  const uploadStats = useAuthStore((s) => s.uploadStats);
  const { sendLoading, setSendLoading, uploadLoading } = useloading;

  const {
    preview,
    setPreview,
    selectedFile,
    setSelectedFile,
    isSizeMedia,
    setSizeMedia,
    setImageToCrop,
  } = post;

  const overlayData = useOverlayEditorStore((s) => s.overlayData);
  const updateOverlayEditor = useOverlayEditorStore(
    (s) => s.updateOverlayEditor,
  );
  const resetOverlayEditor = useOverlayEditorStore((s) => s.resetOverlayEditor);

  const { fetchStreak } = useStreakStore();
  const restoreStreakData = usePostStore((s) => s.restoreStreakData);
  const setRestoreStreakData = usePostStore((s) => s.setRestoreStreakData);

  const { maxImageSizeMB, maxVideoSizeMB, storage_limit_mb } = getMaxUploads();
  const savePostedMoment = useUploadQueueStore((s) => s.savePostedMoment);
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback(async (event) => {
    const rawFile = event.target.files[0];
    if (!rawFile) return;

    const localPreviewUrl = URL.createObjectURL(rawFile);
    const fileType = rawFile.type.startsWith("image/")
      ? "image"
      : rawFile.type.startsWith("video/")
        ? "video"
        : null;

    if (!fileType) {
      SonnerInfo("Chỉ hỗ trợ ảnh và video.");
      return;
    }
    const fileSizeInMB = rawFile.size / (1024 * 1024);
    setSizeMedia(fileSizeInMB.toFixed(2));

    if (fileType === "image") {
      setImageToCrop(localPreviewUrl);
      return;
    }
    setPreview({ type: fileType, data: localPreviewUrl });

    setSelectedFile(rawFile);
  }, []);

  const goToRestoreStreakTab = () => {
    navigate("/tools#restore-streak", { replace: true });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      SonnerInfo("Vui lòng chọn file để tải lên.");
      return;
    }
    if (
      storage_limit_mb !== -1 &&
      uploadStats?.total_storage_used_mb > storage_limit_mb
    ) {
      SonnerWarning("Dung lượng sử dụng vượt quá giới hạn của gói hiện tại!");
      return;
    }

    try {
      setSendLoading(true);
      const payload = await services.createRequestPayloadV4(
        selectedFile,
        preview.type,
      );

      if (!payload) {
        throw new Error("Không tạo được payload. Hủy tiến trình tải lên.");
      }
      // console.log("Payload:", payload);

      SonnerInfo("Đợi chút nhé", `Đang tạo bài viết !`);
      // Gọi API upload
      const response = await services.uploadMediaV2(payload);

      // Nếu response.data null thì dùng mảng rỗng hoặc object trống
      const normalizedNewData = response?.data
        ? utils.normalizeMoment(response.data)
        : [];
      const hasData = Array.isArray(normalizedNewData)
        ? normalizedNewData.length > 0
        : Object.keys(normalizedNewData).length > 0;

      // Chỉ lưu khi có dữ liệu chuẩn hoá
      if (hasData) {
        savePostedMoment(payload, normalizedNewData);
        SonnerSuccess(restoreStreakData.name, "Hãy kiểm tra chuỗi của bạn!");
      } else {
        console.warn("Dữ liệu upload trả về rỗng hoặc không hợp lệ");
        SonnerError(
          restoreStreakData.name,
          "Thất bại không có dữ liệu trả về!",
        );
      }

      fetchStreak();

      savePostedMoment(payload, normalizedNewData);

      SonnerSuccess(
        "Đăng tải thành công!",
        `${preview.type === "video" ? "Video" : "Hình ảnh"} đã được tải lên!`,
      );

      setPreview(null);
      setSelectedFile(null);
      resetOverlayEditor();
      setRestoreStreakData(null);
      goToRestoreStreakTab();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Lỗi không xác định";
      SonnerError("Lỗi khi tải lên", errorMessage);
      console.error("Lỗi khi gửi bài:", error);
    } finally {
      setSendLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log("overlayData", overlayData);
  // }, [overlayData]);

  const updateOverlayField = (key, value) => {
    // Caption = text (KHÔNG đổi type)
    if (key === "caption") {
      updateOverlayEditor({
        caption: value,
        text: value,
        is_editable: true,
      });
      return;
    }

    // Các thay đổi liên quan đến style => luôn custom
    const setCustom = (data) => {
      updateOverlayEditor({
        ...data,
        type: "custom",
      });
    };

    // Text color
    if (key === "text_color") {
      setCustom({
        text_color: value,
      });
      return;
    }

    // Update color theo index
    if (key === "update_color") {
      let colors = [...(overlayData.background.colors || [])];
      colors[value.index] = value.color;
      colors = ensureMinColors(colors);

      setCustom({
        background: {
          ...overlayData.background,
          colors,
        },
      });
      return;
    }

    // Add color
    if (key === "add_color") {
      let colors = overlayData.background.colors || [];

      if (colors.length >= 4) {
        SonnerWarning("Tối đa 4 màu gradient");
        return;
      }

      if (colors.length === 0) {
        colors = ["#000000", "#000000"];
      } else if (colors.length === 1) {
        colors = [colors[0], colors[0]];
      } else {
        colors = [...colors, "#000000"];
      }

      setCustom({
        background: {
          ...overlayData.background,
          colors,
        },
      });
      return;
    }

    // Remove color
    if (key === "remove_color") {
      const colors = overlayData.background.colors || [];

      if (colors.length <= 2) {
        SonnerWarning("Gradient cần ít nhất 2 màu");
        return;
      }

      const newColors = colors.filter((_, i) => i !== value);

      setCustom({
        background: {
          ...overlayData.background,
          colors: newColors,
        },
      });
      return;
    }

    // Reset => default
    if (key === "reset") {
      updateOverlayEditor({
        type: "default",
        caption: "",
        text: "",
        text_color: "#FFFFFF",
        background: {
          colors: ["#000000", "#000000"],
        },
      });
    }
  };

  const colorsRender =
    overlayData?.background?.colors?.length >= 2
      ? overlayData.background.colors
      : ["#000000", "#000000"]; // fallback 2 màu mặc định

  const ensureMinColors = (colors = []) => {
    if (colors.length === 0) return ["#000000", "#000000"];
    if (colors.length === 1) return [colors[0], colors[0]];
    return colors;
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen bg-base-200">
      <div className="p-6 rounded-lg shadow-md w-full max-w-md bg-base-100">
        <h2 className="text-3xl font-semibold mb-4 text-center">
          {restoreStreakData?.name || "Chế độ khôi phục chuỗi"}
        </h2>

        <div
          className="border-2 border-base-content border-dashed rounded-md p-4 cursor-pointer flex items-center justify-center gap-2"
          onClick={() => fileInputRef.current.click()}
        >
          <FolderOpen size={20} />
          <p>Click để chọn file (video/ảnh)</p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
          />
        </div>

        <div className="text-left">
          <p className="text-sm text-error mt-2">
            Hệ thống chỉ hỗ trợ ảnh tối đa{" "}
            <span className="underline font-semibold">{maxImageSizeMB}MB</span>{" "}
            và video tối đa{" "}
            <span className="underline font-semibold">{maxVideoSizeMB}MB</span>.
            Nếu gặp lỗi khi tải lên, bạn có thể thử lại sau hoặc gửi ảnh/video
            qua Zalo/Messenger và tải lại.
            <Link to="/docs" className="underline">
              {" "}
              Xem thêm
            </Link>
          </p>
        </div>

        {/* Preview */}
        <div className="text-center my-3 mb-10">
          <h2 className="text-3xl font-semibold mb-2">Preview</h2>
          <div className="relative w-full max-w-[400px] rounded-[40px] aspect-square border border-base-content overflow-hidden flex items-center justify-center">
            {uploadLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50 gap-3 text-white text-lg font-medium">
                <Hourglass
                  size={50}
                  stroke={2}
                  bgOpacity={0.1}
                  speed={1.5}
                  color="white"
                />
                <div>Đang xử lý tệp...</div>
              </div>
            ) : preview ? (
              preview.type === "video" ? (
                <video
                  src={preview.data}
                  autoPlay
                  loop
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={preview.data}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="flex flex-col items-center">
                <FileImage size={80} />
                <p className="mt-2 text-sm">Chưa có file</p>
              </div>
            )}

            {overlayData?.caption && !uploadLoading && (
              <div className="absolute bottom-4 w-auto px-3">
                <div
                  className="text-white font-semibold py-2 px-4 rounded-3xl bg-black/40 backdrop-blur-3xl"
                  style={{
                    ...getCaptionStyle(
                      overlayData.background,
                      overlayData.text_color,
                    ),
                  }}
                >
                  {overlayData?.caption}
                </div>
              </div>
            )}
          </div>
          <MediaSizeInfo />
        </div>

        {/* Caption & Color */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Customize Caption </h2>

          {/* Hiển thị chế độ khôi phục / nối tiếp + số ngày */}
          {restoreStreakData?.mode && (
            <div className="mb-4 p-3 rounded-md bg-blue-100 text-blue-800 text-center font-semibold">
              <p className="mb-1">{restoreStreakData.name}</p>
              {restoreStreakData.data && (
                <p>Số ngày đã chọn: {restoreStreakData.data}</p>
              )}
            </div>
          )}

          <div className="p-4 rounded-md shadow-md border">
            <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
              <div className="flex flex-row items-center">
                <Pencil size={20} className="mr-2" /> Caption
              </div>{" "}
              <PlanBadge />
            </h3>
            <input
              type="text"
              className="w-full p-2 border shadow-md rounded-xl mb-4"
              placeholder="Thêm một tin nhắn"
              value={overlayData?.caption}
              onChange={(e) => {
                updateOverlayField("caption", e.target.value);
              }}
            />
            <h3 className="text-lg font-semibold mb-1 flex items-center">
              <Palette size={20} className="mr-1" /> Chọn màu
            </h3>
            <p className="text-left text-sm mb-3 text-primary">
              Note: 2 đen 1 trắng là mặc định caption sẽ không có màu
            </p>
            {/* Text color */}
            <div className="flex items-center justify-between mb-4">
              <label className="font-medium">Màu chữ</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={overlayData?.text_color || "#ffffff"}
                  onChange={(e) =>
                    updateOverlayField("text_color", e.target.value)
                  }
                  className="w-10 h-10 rounded-md border p-1"
                />
              </div>
            </div>
            <p className="font-medium text-left">Màu nền</p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {colorsRender.map((color, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <label className="text-sm font-medium">Màu {index + 1}</label>

                  <input
                    type="color"
                    value={color}
                    onChange={(e) =>
                      updateOverlayField("update_color", {
                        index,
                        color: e.target.value,
                      })
                    }
                    className="w-10 h-10 rounded-md border p-1"
                  />

                  {colorsRender.length > 2 && (
                    <button
                      onClick={() => updateOverlayField("remove_color", index)}
                      className="text-xs text-red-500"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3 my-4">
              <button
                onClick={() => updateOverlayField("add_color")}
                className="btn btn-sm"
              >
                + Thêm màu
              </button>
            </div>

            {/* Reset */}
            <div className="flex justify-center pt-2 border-t">
              <button
                onClick={resetOverlayEditor}
                className="flex items-center gap-2 px-4 py-2 rounded-md shadow-sm btn"
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Nút gửi */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="btn btn-primary rounded-xl disabled:bg-gray-400"
            disabled={
              sendLoading ||
              (preview?.type === "image" && isSizeMedia > maxImageSizeMB) ||
              (preview?.type === "video" && isSizeMedia > maxVideoSizeMB)
            }
          >
            {sendLoading ? (
              <>
                <LoadingRing size={20} stroke={3} speed={2} color="white" />
                <span>Đang tải lên...</span>
              </>
            ) : (
              <>
                <span>Đăng bài viết</span>
                <Send size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreStreak;

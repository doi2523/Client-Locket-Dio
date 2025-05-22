import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  FolderOpen,
  RotateCcw,
  Send,
  Palette,
  Pencil,
  FileImage,
} from "lucide-react";
import { showToast } from "../../../components/Toast/index.jsx";
import * as lockerService from "../../../services/locketService.js";
import * as utils from "../../../utils";
import LoadingRing from "../../../components/UI/Loading/ring.jsx";
import { useApp } from "../../../context/AppContext.jsx";
import { Link } from "react-router-dom";
import Hourglass from "../../../components/UI/Loading/hourglass.jsx";
import MediaSizeInfo from "../../../components/UI/MediaSizeInfo/index.jsx";
import { defaultPostOverlay } from "../../../storages/usePost.js";

const PostMoments = () => {
  const { post, useloading } = useApp();
  const { sendLoading, setSendLoading, uploadLoading } = useloading;

  const {
    caption,
    setCaption,
    preview,
    setPreview,
    selectedFile,
    setSelectedFile,
    selectedColors,
    setSelectedColors,
    isSizeMedia,
    setSizeMedia,
    postOverlay,
    setPostOverlay,
  } = post;

  const fileInputRef = useRef(null);

  // Đồng bộ caption và màu từ postOverlay → state
  useEffect(() => {
    setCaption(postOverlay.caption || "");
  }, [postOverlay.caption]);

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
      showToast("error", "Chỉ hỗ trợ ảnh và video.");
      return;
    }

    setPreview({ type: fileType, data: localPreviewUrl });

    const fileSizeInMB = rawFile.size / (1024 * 1024);
    setSizeMedia(fileSizeInMB.toFixed(2));
    setSelectedFile(rawFile);
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) {
      showToast("error", "Không có dữ liệu để tải lên.");
      return;
    }

    try {
      setSendLoading(true);
      showToast("info", `Đang chuẩn bị ${preview.type === "video" ? "video" : "ảnh"} !`);

      const fileData = await utils.uploadToCloudinary(
        selectedFile,
        preview.type
      );

      const mediaInfo = utils.prepareMediaInfo(fileData);
      const payload = utils.createRequestPayloadV2(mediaInfo, postOverlay);
      // console.log("Payload:", payload);
      
      showToast("info", `Đang tạo bài viết !`);
      await lockerService.uploadMediaV2(payload);

      showToast("success", `${fileData.type === "video" ? "Video" : "Hình ảnh"} đã được tải lên!`);

      setPreview(null);
      setSelectedFile(null);
      setPostOverlay(defaultPostOverlay);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Lỗi không xác định";
      showToast("error", `Lỗi khi tải lên: ${errorMessage}`);
      console.error("Lỗi khi gửi bài:", error);
    } finally {
      setSendLoading(false);
    }
  };

  const updateOverlayField = (key, value) => {
    setPostOverlay((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen bg-base-200">
      <div className="h-16" />
      <div className="p-6 rounded-lg shadow-md w-full max-w-md bg-base-100">
        <h2 className="text-3xl font-semibold mb-4 text-center">
          Upload Video hoặc Ảnh
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
            Hệ thống chỉ hỗ trợ ảnh tối đa 1MB và video tối đa 10MB. Nếu gặp lỗi
            khi tải lên, bạn có thể thử lại sau hoặc gửi ảnh/video qua Zalo/Messenger và tải lại.
            <Link to="/docs" className="underline"> Xem thêm</Link>
          </p>
          <p className="text-sm text-error">Chế độ demo nếu có lỗi vui lòng báo với QTV</p>
        </div>

        {/* Preview */}
        <div className="text-center my-3 mb-10">
          <h2 className="text-3xl font-semibold mb-2">Preview</h2>
          <div className="relative w-full max-w-[400px] rounded-[40px] aspect-square border border-base-content overflow-hidden flex items-center justify-center">
            {uploadLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50 gap-3 text-white text-lg font-medium">
                <Hourglass size={50} stroke={2} bgOpacity={0.1} speed={1.5} color="white" />
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

            {caption && !uploadLoading && (
              <div className="absolute bottom-4 w-auto px-3">
                <div
                  className="text-white font-semibold backdrop-blur-3xl py-2 px-4 rounded-3xl"
                  style={{
                    background: `linear-gradient(to bottom, ${postOverlay.color_top}, ${postOverlay.color_bottom})`,
                    color: postOverlay.text_color,
                  }}
                >
                  {caption}
                </div>
              </div>
            )}
          </div>
          <MediaSizeInfo />
        </div>

        {/* Caption & Color */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Customize Caption</h2>
          <div className="p-4 rounded-md shadow-md border">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Pencil size={20} className="mr-2" /> Caption
            </h3>
            <input
              type="text"
              className="w-full p-2 border shadow-md rounded-xl mb-4"
              placeholder="Thêm một tin nhắn"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                updateOverlayField("caption", e.target.value);
              }}
            />
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Palette size={20} className="mr-1" /> Chọn màu
            </h3>
            <div className="flex justify-center items-center gap-4">
              {[
                {
                  label: "Màu trên",
                  key: "color_top",
                  value: postOverlay.color_top || "#00FA9A",
                },
                {
                  label: "Màu dưới",
                  key: "color_bottom",
                  value: postOverlay.color_bottom || "#1E90FF",
                },
                {
                  label: "Màu chữ",
                  key: "text_color",
                  value: postOverlay.text_color || "#FFFFFF",
                },
              ].map(({ label, key, value }) => (
                <div key={key} className="flex flex-col items-center">
                  <label className="mb-1">{label}</label>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => updateOverlayField(key, e.target.value)}
                    className="w-10 h-10 rounded-md border p-1"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  updateOverlayField("color_top", "#FFFFFF");
                  updateOverlayField("color_bottom", "#FFFFFF");
                  updateOverlayField("text_color", "#FFFFFF");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md shadow-md mt-4 btn"
              >
                <RotateCcw size={20} /> Reset màu
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
              (preview?.type === "image" && isSizeMedia > 1) ||
              (preview?.type === "video" && isSizeMedia > 10)
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

export default PostMoments;

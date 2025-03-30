import React, { useState, useRef } from "react";
import {
  FolderOpen,
  Video,
  RotateCcw,
  Send,
  Palette,
  Pencil,
} from "lucide-react";
import { showToast } from "../../../components/Toast/index.jsx";
import * as lockerService from "../../../services/locketService.js";
import * as utils from "../../../utils";
import LoadingRing from "../../../components/UI/Loading/ring.jsx";
import { cropVideoToSquare } from "../../../helpers/Media/cropMedia.js";
import Hourglass from "../../../components/UI/Loading/hourglass.jsx";

const PostVideo = () => {
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [colorTop, setColorTop] = useState(null);
  const [colorBottom, setColorBottom] = useState(null);
  const [colorText, setColorText] = useState("#FFFFFF");

  const handleTriggerUploadFile = () => fileRef.current?.click();

  const handleSelectFile = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("video/")) {
      showToast("error", "Vui lòng chọn một tệp video!");
      return;
    }

    try {
      setLoading(true);
      const videoBlob = new Blob([selectedFile], { type: selectedFile.type });

      // Cắt video thành hình vuông
      const croppedBlob = await cropVideoToSquare(videoBlob, setCountdown);
      const videoUrl = URL.createObjectURL(croppedBlob);

      // Cập nhật state
      setSelectedFile({ type: "video", data: videoUrl });
      setPreviewUrl(videoUrl);
      setFile(croppedBlob); // ✅ Cập nhật file để upload

      setLoading(false);
      showToast("success", "Tải video thành công!");
    } catch (error) {
      console.error("Lỗi khi xử lý video:", error);
      showToast("error", "Không thể xử lý video!");
      setLoading(false);
    }
  };

  const handleUploadFile = async () => {
    if (!file) {
      showToast("error", "Vui lòng chọn video!");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("videos", file); // ✅ Sử dụng video đã xử lý
    console.log(file)
    formData.append("caption", caption);
    formData.append("idToken", utils.getAuthCookies().idToken);
    formData.append("localId", utils.getAuthCookies().localId);

    try {
      await lockerService.uploadMedia(formData);
      showToast("success", "Video đã được tải lên!");
    } catch (error) {
      showToast("error", "Lỗi khi tải video lên!");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen p-6 bg-base-200">
      <div className="h-16"></div>
      <div className="p-6 rounded-lg shadow-md w-full max-w-md bg-base-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Upload Video</h2>
          <div
            className="border-2 border-base-content border-dashed rounded-md p-4 cursor-pointer input-ghost flex items-center justify-center gap-2"
            onClick={handleTriggerUploadFile}
          >
            <FolderOpen size={20} />
            <p>Click để chọn video .mp4 nhỏ hơn 5mb</p>
            <input
              type="file"
              ref={fileRef}
              onChange={handleSelectFile}
              className="hidden"
              accept="video/*"
            />
          </div>
        </div>

        {/* Xem trước video */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Video Preview</h2>
          <div className="relative w-full max-w-[400px] rounded-[40px] aspect-square border border-base-content overflow-hidden flex items-center justify-center">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50 gap-3 text-white text-lg font-medium">
                <Hourglass
                  size={50}
                  stroke={2}
                  bgOpacity={0.1}
                  speed={1.5}
                  color="white"
                />
                <div>Đang xử lý video...</div>
                <div className="flex items-center gap-2 text-2xl font-bold">
                  <p>{countdown}s⏳</p>
                </div>
              </div>
            ) : selectedFile && selectedFile.type === "video" ? (
              <>
                <video
                  src={selectedFile.data}
                  autoPlay
                  loop
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  onClick={(e) => e.preventDefault()}
                />
                {caption && (
                  <div className="absolute bottom-4 w-auto px-3">
                    <div
                      style={{
                        background:
                          colorTop && colorBottom
                            ? `linear-gradient(to bottom, ${colorTop}, ${colorBottom})`
                            : "none",
                        color: colorText || "#FFFFFF",
                      }}
                      className="text-white font-semibold backdrop-blur-3xl py-1 rounded-4xl px-4 text-left"
                    >
                      {caption}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center">
                <Video size={80} />
                <p className="mt-2 text-sm">Chưa có video</p>
              </div>
            )}
          </div>
        </div>

        {/* Chỉnh caption */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Customize Caption</h2>
          <div className="p-4 rounded-md shadow-md w-full max-w-md border">
            <h3 className="text-lg font-semibold mb-3 text-left flex flex-row items-center">
              <Pencil size={20} className="mr-2" /> Caption
            </h3>
            <input
              type="text"
              className="w-full text-gray-500 dark:text-gray-400 p-2 border border-base-content shadow-md rounded-xl mb-4"
              placeholder="Thêm một tin nhắn"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <h3 className="text-lg font-semibold mb-3 text-left flex flex-row items-center">
              <Palette size={20} className="mr-1" /> Chọn màu
            </h3>
            <div className="flex justify-center items-center gap-4">
              <div className="flex flex-col items-center">
                <label className="mb-1">Màu trên</label>
                <input
                  type="color"
                  value={colorTop || ""}
                  onChange={(e) => setColorTop(e.target.value)}
                  className="w-10 h-10 rounded-md border border-base-content p-1"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="mb-1">Màu dưới</label>
                <input
                  type="color"
                  value={colorBottom || ""}
                  onChange={(e) => setColorBottom(e.target.value)}
                  className="w-10 h-10 rounded-md border border-base-content p-1"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="mb-1">Màu chữ</label>
                <input
                  type="color"
                  value={colorText || ""}
                  onChange={(e) => setColorText(e.target.value)}
                  className="w-10 h-10 rounded-md border border-base-content p-1"
                />
              </div>
            </div>

            {/* Reset màu */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  setColorTop(""); // Reset to default color for top
                  setColorBottom(""); // Reset to default color for bottom
                  setColorText("#FFFFFF");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md shadow-md btn"
              >
                <RotateCcw size={20} /> Reset màu
              </button>
            </div>
          </div>
        </div>

        {/* Nút gửi */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleUploadFile}
            className="btn btn-primary rounded-xl disabled:bg-gray-400"
            disabled={isUploading}
          >
            {isUploading ? (
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

export default PostVideo;

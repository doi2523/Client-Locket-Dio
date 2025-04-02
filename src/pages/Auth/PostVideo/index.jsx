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
import Hourglass from "../../../components/UI/Loading/hourglass.jsx";

const PostVideo = () => {
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [colorTop, setColorTop] = useState(null);
  const [colorBottom, setColorBottom] = useState(null);
  const [colorText, setColorText] = useState("#FFFFFF");

  const handleTriggerUploadFile = () => fileRef.current?.click();

  const handleSelectFile = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("video/")) {
      showToast("error", "Vui lòng chọn một tệp video!");
      return;
    }

    setLoading(true);

    const videoUrl = URL.createObjectURL(selectedFile);
    setSelectedFile({ type: "video", data: videoUrl });
    setPreviewUrl(videoUrl);
    setFile(selectedFile);

    setLoading(false);
    showToast("success", "Tải video thành công!");
  };

  const handleUploadFile = async () => {
    if (!file) {
      showToast("error", "Vui lòng chọn video!");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0); // Reset progress khi bắt đầu

    const formData = new FormData();
    formData.append("videos", file);
    formData.append("caption", caption);
    formData.append("text_color", colorText || "#FFFFFF");
    formData.append("colorTop", colorTop || "#00FA9A");
    formData.append("colorBottom", colorBottom || "#1E90FF");
    formData.append("idToken", utils.getAuthCookies().idToken);
    formData.append("localId", utils.getAuthCookies().localId);

    try {
      await lockerService.uploadMedia(formData, setUploadProgress);
      showToast("success", "Video đã được tải lên!");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const statusText = error.response.statusText || "Unknown Error";

        if (status === 413) {
          showToast("error", `Lỗi ${status}: Dung lượng file quá lớn!`);
        } else {
          showToast("error", `Lỗi ${status}: ${statusText}`);
        }
      } else {
        showToast("error", `Lỗi không xác định: ${error.message}`);
      }

      console.error("❌ Upload Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen p-6 bg-base-200">
      <div className="h-16"></div>
      <div className="p-6 rounded-lg shadow-md w-full max-w-md bg-base-100">
        <h2 className="text-3xl font-semibold mb-4 text-center">
          Upload Video
        </h2>

        {/* Chọn file */}
        <div
          className="border-2 border-base-content border-dashed rounded-md p-4 cursor-pointer flex items-center justify-center gap-2"
          onClick={handleTriggerUploadFile}
        >
          <FolderOpen size={20} />
          <p>Click để chọn video nhỏ hơn 5MB</p>
          <input
            type="file"
            ref={fileRef}
            onChange={handleSelectFile}
            className="hidden"
            accept="video/*"
          />
        </div>

        {/* Xem trước video */}
        <div className="text-center my-6">
          <h2 className="text-3xl font-semibold mb-4">Video Preview</h2>
          <div className="relative w-full max-w-[400px] rounded-[40px] aspect-square border border-base-content overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <>
                <video
                  src={previewUrl}
                  autoPlay
                  loop
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  alt="Preview Video"
                />
                {caption && (
                  <div className="absolute bottom-4 w-auto px-3">
                    <div
                      className="text-white font-semibold backdrop-blur-3xl py-1 px-4 rounded-xl"
                      style={{
                        background: `linear-gradient(to bottom, ${colorTop}, ${colorBottom})`,
                        color: colorText,
                      }}
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

          {/* Tiến trình tải lên */}
          {isUploading && (
            <div className="w-full bg-gray-300 rounded-md mt-2">
              <div
                className="bg-blue-500 text-xs font-bold text-white text-center p-1 leading-none rounded-md"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>

        {/* Chỉnh caption & màu sắc */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Customize Caption</h2>
          <div className="p-4 rounded-md shadow-md border  flex justify-center flex-col">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Pencil size={20} className="mr-2" /> Caption
            </h3>
            <input
              type="text"
              className="w-full p-2 border shadow-md rounded-xl mb-4"
              placeholder="Thêm một tin nhắn"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Palette size={20} className="mr-1" /> Chọn màu
            </h3>
            <div className="flex justify-center items-center gap-4">
              {[
                { label: "Màu trên", value: colorTop, setValue: setColorTop },
                {
                  label: "Màu dưới",
                  value: colorBottom,
                  setValue: setColorBottom,
                },
                { label: "Màu chữ", value: colorText, setValue: setColorText },
              ].map(({ label, value, setValue }, index) => (
                <div key={index} className="flex flex-col items-center">
                  <label className="mb-1">{label}</label>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-10 h-10 rounded-md border p-1"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              {/* Reset màu */}
              <button
                onClick={() => {
                  setColorTop("#FFFFFF");
                  setColorBottom("#FFFFFF");
                  setColorText("#FFFFFF");
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

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  FolderOpen,
  Video,
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

const PostMoments = () => {
  const { post, useloading } = useApp();
  const { 
    sendLoading, setSendLoading, 
    uploadLoading, setUploadLoading 
  } = useloading;

  const { 
    caption,setCaption,
    preview,setPreview,
    selectedFile,setSelectedFile,
    selectedColors,setSelectedColors,
  } = post;

  const [colorTop, setColorTop] = useState(selectedColors.top || "#00FA9A");
  const [colorBottom, setColorBottom] = useState( selectedColors.bottom || "#1E90FF");
  const [colorText, setColorText] = useState("#FFFFFF");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setSelectedColors({ top: colorTop, bottom: colorBottom, text: colorText });
  }, [colorTop, colorBottom, colorText]);

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

    setPreview({ type: fileType, data: localPreviewUrl }); // Preview local ngay
    showToast("info", `Đang tải ${fileType === "image" ? "ảnh" : "video"}...`);
    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", rawFile);

      const uploadPreset =
        fileType === "image" ? "locket_image_preset" : "locket_video_preset";
      formData.append("upload_preset", uploadPreset);

      const cloudinaryUrl =
        fileType === "image"
          ? utils.API_URL.UPLOAD_IMAGE_TO_CLOUD
          : utils.API_URL.UPLOAD_VIDEO_TO_CLOUD;

      const res = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadLoading(false);
        showToast("success", "Tải lên thành công!");

        const fileData =
          fileType === "image"
            ? {
                type: "image",
                url: data.secure_url,
                public_id: data.public_id,
                size: data.bytes,
                format: data.format,
                width: data.width,
                height: data.height,
              }
            : {
                type: "video",
                url: data.secure_url,
                public_id: data.public_id,
                size: data.bytes,
                format: data.format,
                duration: data.duration,
                thumbnail: `https://res.cloudinary.com/diocloud/video/upload/w_500,h_500,c_fill,q_auto,f_auto/v${data.version}/${data.public_id}.jpeg`,
              };

        setSelectedFile(fileData);
        setPreview({ type: fileType, data: fileData.url });
      } else {
        showToast("error", data?.error?.message || "Tải lên thất bại!");
        setUploadLoading(false);
      }
    } catch (error) {
      console.error("Lỗi khi upload:", error);
      showToast("error", "Lỗi hệ thống!");
      setUploadLoading(false);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) {
      console.error("Không có dữ liệu để tải lên.");
      return;
    }

    try {
      setSendLoading(true);

      // Chuẩn bị object mediaInfo tùy theo loại
      let mediaInfo = {
        type: selectedFile.type,
        url: selectedFile.url,
        public_id: selectedFile.public_id,
        size: selectedFile.size,
      };

      if (selectedFile.type === "image") {
        mediaInfo = {
          ...mediaInfo,
          format: selectedFile.format,
          width: selectedFile.width,
          height: selectedFile.height,
        };
      } else if (selectedFile.type === "video") {
        mediaInfo = {
          ...mediaInfo,
          duration: selectedFile.duration,
          thumbnail: selectedFile.thumbnail,
        };
      } else {
        showToast("warning", "File không hợp lệ!");
        setSendLoading(false);
        return;
      }

      // Tạo payload từ hàm createRequestPayload
      const payload = utils.createRequestPayload(mediaInfo, caption, selectedColors);

      // Gửi lên server
      try {
        await lockerService.uploadMediaV2(payload);
        showToast("success",`${selectedFile.type === "video" ? "Video" : "Hình ảnh"} đã được tải lên!`);
        setPreview(null);
        setSelectedFile(null);
        setCaption("");
        setSelectedColors({ top: "#00FA9A", bottom: "#1E90FF", text: "#FFFFFF" });
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || error.message || "Lỗi không xác định"; // Kiểm tra lỗi từ server nếu có
        showToast("error", `Lỗi khi tải lên: ${errorMessage}`); // Hiển thị thông báo chi tiết hơn
      }
    } catch (error) {
      console.error("Lỗi khi tải lên:", error);
      showToast("error", "Lỗi hệ thống!");
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen p-6 bg-base-200">
              <div className="h-16"></div>
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
            accept="image/*,video/*"
          />
        </div>
        <div className="text-left">
        <p className="text-sm text-error mt-2">
          Hệ thống chỉ hỗ trợ ảnh tối đa 1MB và video tối đa 10MB. Nếu gặp lỗi khi tải lên, bạn có thể thử lại sau hoặc gửi ảnh/video qua Zalo/Messenger và tải lại. 
          <Link to="/docs" className="underline"> Xem thêm chi tiết
          </Link>
        </p>
        </div>
{/* Preview */}
<div className="text-center my-3">
  <h2 className="text-3xl font-semibold mb-4">Preview</h2>
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
        <div className="flex items-center gap-2 text-2xl font-bold">
          {/* <p> {countdown}s⏳</p> */}
        </div>
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
  </div>
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
            onClick={handleSubmit}
            className="btn btn-primary rounded-xl disabled:bg-gray-400"
            disabled={sendLoading}
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

import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../../../../../context/AppContext";
import { AuthContext } from "../../../../../../context/AuthLocket";
import { PlusIcon, Trash2, X } from "lucide-react";
import LoadingRing from "../../../../../../components/ui/Loading/ring";
import { showError, showSuccess } from "../../../../../../components/Toast";

export default function ImageCaptionSelector({ title }) {
  const navigate = useNavigate();
  const { userPlan } = useContext(AuthContext);
  const { navigation, post } = useApp();
  const { isFilterOpen, setIsFilterOpen } = navigation;
  const { postOverlay, setPostOverlay } = post;

  const [imgCaptions, setImgCaptions] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("imgcaption");
    if (stored) {
      try {
        setImgCaptions(JSON.parse(stored));
      } catch {
        setImgCaptions([]);
      }
    }
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    const img = new Image();

    reader.onload = () => {
      img.src = reader.result;

      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;

        // Canvas vuông
        const canvasSquare = document.createElement("canvas");
        canvasSquare.width = size;
        canvasSquare.height = size;
        const ctxSquare = canvasSquare.getContext("2d");
        ctxSquare.drawImage(img, sx, sy, size, size, 0, 0, size, size);

        // Canvas bo góc
        const canvasRounded = document.createElement("canvas");
        canvasRounded.width = size;
        canvasRounded.height = size;
        const ctxRounded = canvasRounded.getContext("2d");

        const radius = size / 6; // Tự động bo góc dựa theo kích thước

        ctxRounded.beginPath();
        ctxRounded.moveTo(radius, 0);
        ctxRounded.lineTo(size - radius, 0);
        ctxRounded.quadraticCurveTo(size, 0, size, radius);
        ctxRounded.lineTo(size, size - radius);
        ctxRounded.quadraticCurveTo(size, size, size - radius, size);
        ctxRounded.lineTo(radius, size);
        ctxRounded.quadraticCurveTo(0, size, 0, size - radius);
        ctxRounded.lineTo(0, radius);
        ctxRounded.quadraticCurveTo(0, 0, radius, 0);
        ctxRounded.closePath();
        ctxRounded.clip();

        ctxRounded.drawImage(canvasSquare, 0, 0);

        const finalImage = canvasRounded.toDataURL("image/png");
        setPreviewUrl(finalImage);
      };

      img.onerror = () => {
        console.error("Ảnh tải không thành công.");
      };
    };

    reader.onerror = () => {
      console.error("Đọc file thất bại.");
    };

    reader.readAsDataURL(file);
  };

  const uploadToServer = async (file) => {
    const url = "https://api.cloudinary.com/v1_1/dlwgfdsco/image/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "icon_image_preset");

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleCreateCaption = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!imageFile || !previewUrl) {
      setIsLoading(false);
      return;
    }

    try {
      // Convert base64 (canvasRounded) to Blob để upload
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      const file = new File([blob], "rounded.png", { type: "image/png" });

      const uploadedUrl = await uploadToServer(file);
      if (!uploadedUrl) throw new Error("Không thể tải ảnh lên");

      const newItem = { id: Date.now(), image: uploadedUrl };
      const updated = [...imgCaptions, newItem];

      localStorage.setItem("imgcaption", JSON.stringify(updated));
      setImgCaptions(updated);
      setImageFile(null);
      setPreviewUrl(null);
      setShowUpload(false);
      fileInputRef.current.value = null;

      showSuccess("Tạo caption thành công!");
    } catch (error) {
      console.error("Lỗi tạo caption:", error);
      showError("Lỗi khi tạo caption. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomeSelect = (image) => {
    if (isDeleteMode) return; // Không chọn khi đang trong chế độ xoá
    setPostOverlay({
      overlay_id: "image_caption",
      color_top: "",
      color_bottom: "",
      text_color: "#FFFFFF",
      icon: image,
      caption: "",
      type: "image_icon",
    });
    setIsFilterOpen(false);
  };

  const handleDeleteItem = (id) => {
    const updated = imgCaptions.filter((item) => item.id !== id);
    localStorage.setItem("imgcaption", JSON.stringify(updated));
    setImgCaptions(updated);
  };

  return (
    <div className="relative px-4">
      {title && (
        <>
          <div className="flex flex-row gap-3 items-center mb-2">
            <h2 className="text-md font-semibold text-primary">{title}</h2>
            <div className="badge badge-sm badge-secondary">New</div>
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start max-w-full">
        {imgCaptions.length === 0 ? (
          <button className="flex flex-col items-center space-y-1 py-2 px-4 btn rounded-3xl font-semibold">
            <span className="text-base flex flex-row items-center">
              <img
                src="./prvlocket.png"
                alt="IMG"
                className="w-5 h-5 mr-2 rounded-sm"
              />
              Bấm dấu + để tạo
            </span>
          </button>
        ) : (
          imgCaptions.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => handleCustomeSelect(item.image)}
                className="flex flex-col items-center space-y-1 py-2 px-4 btn rounded-3xl font-semibold"
              >
                <span className="text-base flex flex-row items-center">
                  <img
                    src={item.image}
                    alt="caption"
                    className="w-5 h-5 mr-2 object-cover"
                  />
                  Caption
                </span>
              </button>

              {isDeleteMode && (
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
                  title="Xoá"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))
        )}

        <div className="w-full border-1"></div>

        {/* Nút + */}
        <button
          onClick={() => {
            // xử lý gì đó
            setShowUpload(true);
          }}
          className="w-10 h-10 rounded-full bg-base-300 border-2 border-dashed flex items-center justify-center text-lg font-bold flex-shrink-0"
        >
          <PlusIcon />
        </button>

        {/* Nút xoá bật/tắt delete mode */}
        <button
          onClick={() => setIsDeleteMode((prev) => !prev)}
          className={`tooltip tooltip-right w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold flex-shrink-0 ${
            isDeleteMode ? "bg-red-500 text-white" : "bg-base-300 border-dashed"
          }`}
          title="Chế độ xoá"
          data-tip="Bấm vào dấu x để xoá caption"
        >
          <Trash2 />
        </button>
      </div>

      {/* Form tạo caption mới */}
      <div
        className={`fixed inset-0 bg-b-100/30 backdrop-blur-sm outline-t-2 outline-dashed rounded-tr-4xl rounded-tl-4xl flex justify-center items-center z-50
    transition-all duration-500 ease-out transform
    ${
      showUpload
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }
  `}
      >
        <form
          onSubmit={handleCreateCaption}
          className={`bg-base-200 border-2 border-dashed p-6 rounded-3xl max-w-md w-full mx-3
        transform transition-all duration-500 ease-out
        ${
          showUpload
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none"
        }
      `}
        >
          <div>
            <label className="block font-semibold">Chọn ảnh:</label>
            <span className="text-xs font-semibold text-error mb-2">
              Chỉ áp dụng định dạng: PNG, JPG, JPEG
            </span>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={handleUpload}
              className="file-input input-file-bordered file-input-info input-file-ghost w-full"
              ref={fileInputRef}
            />
          </div>

          <div className="mt-4">
            <div className="block font-semibold">Xem trước:</div>
            <span className="text-xs font-semibold text-error mb-2">
              Lưu ý ảnh có thể bị lỗi vui lòng cắt vuông rồi upload lại
            </span>
            {previewUrl && (
              <div className="flex flex-col w-max items-center space-y-1 py-2.5 px-4 border-base-content btn rounded-3xl font-semibold scale-130 mt-3 ml-4">
                <span className="text-base flex flex-row items-center">
                  <img src={previewUrl} alt="IMG" className="w-5 h-5 mr-2" />
                  Caption
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowUpload(false);
                setImageFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = null;
              }}
              className="px-4 py-2 rounded bg-gray-500 text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-white font-semibold flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading && <LoadingRing size={20} stroke={2} color="white" />}
              {isLoading ? "Đang tạo..." : "Tạo caption"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import {
  SonnerError,
  SonnerSuccess,
  SonnerWarning,
} from "@/components/ui/SonnerToast";
import { useOverlayStore } from "@/stores";
import { useState } from "react";

export default function ManageCaption() {
  const [captionId, setCaptionId] = useState("");

  const KANADE_DOMAIN = "https://captionkanade.site";
  const VIDEO_DESKTOP_URL = "https://cdn.chisadin.site/locketdio.mp4";
  const VIDEO_MOBILE_URL = "https://cdn.chisadin.site/Screenrecorder-2026-01-22-22-12-58-939.mp4";

  const userCaptions = useOverlayStore((s) => s.userCaptions);
  const addUserCaptionById = useOverlayStore((s) => s.addUserCaptionById);
  const removeUserCaption = useOverlayStore((s) => s.removeUserCaption);
  // Regex UUID v4
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const handleSubmit = async () => {
    if (!captionId.trim()) {
      SonnerWarning("Vui lòng nhập ID");
      return;
    }

    if (!uuidV4Regex.test(captionId.trim())) {
      SonnerError("ID không hợp lệ");
      return;
    }

    const { success } = await addUserCaptionById(captionId.trim());

    if (success) {
      SonnerSuccess("Thêm caption thành công");
      setCaptionId("");
    } else {
      SonnerError("Thêm caption thất bại");
    }
  };

  // Xóa caption theo ID
  const handleDelete = (id) => {
    removeUserCaption(id);
    SonnerSuccess("Xoá caption thành công");
  };

  return (
    <div className="p-6 mx-auto min-h-screen">
      {/* Tiêu đề */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Locket Dio x Caption Kanade
      </h1>
      <p className="text-sm text-gray-600">
        Bạn có ID của caption do bạn bè gửi hoặc lấy được? Hãy dán nó vào đây để
        tải caption đó về máy của bạn.
      </p>
      <p className="text-sm text-gray-600 my-2">
        Từ khoá tìm kiếm "captionkanade".
      </p>
      <p className="text-sm text-gray-600 mb-6">
        Truy cập{" "}
        <a
          href={KANADE_DOMAIN}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {KANADE_DOMAIN}
        </a>{" "}
        để tạo và lưu caption.
      </p>

      {/* Video hướng dẫn */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 hidden md:block">
          📹 Video hướng dẫn (Máy tính):
        </h2>
        <h2 className="text-xl font-semibold mb-3 block md:hidden">
          📹 Video hướng dẫn (Di động):
        </h2>
        <div className="w-full max-w-lg mx-auto">
          <video
            controls
            playsInline
            webkit-playsinline="true"
            className="w-full max-w-lg rounded-lg shadow-lg hidden md:block"
            preload="metadata"
            style={{ maxHeight: "400px" }}
          >
            <source src={VIDEO_DESKTOP_URL} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
          <video
            controls
            playsInline
            webkit-playsinline="true"
            className="w-full max-w-sm rounded-lg shadow-lg block md:hidden"
            preload="metadata"
            style={{ maxHeight: "300px" }}
            onEnded={() => {
              SonnerSuccess("Lướt xuống đi bạn");
            }}
          >
            <source src={VIDEO_MOBILE_URL} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          {" "}
          ( •̀ ω •́ )✧ Nhập ID caption để tải về
        </h2>
      </div>

      {/* Form nhập ID */}
      <div className="flex flex-col md:flex-row gap-2 mb-8">
        <input
          type="text"
          value={captionId}
          onChange={(e) => setCaptionId(e.target.value)}
          placeholder="Nhập ID caption..."
          className="w-full md:flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          onClick={handleSubmit}
          className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition"
        >
          Tìm kiếm
        </button>
        <a
          href={KANADE_DOMAIN}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition whitespace-nowrap text-center"
        >
          Truy cập CaptionKanade
        </a>
      </div>

      {/* Danh sách caption */}
      <h2 className="text-lg font-semibold mb-3">📌 Caption đã lưu:</h2>
      {userCaptions.length === 0 ? (
        <div className="text-gray-500">
          <p>Chưa có caption nào được lưu.</p>
          <p>
            Truy cập{" "}
            <a
              href={KANADE_DOMAIN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {KANADE_DOMAIN}
            </a>{" "}
            để tạo và lưu caption.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {userCaptions.map((preset) => (
            <div
              key={preset.id}
              className="relative flex flex-col items-center"
            >
              {/* Nút xoá */}
              <button
                onClick={() => handleDelete(preset.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow-md hover:bg-red-600 transition"
              >
                ✕
              </button>

              {/* Nút chọn caption */}
              <button
                className="flex flex-col whitespace-nowrap items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center shadow-md hover:shadow-lg transition"
                style={{
                  background: `linear-gradient(to bottom, ${preset.colortop}, ${preset.colorbottom})`,
                  color: preset.color || "#fff",
                }}
              >
                <span className="text-xl flex items-center gap-2">
                  {preset.type === "image_icon" ||
                  preset.type === "image_gif" ? (
                    <img
                      src={preset.icon_url}
                      alt="icon"
                      className="w-7 h-7 rounded-md object-cover"
                    />
                  ) : (
                    <>{preset.icon_url}</>
                  )}
                  {preset.text}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { showError, showSuccess } from "@/components/Toast";
import { BASE_DB_API_URL } from "@/config/apiConfig";
import { useState, useEffect } from "react";

export default function ManageCaption() {
  const [captionId, setCaptionId] = useState("");
  const [captions, setCaptions] = useState([]);

  // Regex UUID v4
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // Load captions từ localStorage khi component mount
  useEffect(() => {
    const storedCaptions = localStorage.getItem("Yourcaptions");
    if (storedCaptions) {
      try {
        setCaptions(JSON.parse(storedCaptions));
      } catch (e) {
        console.error("Lỗi parse captions từ localStorage:", e);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!captionId.trim()) {
      alert("Vui lòng nhập ID");
      return;
    }

    // ✅ Validate UUID v4
    if (!uuidV4Regex.test(captionId.trim())) {
      showError("ID không hợp lệ. Vui lòng nhập hợp lệ.");
      return;
    }

    try {
      const apiUrl = `${BASE_DB_API_URL}/locketpro/cs/${encodeURIComponent(
        captionId
      )}`;
      console.log("Gửi request tới:", apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Lỗi khi gọi API: ${response.status}`);
      }

      const json = await response.json();
      const caption = json?.data?.caption;
      if (!caption) {
        throw new Error("Không tìm thấy caption trong dữ liệu trả về");
      }

      // Lưu vào localStorage (mảng)
      const storedCaptions = JSON.parse(
        localStorage.getItem("Yourcaptions") || "[]"
      );

      // Tránh trùng ID
      const updatedCaptions = [
        caption,
        ...storedCaptions.filter((c) => c.id !== caption.id),
      ];

      localStorage.setItem("Yourcaptions", JSON.stringify(updatedCaptions));

      // Cập nhật state để hiển thị
      setCaptions(updatedCaptions);
      showSuccess("Thêm caption thành công");
    } catch (error) {
      console.error("Lỗi khi lấy caption:", error);
      showError("Thêm caption thất bại");
    }

    setCaptionId("");
  };

  // Xóa caption theo ID
  const handleDelete = (id) => {
    const updatedCaptions = captions.filter((c) => c.id !== id);
    setCaptions(updatedCaptions);
    localStorage.setItem("Yourcaptions", JSON.stringify(updatedCaptions));
    showSuccess("Xoá caption thành công");
  };

  return (
    <div className="p-6 mx-auto min-h-screen">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold mb-2">Quản lý Caption</h1>
      <p className="text-sm text-gray-600">
        Bạn có ID của caption do bạn bè gửi hoặc lấy được? Hãy dán nó vào đây để
        tải caption đó về máy của bạn.
      </p>
      <p className="text-sm text-gray-600 mb-6">
        Truy cập{" "}
        <a
          href="https://captionkanade.chisadin.site/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          https://captionkanade.chisadin.site/
        </a>{" "}
        để tạo và lưu caption.
      </p>

      {/* Form nhập ID */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={captionId}
          onChange={(e) => setCaptionId(e.target.value)}
          placeholder="Nhập ID caption..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Danh sách caption */}
      <h2 className="text-lg font-semibold mb-3">📌 Caption đã lưu:</h2>
      {captions.length === 0 ? (
        <div className="text-gray-500">
          <p>Chưa có caption nào được lưu.</p>
          <p>
            Truy cập{" "}
            <a
              href="https://captionkanade.chisadin.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              https://captionkanade.chisadin.site/
            </a>{" "}
            để tạo và lưu caption.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {captions.map((preset) => (
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
                  color: preset.color_text || "#fff",
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

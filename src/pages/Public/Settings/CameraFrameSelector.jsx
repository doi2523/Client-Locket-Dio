import { Camera, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "@/utils";

export default function CameraFrameSelector() {
  const { camera } = useApp();
  const { selectedFrame, setSelectedFrame } = camera;
  const [frames, setFrames] = useState([]);

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const res = await axios.get(`${API_URL.GET_FRAMES_URL}`);
        // Thêm frame mặc định vào đầu danh sách
        const apiFrames = res.data || [];
        const defaultFrame = { id: 0, name: "Không có", imageSrc: null };

        setFrames([defaultFrame, ...apiFrames.filter((f) => f.id !== 0)]);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách khung:", err);
        // Nếu lỗi API, vẫn hiển thị frame mặc định
        setFrames([{ id: 0, name: "Không có", imageSrc: null }]);
      }
    };

    fetchFrames();
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center mb-4 text-base-content">
        <Camera className="w-5 h-5 mr-2" />
        <h2 className="text-lg font-semibold">
          Chọn Khung Camera
        </h2>
      </div>

      {/* Preview khung đã chọn */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {/* Camera preview */}
          <div className="w-32 h-32 bg-gray-200 rounded-3xl flex items-center justify-center overflow-hidden">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>

          {/* Frame overlay nếu có */}
          {selectedFrame?.imageSrc && (
            <div className="absolute inset-0 pointer-events-none">
              <img
                src={selectedFrame.imageSrc}
                alt={selectedFrame.name}
                className="w-full h-full object-cover rounded-3xl"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tên frame hiện tại */}
      <div className="text-center mb-4">
        <span className="text-sm font-medium text-base-content/80">
          {selectedFrame?.name || "Chưa chọn khung"}
        </span>
      </div>

      {/* Danh sách frame */}
      <div className="grid grid-cols-4 gap-3">
        {frames.map((frame) => (
          <button
            key={frame.id}
            onClick={() => setSelectedFrame(frame)}
            className={`
              relative group p-2 rounded-xl transition-all duration-200
              ${
                selectedFrame?.id === frame.id
                  ? "bg-blue-100 ring-2 ring-blue-500 scale-105"
                  : "hover:bg-gray-100 hover:scale-105"
              }
            `}
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 mx-auto bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
              {frame.imageSrc ? (
                <img
                  src={frame.imageSrc}
                  alt={frame.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <Camera
                className={`w-3 h-3 text-gray-400 ${
                  frame.imageSrc ? "hidden" : "block"
                }`}
              />
            </div>

            {/* Selected indicator */}
            {selectedFrame?.id === frame.id && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
            )}

            {/* Frame name */}
            <div className="text-xs text-gray-600 mt-1 text-center truncate">
              {frame.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

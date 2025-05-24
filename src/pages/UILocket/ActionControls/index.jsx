import React from "react";
import { useApp } from "../../../context/AppContext.jsx";
import MediaControls from "./MediaControls/index.jsx";
import MediaCapture from "./MediaCapture/index.jsx";

const ActionControls = () => {
  const { post, camera } = useApp();
  const { selectedFile } = post;
  const { capturedMedia } = camera;

  const showControls = capturedMedia || selectedFile;

  return (
    <div className="flex gap-4 w-full h-25 max-w-md justify-evenly items-center relative overflow-hidden">
      {/* //Quản lý các phương tiện đã tải lên gửi, xoá , thêm hiệu ứng */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ease-in-out ${
          showControls ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <MediaControls />
      </div>
      {/* Chụp ảnh và quay video */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ease-in-out ${
          !showControls ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <MediaCapture />
      </div>
    </div>
  );
};

export default ActionControls;

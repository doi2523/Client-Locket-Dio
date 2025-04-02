import React from "react";

const LoadingOverlay = ({ countdown }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50 gap-3 text-white text-lg font-medium">
    <Hourglass size={50} stroke={2} bgOpacity={0.1} speed={1.5} color="white" />
    <div>Đang xử lý video...</div>
    <div className="flex items-center gap-2 text-2xl font-bold">
      <p>{countdown}s⏳</p>
    </div>
  </div>
);

export default LoadingOverlay;

import React from "react";
import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";

const LoadingOverlay = ({ color = "white", size = 40 }) => {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
      <LineSpinner size={size} stroke="3" speed="1" color={color} />
    </div>
  );
};

export default LoadingOverlay;

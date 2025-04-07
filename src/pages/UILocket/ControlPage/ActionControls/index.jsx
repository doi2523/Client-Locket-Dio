import React from "react";
import { useApp } from "../../../../context/AppContext.jsx";
import MediaControls from "./MediaControls";
import MediaCapture from "./MediaCapture/index.jsx";

const ActionControls = () => {
  const { post, camera } = useApp();
  const { selectedFile } = post;
  const { capturedMedia } = camera;

  return (
    <div className="flex gap-4 w-full h-40 max-w-md justify-evenly items-center">
      {capturedMedia || selectedFile ? <MediaControls /> : <MediaCapture />}
    </div>
  );
};

export default ActionControls;

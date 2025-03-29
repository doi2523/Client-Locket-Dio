// MediaControls.js
import React from "react";
import { RefreshCcw, Send, Sparkles, ImageUp, X } from "lucide-react";

const MediaControls = ({
  isRecording,
  handlePressStart,
  handlePressEnd,
  handleSwitchCamera,
  handleSubmit,
  handleDelete,
  handleFileChange,
  rotation,
  capturedMedia,
  selectedFile,
}) => {
  return (
    <div className="flex gap-4 w-full h-40 max-w-md justify-evenly items-center">
      {capturedMedia || selectedFile ? (
        <>
          <button className="cursor-pointer" onClick={handleDelete}>
            <X size={35} />
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-full w-22 h-22 duration-300 outline-base-300 bg-white/10 backdrop-blur-4xl mx-4 text-center flex items-center justify-center"
          >
            <Send size={40} className="mr-1 mt-1" />
          </button>
          <button>
            <Sparkles size={35} />
          </button>
        </>
      ) : (
        <>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <ImageUp size={35} />
          </label>
          <button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            className={`rounded-full w-18 h-18 mx-4 outline-5 outline-offset-3 outline-accent ${
              isRecording ? "bg-red-500 animate-pulseBeat" : "bg-base-300"
            }`}
          ></button>
          <button className="cursor-pointer" onClick={handleSwitchCamera}>
            <RefreshCcw
              size={35}
              className="transition-transform duration-500"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </button>
        </>
      )}
    </div>
  );
};

export default MediaControls;
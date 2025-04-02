import { X, Send, Sparkles, ImageUp, RefreshCcw } from "lucide-react";

const MediaControls = ({ handleDelete, handleSubmit, setIsFilterOpen }) => {
  return (
    <>
      <button className="cursor-pointer" onClick={handleDelete}>
        <X size={35} />
      </button>
      <button
        onClick={handleSubmit}
        className="rounded-full w-22 h-22 duration-300 outline-base-300 bg-base-300/50 backdrop-blur-4xl mx-4 text-center flex items-center justify-center"
      >
        <Send size={40} className="mr-1 mt-1" />
      </button>
      <button onClick={() => setIsFilterOpen(true)}>
        <Sparkles size={35} />
      </button>
    </>
  );
};

const MediaCapture = ({ handleFileChange, startHold, endHold, handleRotateCamera, rotation, isHolding }) => {
  return (
    <>
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" id="file-upload" />
      <label htmlFor="file-upload" className="cursor-pointer">
        <ImageUp size={35} />
      </label>
      <button
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        className="relative flex items-center justify-center w-22 h-22"
      >
        <div className={`absolute w-22 h-22 border-5 border-base-content/50 rounded-full z-10 ${isHolding ? "animate-lightPulse" : ""}`}></div>
        <div className={`absolute rounded-full btn w-18 h-18 outline-accent bg-base-content z-0 ${isHolding ? "animate-pulseBeat" : ""}`}></div>
      </button>
      <button className="cursor-pointer">
        <RefreshCcw
          onClick={handleRotateCamera}
          size={35}
          className="transition-transform duration-500"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </button>
    </>
  );
};

const CameraControls = ({ capturedMedia, selectedFile, ...props }) => {
  return (
    <div className="flex gap-4 w-full h-40 max-w-md justify-evenly items-center">
      {capturedMedia || selectedFile ? (
        <MediaControls {...props} />
      ) : (
        <MediaCapture {...props} />
      )}
    </div>
  );
};

export default CameraControls;

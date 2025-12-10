import LoadingRing from "@/components/ui/Loading/ring";
import { X } from "lucide-react";
import { useState } from "react";
import CaptionOverlay from "./CaptionOverlay";
import UserInfo from "../Layout/UserInfoView";

const MomentSlide = ({ moment, me, handleClose }) => {
  const [isMediaLoading, setIsMediaLoading] = useState(true);

  return (
    <div className="flex w-full flex-col justify-center items-center">
      <div
        className="relative flex flex-col items-center w-full gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={handleClose}
          className="absolute flex justify-center items-center top-4 right-4 z-50 p-2 bg-black/40 rounded-full hover:bg-black/60"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Nội dung Moment */}
        <div className="h-full w-full sm:max-w-sm max-w-md aspect-square flex items-center justify-center relative bg-gradient-to-br from-base-300/20 to-base-100/20 rounded-[64px] overflow-hidden">
          {isMediaLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-600 z-10">
              <LoadingRing color="orange" />
            </div>
          )}

          {moment?.videoUrl ? (
            <video
              src={moment.videoUrl}
              className="max-h-full max-w-full object-contain rounded-2xl"
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setIsMediaLoading(false)}
            />
          ) : (
            <img
              src={moment?.thumbnailUrl}
              alt={moment?.caption || "Moment"}
              className="w-full h-full object-cover rounded-2xl"
              onLoad={() => setIsMediaLoading(false)}
            />
          )}

          {/* Caption */}
          {moment?.caption && <CaptionOverlay currentMoment={moment} />}
        </div>
        <UserInfo user={moment?.user} me={me} date={moment?.date} />
      </div>
    </div>
  );
};

export default MomentSlide;
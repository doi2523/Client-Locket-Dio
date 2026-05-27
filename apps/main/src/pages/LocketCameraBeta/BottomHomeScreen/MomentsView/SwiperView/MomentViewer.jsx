import { X } from "lucide-react";
import { useState } from "react";
import { OverlayRenderer } from "@/components/Overlay";
import {
  useAuthStore,
  useMomentActivityStore,
  resolveMomentOwnerUid,
  resolveMyUid,
} from "@/stores";
import UserInfo from "../../Layout/UserInfoView";

const MomentViewer = ({ moment, handleClose }) => {
  const [isVideoReady, setIsVideoReady] = useState(false);

  const { user } = useAuthStore();
  const myUid = resolveMyUid(user);
  const ownerUid = resolveMomentOwnerUid(moment);
  const isOwnMoment = Boolean(myUid && ownerUid && myUid === ownerUid);

  const pollCounts = useMomentActivityStore((s) =>
    isOwnMoment && moment?.id ? s.byMomentId[moment.id]?.pollCounts : null,
  );

  const thumbnailUrl =
    moment?.thumbnailUrl || moment?.thumbnail_url || moment?.image_url;
  const videoUrl = moment?.videoUrl || moment?.video_url;

  return (
    <div className="flex w-full flex-col justify-center items-center">
      <div
        className="relative flex flex-col items-center w-full gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute flex justify-center items-center top-4 right-4 z-50 p-2 bg-black/40 rounded-full hover:bg-black/60"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="h-full w-full sm:max-w-sm max-w-md aspect-square flex items-center justify-center relative bg-gradient-to-br from-base-300/20 to-base-100/20 rounded-[64px] overflow-hidden">
          {/* 1️⃣ Thumbnail luôn hiển thị trước */}
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={moment?.caption || "Moment"}
              className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-300 ${
                isVideoReady ? "opacity-0" : "opacity-100"
              }`}
            />
          )}

          {/* 2️⃣ Video load ngầm */}
          {videoUrl && (
            <video
              src={videoUrl}
              className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-300 ${
                isVideoReady ? "opacity-100" : "opacity-0"
              }`}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setIsVideoReady(true)}
            />
          )}
          {/* Caption */}
          <OverlayRenderer
            overlayData={moment?.overlays}
            momentId={moment?.id}
            pollCounts={pollCounts}
            pollVariant={isOwnMoment ? "owner" : "friend"}
          />
        </div>

        <UserInfo user={moment?.user} date={moment?.date ?? moment?.createTime} />
      </div>
    </div>
  );
};

export default MomentViewer;

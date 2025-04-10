import React from "react";
import { TbMoodCrazyHappy } from "react-icons/tb";
import { RiEmotionHappyLine } from "react-icons/ri";
import { useApp } from "../../../context/AppContext";

const MediaSizeInfo = () => {
  const { post } = useApp();
  const { preview, isSizeMedia } = post;

  const isImage = preview?.type === "image";
  const isVideo = preview?.type === "video";
  const isTooBig = isImage ? isSizeMedia > 1 : isVideo ? isSizeMedia > 5 : false;
  const colorClass = isTooBig ? "text-red-500" : "text-green-500";

  return (
    <div className="h-6 transition-opacity duration-300 ease-in-out">
      {preview?.type && isSizeMedia ? (
        <div className={`text-sm flex items-center gap-1 ${colorClass}`}>
          Dung lượng {isImage ? "ảnh" : "video"} là{" "}
          <span className="font-semibold underline">{isSizeMedia} MB</span>
          {isTooBig ? (
            <TbMoodCrazyHappy className="text-lg" />
          ) : (
            <RiEmotionHappyLine className="text-lg" />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default MediaSizeInfo;

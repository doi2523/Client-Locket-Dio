import React, { useRef } from "react";
import { useOverlayEditorStore } from "@/stores";
import { OverlayRenderer } from "@/components/Overlay";

// Import Components
import ReviewOverlay from "./components/ReviewOverlay";
import DecorativeOverlay from "./components/DecorativeOverlay";
import StreakOverlay from "./components/StreakOverlay";
import MusicOverlay from "./components/MusicOverlay";
import CaptionIconOverlay from "./components/CaptionIconOverlay";
import WeatherOverlay from "./components/WeatherOverlay";
import LocationOverlay from "./components/LocationOverlay";
import HeartOverlay from "./components/HeartOverlay";
import BatteryOverlay from "./components/BatteryOverlay";
import TimeOverlay from "./components/TimeOverlay";
import CustomOverlay from "./components/CustomOverlay";
import SpecialOverlay from "./components/SpecialOverlay";
import DefaultOverlay from "./components/DefaultOverlay";
import PollOverlay from "./components/PollOverlay";

const EditorCaption = () => {
  const parentRef = useRef(null);
  const overlayData = useOverlayEditorStore((s) => s.overlayData);
  const updateOverlayEditor = useOverlayEditorStore(
    (s) => s.updateOverlayEditor,
  );
  
  const placeholder = "Nhập tin nhắn...";
  const isEditable = overlayData?.is_editable;

  const formattedTime = new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  if (overlayData.type === "color_palette")
    return <OverlayRenderer overlayData={overlayData} />;

  const renderOverlay = () => {
    const commonProps = {
      postOverlay: overlayData,
      setPostOverlay: updateOverlayEditor,
      placeholder,
      parentRef,
    };

    switch (overlayData.type) {
      case "image_icon":
      case "image_gif":
      case "caption_gif":
      case "caption_image":
      case "star_sign":
        return <CaptionIconOverlay {...commonProps} isEditable={isEditable} />;

      case "decorative":
      case "template":
        return <DecorativeOverlay overlayData={overlayData} />;

      case "music":
        return <MusicOverlay postOverlay={overlayData} />;

      case "weather":
        return <WeatherOverlay postOverlay={overlayData} />;

      case "location":
        return <LocationOverlay {...commonProps} />;

      case "heart":
        return <HeartOverlay postOverlay={overlayData} />;
        
      case "streak":
        return <StreakOverlay postOverlay={overlayData} />;

      case "battery":
        return <BatteryOverlay {...commonProps} />;

      case "time":
        return (
          <TimeOverlay
            postOverlay={overlayData}
            formattedTime={formattedTime}
          />
        );

      case "review":
        return <ReviewOverlay payload={overlayData?.payload} />;

      case "special":
        return <SpecialOverlay {...commonProps} isEditable={isEditable} />;

      case "poll":
        return <PollOverlay {...commonProps} isEditable={isEditable} />;

      case "default":
        return <DefaultOverlay {...commonProps} />;

      default:
        return <CustomOverlay {...commonProps} isEditable={isEditable} />;
    }
  };

  return (
    <div
      ref={parentRef}
      className="relative w-full bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center"
    >
      {renderOverlay()}
    </div>
  );
};

export default EditorCaption;

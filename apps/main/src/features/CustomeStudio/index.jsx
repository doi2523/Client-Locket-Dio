import { Palette, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import GeneralThemes from "./components/GeneralSections";
import ImageCaptionSelector from "./components/ImageSections";
import PlanBadge from "@/components/ui/PlanBadge/PlanBadge";
import Footer from "@/components/Footer";
import { useFeatureVisible } from "@/hooks/useFeature";
import FeatureGate from "@/components/common/FeatureGate";
import SavedCaptions from "./components/SavedSections";
import { useOverlayDataStore, useOverlayUserStore } from "@/stores/OverlayStores";
import CaptionSections from "./components/OverlaySections";
import { useOverlayEditorStore } from "@/stores";
import { SonnerInfo } from "@/components/ui/SonnerToast";

const ScreenCustomeStudio = () => {
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const { navigation } = useApp();

  const { isFilterOpen, setIsFilterOpen } = navigation;
  const { userCaptions } = useOverlayUserStore();
  const sectionOverlays = useOverlayDataStore((s) => s.sectionOverlays);

  const updateOverlayEditor = useOverlayEditorStore(
    (s) => s.updateOverlayEditor,
  );
  const resetOverlayEditor = useOverlayEditorStore((s) => s.resetOverlayEditor);

  const canUseCaptionGif = useFeatureVisible("caption_gif");
  const canUseCaptionIcon = useFeatureVisible("caption_icon");
  const canUseCaptionimage = useFeatureVisible("caption_image");

  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isFilterOpen]);

  const handleSelectCaption = (caption) => {
    resetOverlayEditor();
    // console.log("Chọn caption:", caption);

    updateOverlayEditor({
      ...caption,
      overlay_id: caption?.id || "standard",

      text_color: caption.text_color || "#FFFFFF",
      text: caption?.text || "",
      type: caption?.type || "default",

      caption: caption?.text || "",
      color_top: caption.colortop || "",
      color_bottom: caption.colorbottom || "",
    });

    // SonnerInfo("DATA", JSON.stringify(caption, null, 2));

    setIsFilterOpen(false);
    // Xử lý khi chọn caption
  };

  return (
    <div
      className={`fixed inset-0 z-90 flex justify-center items-end transition-transform duration-500 ${
        isFilterOpen ? "" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-base-100/10 backdrop-blur-[2px] bg-opacity-50 transition-opacity duration-500 ${
          isFilterOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsFilterOpen(false)}
      ></div>

      {/* Popup */}
      <div
        ref={popupRef}
        className={`w-full h-2/3 bg-base-100 text-base-content rounded-t-4xl shadow-lg transition-transform duration-500 flex flex-col ${
          isFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header - Ghim cố định */}
        <div className="flex justify-between rounded-t-4xl items-center py-2 px-4 bg-base-100 sticky top-0 left-0 right-0 z-50">
          <div className="flex items-center space-x-2 text-primary">
            <Palette size={22} />
            <div className="text-2xl font-lovehouse mt-1.5 font-semibold">
              Customize studio{" "}
            </div>
            <PlanBadge />
          </div>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-primary cursor-pointer"
          >
            <X size={30} />
          </button>
        </div>
        {/* Nội dung - Cuộn được */}
        <div className="flex-1 overflow-y-auto">
          <GeneralThemes title="🎨 General" onSelect={handleSelectCaption} />

          <CaptionSections
            sections={sectionOverlays}
            onSelect={handleSelectCaption}
          />

          <SavedCaptions
            title="🎨 Caption Kanade hợp tác"
            captions={userCaptions}
            onSelect={handleSelectCaption}
          />
          <FeatureGate canUse={canUseCaptionimage}>
            <ImageCaptionSelector title="🎨 Caption Ảnh - Truy cập sớm" />
          </FeatureGate>
          <div className="px-4 mt-2">
            <h2 className="text-md font-semibold text-primary mb-2">
              ✏️ Ghi chú
            </h2>
            <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start text-base-content">
              <p>
                Theo dõi kênh{" "}
                <a
                  className="text-primary font-semibold underline hover:text-primary-focus"
                  href="https://t.me/ddevdio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </p>
              <p>
                Tham gia nhóm Discord{" "}
                <a
                  className="text-primary font-semibold underline hover:text-primary-focus"
                  href="https://discord.gg/47buy9nMGc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </a>
              </p>
              <p>
                Mọi đóng góp hỗ trợ xin nhận tại{" "}
                <Link
                  to="/aboutdio"
                  className="text-primary font-semibold underline hover:text-primary-focus"
                >
                  trang giới thiệu Dio
                </Link>
              </p>
            </div>
          </div>
          <div className="bottom-0">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenCustomeStudio;

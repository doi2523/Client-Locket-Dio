import { Palette, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import CaptionIconSelector from "./CaptionItems/CaptionIconSelector";
import GeneralThemes from "./CaptionItems/GeneralThemes";
import ThemesCustomes from "./CaptionItems/ThemesCustomes";
import ImageCaptionSelector from "./CaptionItems/ImageCaption";
import PlanBadge from "@/components/ui/PlanBadge/PlanBadge";
import Footer from "@/components/Footer";
import CaptionGifThemes from "./CaptionItems/CaptionGifThemes";
import { useFeatureVisible } from "@/hooks/useFeature";
import FeatureGate from "@/components/common/FeatureGate";
import SavedCaptions from "./CaptionItems/SavedCaptions";

const ScreenCustomeStudio = () => {
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const { navigation, post, captiontheme } = useApp();

  const { isFilterOpen, setIsFilterOpen } = navigation;
  const { setPostOverlay } = post;
  const { captionThemes } = captiontheme;

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

  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    if (isFilterOpen) {
      const stored = localStorage.getItem("savedPosts");
      if (stored) {
        try {
          setSavedPosts(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing savedPosts:", e);
        }
      }
    }
  }, [isFilterOpen]);

  const handleCustomeSelect = (
    preset_id,
    icon,
    color_top,
    color_bottom,
    caption,
    text_color,
    type
  ) => {
    // Cập nhật postOverlay
    setPostOverlay({
      overlay_id: preset_id || "standard",
      color_top: color_top || "",
      color_bottom: color_bottom || "",
      text_color: text_color || "#FFFFFF",
      icon: icon || "",
      caption: caption || "",
      type: type || "default",
    });

    // Log để kiểm tra dữ liệu dưới dạng bảng
    console.table([
      {
        overlay_id: preset_id || "standard",
        color_top: color_top || "",
        color_bottom: color_bottom || "",
        text_color: text_color || "#FFFFFF",
        icon: icon || "",
        caption: caption || "",
        type: type || "default",
      },
    ]);

    // Đóng bộ lọc
    setIsFilterOpen(false);
  };

  const handleCustomeSelectTest = (preset) => {
    // Kiểm tra xem preset có đủ thông tin cần thiết không
    if (!preset) return;

    // Log để kiểm tra dữ liệu dưới dạng bảng
    console.table([
      {
        overlay_id: preset.preset_id || "standard",
        color_top: preset.color_top || "",
        color_bottom: preset.color_bottom || "",
        text_color: preset.text_color || "#FFFFFF",
        icon: preset.icon || "",
        caption: preset.preset_caption || "",
        type: preset.type || "image_link",
      },
    ]);
    // Cập nhật postOverlay từ giá trị preset
    setPostOverlay({
      overlay_id: preset.preset_id || "standard",
      color_top: preset.color_top || "",
      color_bottom: preset.color_bottom || "",
      text_color: preset.text_color || "#FFFFFF",
      icon: preset.icon || "",
      caption: preset.preset_caption || "",
      type: preset.type || "image_link",
      // type: "image_link",
    });

    setIsFilterOpen(false);
  };

  const [captions, setCaptions] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const saved = JSON.parse(localStorage.getItem("Yourcaptions") || "[]");
    setCaptions(saved);
  }, []);

  const handleSelectCaption = (caption) => {
    // console.log("Chọn caption:", caption);
    // Cập nhật postOverlay từ giá trị preset
    setPostOverlay({
      overlay_id: caption?.id || "standard",
      color_top: caption.colortop || "",
      color_bottom: caption.colorbottom || "",
      text_color: caption.color || "#FFFFFF",
      icon: caption?.icon_url || "",
      caption: caption?.text || "",
      type: caption?.type || "default",
    });
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
        className={`w-full h-2/3 bg-base-100 rounded-t-4xl shadow-lg transition-transform duration-500 flex flex-col ${
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
          <GeneralThemes
            title="🎨 General"
            captionThemes={captionThemes}
            onSelect={handleCustomeSelectTest}
          />
          <ThemesCustomes
            title="🎨 Suggest Theme"
            presets={captionThemes.background}
            onSelect={handleCustomeSelect}
          />
          <SavedCaptions
            title="🎨 Caption đã lưu"
            captions={captions}
            onSelect={handleSelectCaption}
          />
          {/* Decorative by Locket */}
          <ThemesCustomes
            title="🎨 Decorative by Locket"
            presets={captionThemes.decorative}
            onSelect={handleCustomeSelect}
          />
          <ThemesCustomes
            title="🎨 New Custome by Dio"
            presets={captionThemes.custome}
            onSelect={handleCustomeSelect}
          />
          <FeatureGate canUse={canUseCaptionIcon}>
            <CaptionIconSelector
              title="🎨 Caption Icon - Truy cập sớm"
              captionThemes={captionThemes}
              onSelect={handleCustomeSelectTest}
            />
          </FeatureGate>
          <FeatureGate canUse={canUseCaptionGif}>
            <CaptionGifThemes
              title="🎨 Caption Gif - Truy cập sớm"
              captionThemes={captionThemes}
              onSelect={handleCustomeSelectTest}
            />
          </FeatureGate>
          <FeatureGate canUse={canUseCaptionimage}>
            <ImageCaptionSelector title="🎨 Caption Ảnh - Truy cập sớm" />
          </FeatureGate>
          <div className="px-4">
            <h2 className="text-md font-semibold text-primary">
              🎨 Caption Logo
            </h2>
            <p className="text-xs">Comming Soon?...</p>
          </div>
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

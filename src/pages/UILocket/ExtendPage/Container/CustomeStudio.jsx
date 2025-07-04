import { Palette, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../../context/AuthLocket";
import { useApp } from "../../../../context/AppContext";
import CaptionIconSelector from "../CaptionItems/CaptionIconSelector";
import GeneralThemes from "../CaptionItems/GeneralThemes";
import ThemesCustomes from "../CaptionItems/ThemesCustomes";
import DevCustomes from "../CaptionItems/DevCustomes";
import ImageCaptionSelector from "../CaptionItems/ImageCaption";
import PlanBadge from "../../../../components/UI/PlanBadge/PlanBadge";
import Footer from "../../../../components/Footer";
import CaptionGifThemes from "../CaptionItems/CaptionGifThemes";

const ScreenCustomeStudio = () => {
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const { user, setUser, userPlan } = useContext(AuthContext);
  const { navigation, post, captiontheme } = useApp();

  const { isFilterOpen, setIsFilterOpen } = navigation;
  const {
    selectedColors,
    setSelectedColors,
    caption,
    setCaption,
    postOverlay,
    setPostOverlay,
  } = post;
  const { captionThemes } = captiontheme;

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
    // Kiểm tra quyền hạn theo userPlan, ví dụ như userPlan.plan_info.features.custom_theme
    // Kiểm tra quyền với type tương ứng
    if (!userPlan?.plan_info?.features?.[type]) {
      const shouldUpgrade = confirm(
        "Bạn không có quyền sử dụng tính năng này. Vui lòng nâng cấp gói để mở khóa.\n\nTruy cập trang nâng cấp ngay?"
      );
      if (shouldUpgrade) {
        navigate("/upgrade");
      }
      return;
    }

    // Cập nhật postOverlay
    setPostOverlay({
      overlay_id: preset_id || "standard",
      color_top: color_top || "",
      color_bottom: color_bottom || "",
      text_color: text_color || "#FFFFFF",
      icon: icon || "",
      caption: caption || "",
      // type: "decorative" || "default",
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
    // Kiểm tra quyền với type tương ứng
    if (!userPlan?.plan_info?.features?.[preset.type]) {
      const shouldUpgrade = confirm(
        "Bạn không có quyền sử dụng tính năng này. Vui lòng nâng cấp gói để mở khóa.\n\nTruy cập trang nâng cấp ngay?"
      );
      if (shouldUpgrade) {
        navigate("/upgrade");
      }
      return;
    }

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
  const normalizedPresets = savedPosts.map((item) => ({
    id: item.id,
    caption: item.options.caption || "",
    color_top: item.options.color_top || "",
    color_bottom: item.options.color_bottom || "",
    color_text: item.options.color_text || "",
    icon: item.options.icon || "",
    type: item.options.type || "background",
    // Nếu bạn có thêm type, preset_id có thể thêm tương tự
  }));
  const handleCustomeSelectTestV2 = () => {
    const shouldUpgrade = confirm(
      "🚧 Tính năng đang được phát triển.\n\nVui lòng mua gói Premium để trải nghiệm sớm.\n\nBạn có muốn truy cập trang nâng cấp ngay không?"
    );
    if (shouldUpgrade) {
      navigate("/upgrade");
    }
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
        <div className="flex-1 overflow-y-auto px-4">
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
          <CaptionIconSelector
            title="🎨 Caption Icon - Truy cập sớm"
            captionThemes={captionThemes}
            onSelect={handleCustomeSelectTest}
          />
          <CaptionGifThemes
            title="🎨 Caption Gif - Member"
            captionThemes={captionThemes}
            onSelect={handleCustomeSelectTest}
          />
          <ImageCaptionSelector title="🎨 Caption Ảnh - Truy cập sớm" />
          <div className="">
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
            <div className="bottom-0">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenCustomeStudio;

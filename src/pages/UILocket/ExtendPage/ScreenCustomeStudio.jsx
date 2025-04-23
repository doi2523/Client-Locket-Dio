import { Palette, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../../../context/AppContext";
import ThemesCustomes from "../../../components/UI/CaptionCustomes/ThemesCustomes";

const ScreenCustomeStudio = () => {
  const popupRef = useRef(null);
  const { navigation, post, captiontheme } = useApp();

  const { isFilterOpen, setIsFilterOpen } = navigation;
  const { selectedColors, setSelectedColors, caption, setCaption } = post;
  const { captionThemes } = captiontheme;

  const handleCloseOnClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      () => setIsFilterOpen(false);
    }
  };

  const handleColorSelect = (topColor, bottomColor) => {
    setSelectedColors({ top: topColor, bottom: bottomColor });
    if (selectedColors) {
      setSelectedColors({ top: topColor, bottom: bottomColor });
      setIsFilterOpen(false);
    }
  };
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


  const handleSelectFilter = (filter) => {
    console.log("Selected Filter:", filter);
    setSelectedColors(filter);
    setIsFilterOpen(false); // Close the filter selector after selection
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false); // Close the filter selector
  };

  const handleCustomeSelect = (preset_id, icon, top, bottom, caption, text_color, type) => {
    setSelectedColors({ preset_id, icon, top, bottom, caption, text_color, type });
    setCaption(`${icon} ${caption || "Caption"}`);
    setIsFilterOpen(false);
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
        className={`w-full h-1/2 bg-base-100 rounded-t-4xl shadow-lg transition-transform duration-500 flex flex-col ${
          isFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header - Ghim cố định */}
        <div className="flex justify-between rounded-t-4xl items-center py-2 px-4 bg-base-100 sticky top-0 left-0 right-0 z-50">
          <div className="flex items-center space-x-2 text-primary">
            <Palette size={22} />
            <div className="text-2xl font-lovehouse mt-1.5 font-semibold">
              Customize studio
            </div>
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
        <ThemesCustomes
            title="🎨 Your Saved Theme"
            presets={savedPosts}
            onSelect={handleCustomeSelect}
          />
        <ThemesCustomes
            title="🎨 Suggest Theme"
            presets={captionThemes.background}
            onSelect={handleCustomeSelect}
          />
          {/* Decorative by Locket */}
          <ThemesCustomes
            title="🎨 Decorative by Locket"
            presets={captionThemes.default}
            onSelect={handleCustomeSelect}
          />
          <ThemesCustomes
            title="🎨 New Custome by Dio"
            presets={captionThemes.custom} 
            onSelect={handleCustomeSelect}
          />

        </div>
      </div>
    </div>
  );
};

export default ScreenCustomeStudio;

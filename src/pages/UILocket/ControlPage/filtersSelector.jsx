import { Palette, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const FiltersSelector = ({ isOpen, onClose, filters, onSelect }) => {
  const popupRef = useRef(null);

  const [selectedColors, setSelectedColors] = useState(null); // State to hold selected colors

  const dataColors = [
    { top: "#5733FF", bottom: "#FF33B5" },
    { top: "#FF5733", bottom: "#FFC300" }, // Initial colors
    { top: "#33FF57", bottom: "#33CFFF" },
    { top: "#FF5733", bottom: "#33FFC3" },
    { top: "#FF9500", bottom: "#FF2D95" },
    { top: "#00B5FF", bottom: "#FFB6C1" }
  ];

  const handleCloseOnClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleColorSelect = (topColor, bottomColor) => {
    setSelectedColors({ top: topColor, bottom: bottomColor });
    if (onSelect) {
      onSelect({ top: topColor, bottom: bottomColor }); // Pass the selected colors to the parent component
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleCloseOnClickOutside);
      document.body.style.overflow = "hidden"; // Khoá cuộn
    } else {
      document.removeEventListener("mousedown", handleCloseOnClickOutside);
      document.body.style.overflow = "auto"; // Mở lại cuộn
    }

    return () => {
      document.removeEventListener("mousedown", handleCloseOnClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-90 flex justify-center items-end transition-transform duration-500 ${
        isOpen ? "" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-base-100/50 bg-opacity-50 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Popup */}
      <div
        ref={popupRef}
        className={`w-full h-1/2 overflow-y-auto bg-base-200 rounded-t-4xl p-4 shadow-lg transition-transform duration-500 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Palette size={22} className="text-primary" />
            <div className="text-xl font-semibold text-primary">Customize Caption</div>
          </div>
          <button onClick={onClose} className="text-primary">
            <X size={30} />
          </button>
        </div>

        {/* Color Selectors */}
        <div className="mb-4">
          <div className="text-lg font-semibold text-primary">Gợi ý Customize</div>
          
          {/* Scrollable Container for Colors */}
          <div className="flex overflow-x-auto gap-3 pt-2 pb-5">
            {dataColors.map((color, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center"
              >
                {/* Color Picker */}
                <button
                  className="btn h-11 w-24 rounded-3xl text-white font-semibold"
                  style={{
                    background: `linear-gradient(to bottom, ${color.top}, ${color.bottom})`,
                    cursor: "pointer",
                  }}
                  onClick={() => handleColorSelect(color.top, color.bottom)}
                >
                  {`Màu ${index + 1}`}
                </button>
              </div>
              
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersSelector;

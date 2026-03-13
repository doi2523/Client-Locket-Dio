import React, { useState } from "react";

const ThemesCustomes = ({ title = "Chọn preset", presets = [], onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const isLoading = !presets || presets.length === 0;

  // Giới hạn hiển thị nếu chưa mở rộng
  // const displayedPresets = expanded ? presets : presets.slice(0, 4);
  const displayedPresets = presets;

  return (
    <div className="px-4">
      {title && (
        <h2 className="text-md font-semibold text-primary mb-2">{title}</h2>
      )}
      <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start">
        {isLoading ? (
          <>
            <button
              className="flex flex-row whitespace-nowrap items-center justify-center py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold"
            >
              <img
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTJyaDUyNWkzYjBqaGwycDZ0cWpudmhqbjVkdnBub3hlYXZkMHJ5OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3gAO9yx102EYTUG5E6/giphy.gif"
                alt=""
                className="w-6 h-6"
              />
              <span className="text-base">Caption</span>
            </button>
          </>
        ) : (
          // <BouncyLoader color="orange" size={30} />
          displayedPresets.map((preset) => (
            <button
              key={preset.preset_id || preset.id}
              className="flex flex-col whitespace-nowrap items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
              style={{
                background: `linear-gradient(to bottom, ${
                  preset.top || preset.color_top
                }, ${preset.color_bot || preset.color_bottom})`,
                color: preset.color_text || preset.text_color,
              }}
              onClick={() =>
                onSelect(
                  preset.preset_id,
                  preset.icon,
                  preset.top || preset.color_top,
                  preset.color_bot || preset.color_bottom,
                  preset.caption || preset.preset_caption,
                  preset.color_text || preset.text_color,
                  preset.type
                )
              }
            >
              <span className="text-base">
                {(preset.icon || "") + " "}
                {preset.caption || preset.preset_caption || "Caption"}
              </span>
            </button>
          ))
        )}
      </div>
      {/* {!isLoading && presets.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary font-semibold underline mb-4"
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )} */}
    </div>
  );
};

export default ThemesCustomes;

import React from "react";
import BouncyLoader from "../../../../components/UI/Loading/Bouncy";

const ThemesCustomes = ({ title = "Chọn preset", presets = [], onSelect }) => {
  const isLoading = !presets || presets.length === 0;

  return (
    <div className="">
      {title && <h2 className="text-md font-semibold text-primary mb-2">{title}</h2>}
      <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start">
        {isLoading ? (
          <BouncyLoader color="orange" size={30}/>
        ) : (
          presets.map((preset) => (
            <button
              key={preset.preset_id || preset.id}
              className="flex flex-col whitespace-nowrap items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
              style={{
                background: `linear-gradient(to bottom, ${preset.top || preset.color_top}, ${preset.color_bot || preset.color_bottom})`,
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
    </div>
  );
};

export default ThemesCustomes;

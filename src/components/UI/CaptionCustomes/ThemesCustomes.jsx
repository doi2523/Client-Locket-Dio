import React from "react";

const ThemesCustomes = ({ title = "Chọn preset", presets = [], onSelect }) => {
  return (
    <div className="">
      {title && <h2 className="text-md font-semibold text-primary mb-2">{title}</h2>}
      <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start">
        {presets.map((preset) => (
          <button
            key={preset.id}
            className="flex flex-col whitespace-nowrap items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
            style={{
              background: `linear-gradient(to top, ${preset.top || preset.color_top}, ${preset.bottom || preset.color_bottom})`,
              color: preset.text || preset.text_color,
            }}
            onClick={() =>
              onSelect(
                preset.preset_id,
                preset.icon,
                preset.top || preset.color_top,
                preset.bottom || preset.color_bottom,
                preset.caption || preset.preset_caption,
                preset.text || preset.text_color,
                preset.type
              )
            }
          >
            <span className="text-base">
              {(preset.icon || "") + " "}{preset.caption || preset.preset_caption || "Caption"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemesCustomes;

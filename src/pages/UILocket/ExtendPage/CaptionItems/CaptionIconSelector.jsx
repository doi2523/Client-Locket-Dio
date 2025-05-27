import React from "react";

export default function CaptionIconSelector({
  title,
  captionThemes,
  onSelect,
}) {
  return (
    <div>
      {title && (
        <h2 className="text-md font-semibold text-primary mb-2">{title}</h2>
      )}
      <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start">
        {captionThemes.image_icon.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className="flex flex-col whitespace-nowrap items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
            style={{
              background: `linear-gradient(to bottom, ${
                preset.top || preset.color_top
              }, ${preset.color_bot || preset.color_bottom})`,
              color: preset.color_text || preset.text_color,
            }}
          >
            <span className="text-base flex flex-row items-center">
              <img src={preset.icon} alt="" className="w-5 h-5 mr-2" />
              {preset.preset_caption || "Caption"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

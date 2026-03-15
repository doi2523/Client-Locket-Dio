const { createBaseVideoPayload } = require("./createBasePayload");

exports.videoPostPayloadDefault = ({ videoUrl, thumbnailUrl, optionsData }) => {
  const { caption } = optionsData;
  const data = createBaseVideoPayload({ videoUrl, thumbnailUrl, optionsData });

  if (caption?.trim()) {
    data.caption = caption;
    data.overlays.push({
      data: {
        text: caption,
        text_color: "#FFFFFFE6",
        type: "standard",
        max_lines: 4,
        background: {
          colors: [],
          material_blur: "ultra_thin",
        },
      },
      alt_text: caption,
      overlay_id: "caption:standard",
      overlay_type: "caption",
    });
  }

  return { data };
};
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

exports.videoPostPayloadDecorative = ({
  videoUrl,
  thumbnailUrl,
  optionsData,
}) => {
  const { overlay_id, caption, text_color, color_top, color_bottom, icon } =
    optionsData;
  const data = createBaseVideoPayload({ videoUrl, thumbnailUrl, optionsData });

  data.overlays.push({
    data: {
      text: caption,
      text_color: text_color,
      type: "static_content",
      max_lines: 1,
      icon: {
        type: "emoji",
        data: icon,
      },
      background: {
        material_blur: "ultra_thin",
        colors: [color_top, color_bottom],
      },
    },
    alt_text: caption,
    overlay_id: `caption:${overlay_id}`,
    overlay_type: "caption",
  });

  return { data };
};

exports.videoPostPayloadCustome = ({ videoUrl, thumbnailUrl, optionsData }) => {
  const { caption, text_color, color_top, color_bottom, icon } = optionsData;
  const data = createBaseVideoPayload({ videoUrl, thumbnailUrl, optionsData });

  data.overlays.push({
    data: {
      text: caption,
      text_color: text_color,
      type: "static_content",
      max_lines: 1,
      icon: {
        type: "emoji",
        data: icon,
      },
      background: {
        material_blur: "ultra_thin",
        colors: [color_top, color_bottom],
      },
    },
    alt_text: caption,
    overlay_id: "caption:miss_you",
    overlay_type: "caption",
  });

  return { data };
};

exports.videoPostPayloadIcon = ({ videoUrl, thumbnailUrl, optionsData }) => {
  const { caption, text_color, color_top, color_bottom, icon } = optionsData;
  const data = createBaseVideoPayload({ videoUrl, thumbnailUrl, optionsData });

  data.overlays.push({
    data: {
      text: caption,
      text_color: text_color,
      type: "static_content",
      max_lines: 1,
      icon: {
        type: "image",
        data: icon,
      },
      background: {
        material_blur: "ultra_thin",
        colors: [],
      },
    },
    alt_text: caption,
    overlay_id: "caption:miss_you",
    overlay_type: "caption",
  });

  return { data };
};
const { createBaseImagePayload } = require("./createBasePayload");

// Đăng nền mặc định + caption
exports.imagePostPayloadDefault = ({ imageUrl, optionsData }) => {
  const { caption } = optionsData;
  const data = createBaseImagePayload({ imageUrl, optionsData });

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

exports.imagePostPayloadDecorative = ({ imageUrl, optionsData }) => {
  const { overlay_id, caption, text_color, color_top, color_bottom, icon } =
    optionsData;
  const data = createBaseImagePayload({ imageUrl, optionsData });

  data.overlays.push({
    data: {
      text: caption,
      text_color,
      type: "static_content",
      icon: { type: "emoji", data: icon },
      max_lines: {
        "@type": "type.googleapis.com/google.protobuf.Int64Value",
        value: "4",
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

exports.imagePostPayloadCustome = ({ imageUrl, optionsData }) => {
  const { caption, text_color, color_top, color_bottom, icon } = optionsData;
  const data = createBaseImagePayload({ imageUrl, optionsData });

  data.overlays.push({
    data: {
      text: caption,
      text_color,
      type: "static_content",
      icon: { type: "emoji", data: icon },
      max_lines: {
        "@type": "type.googleapis.com/google.protobuf.Int64Value",
        value: "4",
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

exports.imagePostPayloadIcon = ({ imageUrl, optionsData }) => {
  const { caption, text_color, color_top, color_bottom, icon } = optionsData;
  const data = createBaseImagePayload({ imageUrl, optionsData });

  data.overlays.push({
    data: {
      text: caption,
      text_color,
      type: "static_content",
      icon: { type: "image", data: icon },
      max_lines: {
        "@type": "type.googleapis.com/google.protobuf.Int64Value",
        value: "4",
      },
      background: {
        material_blur: "ultra_thin",
        colors: [],
      },
    },
    alt_text: caption,
    overlay_id: "caption:ootd",
    overlay_type: "caption",
  });

  return { data };
};
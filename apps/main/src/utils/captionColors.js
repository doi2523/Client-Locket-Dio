const DEFAULT_CAPTION_TOP = "#3097E0";
const DEFAULT_CAPTION_BOTTOM = "#9A3A95";

export const getCaptionGradientColors = (caption) => {
  const colors = Array.isArray(caption?.colors) ? caption.colors.filter(Boolean) : [];

  const top = colors[0] || caption?.colortop || caption?.color_top || DEFAULT_CAPTION_TOP;
  const bottom =
    colors[colors.length - 1] ||
    caption?.colorbottom ||
    caption?.color_bottom ||
    DEFAULT_CAPTION_BOTTOM;

  return {
    top,
    bottom,
  };
};

export const getCaptionGradientStyle = (caption) => {
  const colors = Array.isArray(caption?.colors)
    ? caption.colors.filter(Boolean)
    : [];

  if (colors.length > 0) {
    return {
      background: `linear-gradient(to bottom, ${colors.join(", ")})`,
    };
  }

  const { top, bottom } = getCaptionGradientColors(caption);

  return {
    background: `linear-gradient(to bottom, ${top}, ${bottom})`,
  };
};

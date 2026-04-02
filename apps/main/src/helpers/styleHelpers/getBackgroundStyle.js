export function getBackgroundStyle(background, direction = "to bottom") {
  if (!background) return {};

  let colors = [];

  // Array [ #ccc, #999 ]
  if (Array.isArray(background)) {
    colors = background;
  }

  // Object { colors: [] }
  else if (background.colors && Array.isArray(background.colors)) {
    colors = background.colors;
  }

  // Không đủ hai màu → không áp dụng background
  if (colors.length < 2) return {};

  return {
    background: `linear-gradient(${direction}, ${colors.join(", ")})`,
  };
}

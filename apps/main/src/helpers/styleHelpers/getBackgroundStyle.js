export function getBackgroundStyle(background, direction = "to bottom") {
  if (!background) return {};

  let colors = [];
  let bgImage = null;

  // Array [ #ccc, #999 ]
  if (Array.isArray(background)) {
    colors = background;
  }

  // Object { colors: [], image?: { data, type, source } }
  else if (background.colors && Array.isArray(background.colors)) {
    colors = background.colors;
    bgImage = background.image?.data || null;
  }

  const hasColors = colors.length >= 2;
  const hasImage = !!bgImage;

  if (!hasColors && !hasImage) return {};

  // Chỉ có ảnh nền
  if (hasImage && !hasColors) {
    return {
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  // Chỉ có màu (cũ)
  if (!hasImage && hasColors) {
    return {
      background: `linear-gradient(${direction}, ${colors.join(", ")})`,
    };
  }

  // Cả ảnh + màu: ảnh đè lên gradient, hiển thị rõ ràng
  const gradient = `linear-gradient(${direction}, ${colors.join(", ")})`;

  if (background.image.data === "star_sign_background") {
    return {
      backgroundImage: `url("./images/star_sign_background.png"), ${gradient}`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  return {
    backgroundImage: `url(${bgImage}), ${gradient}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

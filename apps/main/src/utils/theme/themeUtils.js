// utils/themeUtils.js
export const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const computedStyle = getComputedStyle(document.documentElement);
  const baseColor =
    computedStyle.getPropertyValue("--color-base-100")?.trim() || "#ffffff";

  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement("meta");
    metaTheme.name = "theme-color";
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute("content", baseColor);
};

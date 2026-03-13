// src/components/Mirage.jsx
import { mirage } from "ldrs";
import { useEffect, useState } from "react";

const themeColors = {
  light: "black",
  dark: "white",
  retro: "#ff9800",
  cyberpunk: "#ff0077",
  valentine: "oklch(52% .223 3.958)",
  aqua: "#00d4ff",
};

const Mirage = () => {
  mirage.register();
  const [color, setColor] = useState(themeColors.light);

  useEffect(() => {
    const getTheme = () => localStorage.getItem("theme") || "light";

    const updateColor = () => {
      const currentTheme = getTheme();
      setColor(themeColors[currentTheme] || themeColors.light);
    };

    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  return <l-mirage size="90" speed="2.5" stroke={color}></l-mirage>;
};

export default Mirage;

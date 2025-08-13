import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    document.documentElement.style.transition =
      "background-color 0.5s ease, color 0.5s ease";

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
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <label className="flex cursor-pointer items-center gap-2 text-base-content">
      {/* Icon Sun */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="text-base-content"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor" // vẫn dùng currentColor để ăn màu chữ
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>

      {/* Toggle Checkbox */}
      <input
        type="checkbox"
        onChange={toggleTheme}
        checked={isDark}
        className="toggle theme-controller"
      />

      {/* Icon Moon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="text-base-content"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </label>
  );
}

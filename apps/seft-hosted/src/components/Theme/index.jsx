import React, { useEffect, useState } from "react";

const themes = ["light", "retro", "cyberpunk", "valentine", "aqua"];

const ThemeDropdown = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-300 rounded-box p-2 shadow-2xl w-40"
      >
        {themes.map((t) => (
          <li key={t}>
            <label className="flex items-center gap-2 p-2 cursor-pointer">
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller"
                checked={theme === t}
                onChange={() => setTheme(t)}
              />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeDropdown;

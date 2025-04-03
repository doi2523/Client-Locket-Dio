import { useState, useEffect } from "react";

const themes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid",
  "lemonade", "night", "coffee", "winter",
];

const ThemeSelector = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "default");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="w-full flex justify-center">
      {/* Custom Theme */}
      <div className="w-full max-w-6xl">
        <h1 className="font-lovehouse text-3xl font-semibold text-left">Custom Theme</h1>

        <fieldset className="p-4 border rounded-lg shadow-lg w-full">
          <legend className="font-semibold text-lg text-left">🎨 Chọn Giao Diện:</legend>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {themes.map((t) => (
              <label
                key={t}
                className={`flex flex-col items-center gap-2 p-2 rounded-lg shadow-md transition tooltip
                bg-base-100 hover:bg-base-300
                ${theme === t ? "outline-3 outline-dotted outline-primary opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                data-theme={t}
                data-tip={t}
              >
                {/* Xem trước màu của theme */}
                <div className="grid grid-cols-5 grid-rows-3 w-30 h-12 rounded-lg overflow-hidden border border-gray-300">
                  <div className="bg-base-200 col-start-1 row-span-2"></div>
                  <div className="bg-base-300 col-start-1 row-start-3"></div>
                  <div className="bg-base-100 col-span-4 col-start-2 row-span-3 flex flex-col gap-1 p-1">
                    <div className="font-bold text-xs">{t}</div>
                    <div className="flex flex-wrap gap-1">
                      {["primary", "secondary", "accent", "neutral"].map((color) => (
                        <div key={color} className={`bg-${color} flex aspect-square w-3 items-center justify-center rounded`}>
                          <div className={`text-${color}-content text-xs font-bold`}>A</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Radio chọn theme */}
                <input
                  type="radio"
                  name="theme-radios"
                  className="hidden"
                  value={t}
                  checked={theme === t}
                  onChange={() => setTheme(t)}
                />
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default ThemeSelector;

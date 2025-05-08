import { useState, useEffect } from "react";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

const ThemeSelector = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "default"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    // Lấy màu thực tế từ biến CSS
    const computedStyle = getComputedStyle(document.documentElement);
    const baseColor =
      computedStyle.getPropertyValue("--color-base-100")?.trim() || "#ffffff";

    // Cập nhật meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", baseColor);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "theme-color";
      newMeta.content = baseColor;
      document.head.appendChild(newMeta);
    }
  }, [theme]);

  return (
    <div className="w-full flex justify-center">
      {/* Custom Theme */}
      <div className="w-full max-w-6xl">
        <h1 className="font-lovehouse text-center text-3xl font-semibold">
          Custom Theme
        </h1>

        <fieldset className="p-4 border rounded-lg shadow-lg w-full">
          <legend className="font-semibold text-lg text-left">
            🎨 Chọn Giao Diện:
          </legend>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
            {themes.map((t) => (
              <label
                key={t}
                className={`flex flex-col items-center gap-2 p-2 rounded-lg shadow transition tooltip
            bg-base-100 hover:bg-base-300 
            ${
              theme === t
                ? "outline-3 outline-dotted outline-primary opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
                data-theme={t}
                data-tip={t}
              >
                <div className="grid grid-cols-5 grid-rows-3 w-30 h-12 rounded-lg overflow-hidden border border-gray-300">
                  <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                  <div className="bg-base-300 col-start-1 row-start-3"></div>
                  <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-1">
                    <div className="font-bold text-xs">{t}</div>
                    <div className="flex flex-wrap gap-1">
                      <div className="bg-primary flex aspect-square w-3 items-center justify-center rounded">
                        <div className="text-primary-content text-xs font-bold">
                          A
                        </div>
                      </div>
                      <div className="bg-secondary flex aspect-square w-3 items-center justify-center rounded">
                        <div className="text-secondary-content text-xs font-bold">
                          A
                        </div>
                      </div>
                      <div className="bg-accent flex aspect-square w-3 items-center justify-center rounded">
                        <div className="text-accent-content text-xs font-bold">
                          A
                        </div>
                      </div>
                      <div className="bg-neutral flex aspect-square w-3 items-center justify-center rounded">
                        <div className="text-neutral-content text-xs font-bold">
                          A
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="theme-radios"
                  className="radio radio-sm hidden"
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

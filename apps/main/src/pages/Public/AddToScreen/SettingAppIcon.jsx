import { useEffect, useState } from "react";
import { SonnerSuccess } from "@/components/ui/SonnerToast";
import { Wrench, Loader2 } from "lucide-react";
import { isRunningPWA, setPWAIcon, updateFavicons } from "@/utils";

const ICONS = [
  "default",
  "3D-heart-blue",
  "3D-heart-gold",
  "3D-heart-green",
  "3D-heart-pink",
  "3D-tunnel-pendant",
  "3D-tunnel",
  "black-on-gold-2D",
  "flat-blue",
  "flat-pink",
  "flat-purple",
  "flat-yellow",
  "flowers-autumn",
  "flowers-beige",
  "flowers-magenta",
  "flowers-pink",
  "gem-bg-candy",
  "gem-bg-mono",
  "gem-bg-multi",
  "gem-bg-pink",
  "gold-on-black-2D-outline",
  "gold-on-black-2D",
  "light-hearts",
  "neon-blue",
  "neon-green",
  "neon-pink",
  "neon-yellow",
  "photos-hearts",
  "rainbow-hearts",
  "waves-black",
  "waves-blue",
  "waves-gold",
  "waves-purple",
];
export default function SettingAppIcon() {
  const [selectedIcon, setSelectedIcon] = useState("default");
  const [isPWA, setIsPWA] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pwa_icon") || "default";
    setSelectedIcon(saved);

    const running = isRunningPWA();
    setIsPWA(running);

    if (!running) {
      setPWAIcon(saved);
      updateFavicons(saved);
    }
  }, []);

  const handleChangeIcon = async (icon) => {
    setLoading(true);
    setSelectedIcon(icon);
    localStorage.setItem("pwa_icon", icon);

    setPWAIcon(icon);
    updateFavicons(icon);

    setTimeout(() => {
      setLoading(false);
      SonnerSuccess(
        "Biểu tượng ứng dụng đã được cập nhật.",
        "Hãy thêm vào màn hình chính để xem sự thay đổi.",
      );
    }, 800);
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl mb-8">
      <h2 className="text-2xl font-bold text-base-content flex items-center gap-2 p-5">
        <Wrench className="w-6 h-6 text-purple-600" />
        Chọn biểu tượng ứng dụng
      </h2>

      <div className="relative flex flex-col gap-2 p-3">
        {/* Preview */}
        <div className="flex items-center flex-col justify-center mb-2">
          <div className="relative w-20 h-20">
            <img
              src={`/pwa-icons/${selectedIcon}/android-chrome-192x192.png`}
              alt="preview"
              className="w-20 h-20 rounded-2xl shadow object-cover"
            />

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl">
                <Loader2 className="animate-spin w-6 h-6" />
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-2">{selectedIcon}</p>
        </div>

        {/* List icon */}
        <div className="grid grid-cols-5 gap-3">
          {ICONS.map((icon) => {
            const active = selectedIcon === icon;

            return (
              <button
                key={icon}
                disabled={isPWA || loading}
                onClick={() => handleChangeIcon(icon)}
                className={`
                    relative p-1 rounded-xl border transition-all duration-300
                    ${isPWA || loading ? "opacity-50 cursor-not-allowed" : ""}
                    ${
                      active
                        ? "border-primary border-3 scale-110 shadow-lg"
                        : "border-base-300 hover:scale-105"
                    }
                  `}
              >
                {active && (
                  <div className="absolute inset-0 rounded-xl bg-primary/10 blur-md animate-pulse"></div>
                )}

                <img
                  src={`/pwa-icons/${icon}/android-chrome-192x192.png`}
                  alt={icon}
                  className={`w-full h-auto rounded-lg ${active ? "scale-105" : ""}`}
                />
              </button>
            );
          })}
        </div>

        <p className="text-sm opacity-70 text-center mt-3">
          {isPWA
            ? null
            : "Sau khi chọn icon, hãy thêm lại app vào màn hình chính để áp dụng icon mới."}
        </p>

        {isPWA && (
          <div className="absolute rounded-3xl inset-0 flex items-center justify-center text-center bg-base-100/10 backdrop-blur-[2px]">
            <p className="text-sm font-medium">
              Bạn đang mở bằng ứng dụng đã cài.
              <br />
              Hãy mở bằng trình duyệt và cài lại để đổi icon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

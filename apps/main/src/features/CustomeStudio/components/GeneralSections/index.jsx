import React, { useEffect, useState } from "react";
import { PiClockFill } from "react-icons/pi";
import { useApp } from "@/context/AppContext";
import { useBatteryStatus } from "@/utils";
import { useLocationOptions, useLocationWeather } from "@/utils/enviroment";
import { getInfoMusicByUrl } from "@/services";
import { SonnerError, SonnerSuccess } from "@/components/ui/SonnerToast";
import FormMusicPoup from "@/features/PoupScreen/FormMusicPoup";
import FormReviewPoup from "@/features/PoupScreen/FormReviewPoup";
import { useOverlayEditorStore, useStreakStore } from "@/stores";

export default function GeneralThemes({ title }) {
  const { navigation } = useApp();
  const { setIsFilterOpen } = navigation;
  const { addressOptions } = useLocationOptions();
  const { weather } = useLocationWeather();
  const { level, charging } = useBatteryStatus();

  const streak = useStreakStore((s) => s.streak);

  const [time, setTime] = useState(() => new Date());
  const [savedAddressOptions, setSavedAddressOptions] = useState([]);

  const [loading, setLoading] = useState(false);

  // --- Popup States ---
  const [popupActive, setPopupActive] = useState(false); // hiệu ứng hiển thị
  const [formType, setFormType] = useState(""); // "spotify" | "apple"

  useEffect(() => {
    if (
      addressOptions.length > 0 &&
      JSON.stringify(addressOptions) !== JSON.stringify(savedAddressOptions)
    ) {
      setSavedAddressOptions(addressOptions);
    }
  }, [addressOptions, savedAddressOptions]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const updateOverlayEditor = useOverlayEditorStore(
    (s) => s.updateOverlayEditor,
  );
  const resetOverlayEditor = useOverlayEditorStore((s) => s.resetOverlayEditor);

  // === Overlay Apply ===
  const handleCustomeSelect = (data) => {
    resetOverlayEditor();

    updateOverlayEditor({
      ...data,
      color_top: data.color_top || "",
      color_bottom: data.color_bottom || "",
      text_color: data.text_color || "#FFFFFF",
      icon: data.icon || "",
      caption: data.caption || "",
      type: data.type || "default",
    });
    setIsFilterOpen(false);
  };

  // === MUSIC FORM ===
  const openMusicForm = (type) => {
    setFormType(type);
    requestAnimationFrame(() => setPopupActive(true));
  };

  const closeMusicForm = () => {
    setPopupActive(false);
    setTimeout(() => {
      setFormType("");
    }, 300);
  };

  const handleMusicSubmit = async (link) => {
    setLoading(true);
    try {
      const music = await getInfoMusicByUrl(
        link,
        formType === "apple" ? "apple" : "spotify",
      );

      handleCustomeSelect({
        overlay_id: "music",
        caption: music.title,
        text: music.title,
        icon: { data: music.image, type: "image", source: "url" },
        type: "music",
        payload: {
          ...music,
        },
      });

      const musicType = formType === "apple" ? "Apple Music" : "Spotify";
      SonnerSuccess(`${musicType} by Dio`, "Lấy nhạc thành công");

      closeMusicForm();
    } catch {
      SonnerError("Không thể lấy thông tin bài hát");
    } finally {
      setLoading(false);
    }
  };

  const [reviewOpen, setReviewOpen] = useState(false);

  // === REVIEW FORM ===
  const openReviewForm = () => {
    setReviewOpen(true);
  };

  const closeReviewForm = () => {
    setReviewOpen(false);
  };

  const handleReviewSubmit = ({ rating, text }) => {
    handleCustomeSelect({
      overlay_id: "review",
      icon: {},
      caption: text,
      text: text,
      type: "review",
      payload: {
        rating,
        comment: text,
      },
    });

    closeReviewForm();
  };

  // === MAIN BUTTON ACTIONS ===
  const handleClick = (id) => {
    switch (id) {
      case "default":
        handleCustomeSelect({ type: "default" });
        break;
      case "music":
        openMusicForm("spotify");
        break;
      case "music_apple":
        openMusicForm("apple");
        break;
      case "review":
        openReviewForm();
        break;
      case "time":
        handleCustomeSelect({
          overlay_id: "time",
          icon: { color: "#FFFFFFCC", data: "clock.fill", type: "sf_symbol" },
          caption: formattedTime,
          text: formattedTime,
          type: "time",
        });
        break;
      case "weather":
        handleCustomeSelect({
          overlay_id: "weather",
          caption: weather || {},
          payload: {
            ...weather,
            temperature: weather?.temperature,
            cloud_cover: weather?.cloud_cover,
            is_daylight: weather?.is_daylight,
            wk_condition: weather?.wk_condition,
          },
          type: "weather",
        });
        break;
      case "battery":
        handleCustomeSelect({
          overlay_id: "battery",
          caption: level || "50",
          icon: charging,
          text: `${level || "50"}%`,
          type: "battery",
        });
        break;
      case "heart":
        handleCustomeSelect({
          overlay_id: "heart",
          caption: "inlove",
          text: "inlove",
          icon: { color: "#FF0000CC", data: "heart.fill", type: "sf_symbol" },
          type: "heart",
        });
      case "streak":
        handleCustomeSelect({
          overlay_id: "streak",
          icon: { color: "#00000099", data: "flame.fill", type: "sf_symbol" },
          background: { colors: ["#FFD25F", "#EAA900"] },
          caption: streak?.count || "0",
          text: String(streak?.count || "0"),
          type: "streak",
          text_color: "#00000099",
        });
        break;
      default:
        break;
    }
  };

  const buttons = [
    {
      id: "default",
      icon: <span className="mr-1 font-semibold">Aa</span>,
      label: "Văn bản",
    },
    {
      id: "music",
      icon: <img src="./icons/music_icon.png" className="w-6 h-6 mr-1" />,
      label: "Spotify",
    },
    {
      id: "music_apple",
      icon: <img src="./svg/lcd-empty-logo.svg" className="w-5 h-5 mr-1" />,
      label: "Apple Music",
    },
    {
      id: "review",
      icon: <img src="./icons/star_icon.png" className="w-5 h-5 mr-1" />,
      label: "Review",
    },
    {
      id: "time",
      icon: <PiClockFill className="w-6 h-6 mr-1 rotate-270" />,
      label: formattedTime,
    },
    {
      id: "weather",
      icon: (
        <img
          src={
            weather?.icon
              ? `https:${weather.icon}`
              : "./icons/sun_max_indicator.png"
          }
          alt="Weather"
          className="w-6 h-6 mr-1"
        />
      ),
      label:
        weather?.temp_c_rounded !== undefined
          ? `${weather.temp_c_rounded}°C`
          : "Thời tiết",
    },
    {
      id: "streak",
      icon: <img src="./icons/flame_fill.png" className="w-5 h-5 mr-0.5" />,
      label: streak?.count || "0",
      background: ["#FFD25F", "#EAA900"],
      color: "#00000099",
    },
    {
      id: "location",
      icon: (
        <img
          src="https://img.icons8.com/?size=100&id=NEiCAz3KRY7l&format=png&color=000000"
          className="w-6 h-6 mr-1"
        />
      ),
      label: savedAddressOptions[0] || "Vị trí",
    },
  ];

  return (
    <>
      <div className="px-4">
        {title && (
          <div className="flex flex-row gap-3 items-center mb-2">
            <h2 className="text-md font-semibold text-primary">{title}</h2>
            <div className="badge badge-sm badge-secondary">New</div>
          </div>
        )}

        {/* --- BUTTON GRID --- */}
        <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleClick(btn.id)}
              style={getButtonStyle(btn)}
              className={`flex flex-col whitespace-nowrap
    backdrop-blur-3xl items-center space-y-1 py-2 px-4 btn h-auto w-auto
    rounded-3xl font-semibold justify-center
    ${!btn.background ? "bg-base-200 dark:bg-white/30" : ""}
    `}
            >
              <span className="text-base flex flex-row items-center gap-1">
                {btn.icon}
                {btn.id === "location" ? (
                  <div className="relative w-max">
                    <div className="cursor-pointer select-none">
                      {savedAddressOptions[0] || "Vị trí"}
                    </div>
                    <select
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) =>
                        handleCustomeSelect({
                          preset_id: "location",
                          caption: e.target.value,
                          type: "location",
                        })
                      }
                    >
                      <option value="" disabled>
                        Chọn địa chỉ...
                      </option>
                      {savedAddressOptions.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  btn.label
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* === POPUP MUSIC FORM === */}
      <FormMusicPoup
        open={popupActive}
        onClose={closeMusicForm}
        onConfirm={handleMusicSubmit}
        loading={loading}
        formType={formType}
        icon={
          formType === "apple" ? (
            <img src="./svg/lcd-empty-logo.svg" className="w-8 h-8" />
          ) : (
            <img src="./icons/spotify_icon.png" className="w-8 h-8" />
          )
        }
        title={`Nhập link ${formType === "apple" ? "Apple Music" : "Spotify"}`}
      />

      {/* === POPUP REVIEW FORM === */}
      <FormReviewPoup
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirm={handleReviewSubmit}
        title={"Caption Review"}
      />
    </>
  );
}

const getButtonStyle = (btn) => {
  if (!btn.background) return {};

  if (Array.isArray(btn.background)) {
    return {
      background: `linear-gradient(to bottom, ${btn.background[0]}, ${btn.background[1]})`,
      color: btn.color || "#fff",
    };
  }

  if (btn.background.startsWith("url")) {
    return {
      backgroundImage: btn.background,
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: btn.color || "#fff",
    };
  }

  return {
    background: btn.background,
    color: btn.color || "#fff",
  };
};

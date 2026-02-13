import React, { useEffect, useState } from "react";
import { PiClockFill } from "react-icons/pi";
import { useApp } from "@/context/AppContext";
import { useBatteryStatus } from "@/utils";
import { useLocationOptions, useLocationWeather } from "@/utils/enviroment";
import { getInfoMusicByUrl } from "@/services";
import { SonnerError, SonnerSuccess } from "@/components/ui/SonnerToast";
import FormMusicPoup from "@/components/PoupScreen/FormMusicPoup";
import FormReviewPoup from "@/components/PoupScreen/FormReviewPoup";

export default function GeneralThemes({ title }) {
  const { navigation, post } = useApp();
  const { setIsFilterOpen } = navigation;
  const { setPostOverlay } = post;
  const { addressOptions } = useLocationOptions();
  const { weather } = useLocationWeather();
  const { level, charging } = useBatteryStatus();

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

  // === Overlay Apply ===
  const handleCustomeSelect = (data) => {
    setPostOverlay({
      overlay_id: data.preset_id || "standard",
      color_top: data.color_top || "",
      color_bottom: data.color_bottom || "",
      text_color: data.text_color || "#FFFFFF",
      icon: data.icon || "",
      caption: data.caption || "",
      type: data.type || "default",
      ...(data.music && { music: data.music }),
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
        preset_id: "music",
        caption: music.title,
        type: "music",
        music,
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
      preset_id: "review",
      icon: rating,
      caption: text,
      type: "review",
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
          preset_id: "time",
          caption: formattedTime,
          type: "time",
        });
        break;
      case "weather":
        handleCustomeSelect({
          preset_id: "weather",
          caption: weather || {},
          type: "weather",
        });
        break;
      case "battery":
        handleCustomeSelect({
          preset_id: "battery",
          caption: level || "50",
          icon: charging,
          type: "battery",
        });
        break;
      case "heart":
        handleCustomeSelect({
          preset_id: "heart",
          caption: "inlove",
          type: "heart",
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
      id: "battery",
      icon: (
        <img
          src="https://img.icons8.com/?size=100&id=WDlpopZDVw4P&format=png&color=000000"
          className="w-6 h-6 mr-1"
        />
      ),
      label: `${level || "50"}%`,
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
          {buttons.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className="flex flex-col whitespace-nowrap bg-base-200 dark:bg-white/30
              backdrop-blur-3xl items-center space-y-1 py-2 px-4 btn h-auto w-auto
              rounded-3xl font-semibold justify-center"
            >
              <span className="text-base flex flex-row items-center gap-1">
                {icon}
                {id === "location" ? (
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
                  label
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

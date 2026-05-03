import React, { useEffect, useState, useMemo } from "react";
import { PiClockFill } from "react-icons/pi";
import { useApp } from "@/context/AppContext";
import { useBatteryStatus } from "@/utils";
import { getInfoMusicByUrl } from "@/services";
import {
  SonnerError,
  SonnerInfo,
  SonnerSuccess,
} from "@/components/ui/SonnerToast";
import FormMusicPoup from "@/features/PoupScreen/FormMusicPoup";
import FormReviewPoup from "@/features/PoupScreen/FormReviewPoup";
import { useOverlayEditorStore, useStreakStore } from "@/stores";
import IconRenderer from "@/features/OverlayRender/iconRenders";
import { getCaptionStyle } from "@/helpers/styleHelpers";
import { useCurrentWeather, useCurrentLocation } from "../../hooks";

export default function GeneralThemes({ title }) {
  const { navigation } = useApp();
  const { setIsFilterOpen } = navigation;

  const { addressOptions } = useCurrentLocation();
  const weatherInfo = useCurrentWeather();

  const { level, charging } = useBatteryStatus();
  const streak = useStreakStore((s) => s.streak);

  const updateOverlayEditor = useOverlayEditorStore(
    (s) => s.updateOverlayEditor,
  );
  const resetOverlayEditor = useOverlayEditorStore((s) => s.resetOverlayEditor);

  const [time, setTime] = useState(new Date());
  const [savedAddressOptions, setSavedAddressOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // popup states
  const [popupActive, setPopupActive] = useState(false);
  const [formType, setFormType] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    if (
      addressOptions.length &&
      JSON.stringify(addressOptions) !== JSON.stringify(savedAddressOptions)
    ) {
      setSavedAddressOptions(addressOptions);
    }
  }, [addressOptions]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = useMemo(
    () =>
      time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [time],
  );

  // --- CORE APPLY ---
  const applyOverlay = (data) => {
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

  // --- MUSIC ---
  const openMusicForm = (type) => {
    setFormType(type);
    requestAnimationFrame(() => setPopupActive(true));
  };

  const closeMusicForm = () => {
    setPopupActive(false);
    setTimeout(() => setFormType(""), 300);
  };

  const handleMusicSubmit = async (link) => {
    setLoading(true);
    try {
      const music = await getInfoMusicByUrl(
        link,
        formType === "apple" ? "apple" : "spotify",
      );

      applyOverlay({
        overlay_id: "music",
        caption: music.title,
        text: music.title,
        icon: { data: music.image, type: "image", source: "url" },
        type: "music",
        payload: music,
      });

      SonnerSuccess(
        `${formType === "apple" ? "Apple Music" : "Spotify"} by Dio`,
        "Lấy nhạc thành công",
      );

      closeMusicForm();
    } catch {
      SonnerError("Không thể lấy thông tin bài hát");
    } finally {
      setLoading(false);
    }
  };

  // --- REVIEW ---
  const handleReviewSubmit = ({ rating, text }) => {
    applyOverlay({
      overlay_id: "review",
      caption: text,
      text,
      type: "review",
      payload: { rating, comment: text },
    });
    setReviewOpen(false);
  };

  // --- ACTION MAP ---
  const actions = {
    default: () => applyOverlay({ type: "default" }),

    music: () => openMusicForm("spotify"),
    music_apple: () => openMusicForm("apple"),

    review: () => setReviewOpen(true),

    time: () =>
      applyOverlay({
        overlay_id: "time",
        icon: { color: "#FFFFFFCC", data: "clock.fill", type: "sf_symbol" },
        caption: formattedTime,
        text: formattedTime,
        type: "time",
      }),

    weather: () => {
      if (!weatherInfo || !weatherInfo.payload) {
        SonnerInfo("Không có dữ liệu thời tiết!");
        return;
      }

      applyOverlay({
        overlay_id: "weather",
        caption: weatherInfo?.text || {},
        type: "weather",
        ...weatherInfo,
      });
    },

    battery: () =>
      applyOverlay({
        overlay_id: "battery",
        caption: level || "50",
        icon: charging,
        text: `${level || "50"}%`,
        type: "battery",
      }),

    heart: () =>
      applyOverlay({
        overlay_id: "heart",
        caption: "inlove",
        text: "inlove",
        icon: { color: "#FF0000CC", data: "heart.fill", type: "sf_symbol" },
        type: "heart",
      }),

    streak: () =>
      applyOverlay({
        overlay_id: "streak",
        icon: { color: "#00000099", data: "flame.fill", type: "sf_symbol" },
        background: { colors: ["#FFD25F", "#EAA900"] },
        caption: streak?.count || "0",
        text: String(streak?.count || "0"),
        type: "streak",
        text_color: "#00000099",
      }),
  };

  const handleClick = (id) => actions[id]?.();

  // --- MUSIC META (fix thiếu props modal) ---
  const musicMeta = {
    icon:
      formType === "apple" ? (
        <img src="./svg/lcd-empty-logo.svg" className="w-8 h-8" />
      ) : (
        <img src="./icons/spotify_icon.png" className="w-8 h-8" />
      ),
    title: `Nhập link ${formType === "apple" ? "Apple Music" : "Spotify"}`,
  };

  // --- BUTTONS ---
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
      id: "weather",
      icon: <IconRenderer icon={weatherInfo.icon} />,
      background: weatherInfo.background.colors,
      color: "#FFFFFF",
      label: weatherInfo?.text || "Thời tiết",
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

        <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleClick(btn.id)}
              style={{ ...getCaptionStyle(btn.background, btn.color) }}
              className={`flex flex-col whitespace-nowrap backdrop-blur-3xl items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center ${
                !btn.background ? "bg-base-200 dark:bg-white/30" : ""
              }`}
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
                        applyOverlay({
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

      {/* POPUP MUSIC */}
      <FormMusicPoup
        open={popupActive}
        onClose={closeMusicForm}
        onConfirm={handleMusicSubmit}
        loading={loading}
        formType={formType}
        {...musicMeta}
      />

      {/* POPUP REVIEW */}
      <FormReviewPoup
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirm={handleReviewSubmit}
        title={"Caption Review"}
      />
    </>
  );
}

import React, { useEffect, useState } from "react";
import { PiClockFill } from "react-icons/pi";
import { useApp } from "@/context/AppContext";
import { useBatteryStatus } from "@/utils";
import { useLocationOptions, useLocationWeather } from "@/utils/enviroment";
import { getInfoMusicByUrl } from "@/services";
import { SonnerError, SonnerSuccess } from "@/components/ui/SonnerToast";
import { StarProgress } from "@/pages/LocketCameraBeta/MainHomeScreen/Widgets/StarRating/StarProgress";

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
  const [popupVisible, setPopupVisible] = useState(false); // đang trong DOM
  const [popupActive, setPopupActive] = useState(false); // hiệu ứng hiển thị
  const [formType, setFormType] = useState(""); // "spotify" | "apple"
  const [musicLink, setMusicLink] = useState("");

  const [reviewVisible, setReviewVisible] = useState(false);
  const [reviewActive, setReviewActive] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  useEffect(() => {
    if (addressOptions.length > 0) setSavedAddressOptions(addressOptions);
  }, [addressOptions]);

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
    setPopupVisible(true);
    requestAnimationFrame(() => setPopupActive(true));
  };

  const closeMusicForm = () => {
    setPopupActive(false);
    setTimeout(() => {
      setPopupVisible(false);
      setFormType("");
      setMusicLink("");
    }, 300);
  };

  const handleMusicSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const music = await getInfoMusicByUrl(
        musicLink,
        formType === "apple" ? "apple" : "spotify"
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

  // === REVIEW FORM ===
  const openReviewForm = () => {
    setReviewVisible(true);
    requestAnimationFrame(() => setReviewActive(true));
  };
  const closeReviewForm = () => {
    setReviewActive(false);
    setTimeout(() => setReviewVisible(false), 300);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    handleCustomeSelect({
      preset_id: "review",
      icon: reviewRating,
      caption: reviewText,
      type: "review",
    });
    closeReviewForm();
    setReviewText("");
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
          caption: weather?.temp_c_rounded
            ? `${weather.temp_c_rounded}°C`
            : "Thời tiết",
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

      {/* === POPUP MUSIC FORM === */}
      {popupVisible && (
        <div
          className={`fixed inset-0 bg-b-100/30 border-t-2 border-dashed rounded-tr-4xl rounded-tl-4xl backdrop-blur-sm z-50 flex justify-center items-center
          transition-all duration-500 ${
            popupActive ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMusicForm}
        >
          <form
            onSubmit={handleMusicSubmit}
            onClick={(e) => e.stopPropagation()}
            className={`bg-base-200 border-2 border-dashed p-6 rounded-3xl max-w-md w-full mx-3
              transform transition-all duration-500 ease-out
              ${popupActive ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
          >
            <label className="font-semibold block">
              Nhập link {formType === "apple" ? "Apple Music" : "Spotify"}:
            </label>
            <p className="text-xs mb-2">
              Caption nhạc chỉ hiển thị trên IOS (Android vẫn đăng và hiển thị
              nhưng chỉ IOS thấy)
            </p>

            <input
              type="text"
              value={musicLink}
              onChange={(e) => setMusicLink(e.target.value.trimStart())}
              placeholder={
                formType === "apple"
                  ? "https://music.apple.com/..."
                  : "https://open.spotify.com/track/..."
              }
              className="input p-2 rounded-md text-base-content outline-none w-full mb-4"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeMusicForm}
                className="px-4 py-2 rounded bg-gray-500 text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded font-semibold text-white ${
                  loading ? "bg-gray-400" : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {loading ? "Đang tải..." : "Gửi"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* === POPUP REVIEW FORM === */}
      {reviewVisible && (
        <div
          className={`fixed inset-0 bg-b-100/30 backdrop-blur-sm border-t-2 border-dashed rounded-tr-4xl rounded-tl-4xl flex justify-center items-center z-50
          transition-all duration-500 ${
            reviewActive ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeReviewForm}
        >
          <form
            onSubmit={handleReviewSubmit}
            onClick={(e) => e.stopPropagation()}
            className={`bg-base-200 border-2 border-dashed p-6 rounded-3xl max-w-md w-full mx-3
              transform transition-all duration-500 ease-out
              ${reviewActive ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
          >
            <label className="font-semibold block">Đánh giá (số sao):</label>
            <span className="text-xs text-error mb-2">Kéo để thay đổi</span>

            <div className="flex items-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarProgress
                  key={star}
                  size={24}
                  fillPercent={Math.min(
                    100,
                    Math.max(0, (reviewRating - (star - 1)) * 100)
                  )}
                />
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                {reviewRating.toFixed(1)} / 5
              </span>
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={reviewRating}
                onChange={(e) => setReviewRating(parseFloat(e.target.value))}
                className="range w-full ml-2"
              />
            </div>

            <label className="font-semibold mb-2 block">Viết đánh giá:</label>
            <input
              value={reviewText}
              onChange={(e) =>
                e.target.value.length <= 24 && setReviewText(e.target.value)
              }
              placeholder="Nhập vào đây (giới hạn 24 ký tự)"
              className="input p-2 rounded-md text-base-content outline-none w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeReviewForm}
                className="px-4 py-2 rounded bg-gray-500 text-base-content"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-accent text-base-content font-semibold"
              >
                OK
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

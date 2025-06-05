import React, { useEffect, useState } from "react";
import { PiClockFill } from "react-icons/pi";
import { useApp } from "../../../../context/AppContext";
import { Star } from "lucide-react";
import { StarProgress } from "../../../../components/UI/StarRating/StarProgress";

export default function GeneralThemes({ title }) {
  const { navigation, post, captiontheme } = useApp();
  const { isFilterOpen, setIsFilterOpen } = navigation;
  const { postOverlay, setPostOverlay } = post;
  const { captionThemes } = captiontheme;

  const [time, setTime] = useState(() => new Date());
  const [locationText, setLocationText] = useState("Vị trí");

  const [showSpotifyForm, setShowSpotifyForm] = useState(false);
  const [spotifyLink, setSpotifyLink] = useState("");

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0); // mặc định 5 sao
  // const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCustomeSelect = ({
    preset_id = "standard",
    icon = "",
    color_top = "",
    color_bottom = "",
    caption = "",
    text_color = "#FFFFFF",
    type = "default",
  }) => {
    setPostOverlay({
      overlay_id: preset_id,
      color_top,
      color_bottom,
      text_color,
      icon,
      caption,
      type,
    });

    console.table([
      {
        overlay_id: preset_id,
        color_top,
        color_bottom,
        text_color,
        icon,
        caption,
        type,
      },
    ]);

    setIsFilterOpen(false);
  };

  const handleSpotifySubmit = (e) => {
    e.preventDefault();
    handleCustomeSelect({
      preset_id: "spotify",
      icon: "",
      caption: spotifyLink,
      type: "spotify",
    });

    setShowSpotifyForm(false);
    setSpotifyLink("");
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    handleCustomeSelect({
      preset_id: "review",
      icon: reviewRating,
      caption: reviewText,
      type: "review",
    });

    setShowReviewForm(false);
    setReviewText("");
  };

  const handleClick = (id) => {
    switch (id) {
      case "music":
        setShowSpotifyForm(true);
        break;
      case "review":
        setShowReviewForm(true);
        break;
      case "time":
        handleCustomeSelect({
          preset_id: "image_icon",
          caption: formattedTime,
          type: "time",
        });
        break;
      case "location":
        alert("Lấy vị trí sẽ sớm được hỗ trợ");
        break;
      case "weather":
        alert("Thời tiết sẽ sớm được tích hợp");
        break;
      default:
        break;
    }
  };

  const buttons = [
    {
      id: "music",
      icon: (
        <img src="./images/music_icon_Normal@3x.png" className="w-6 h-6 mr-2" />
      ),
      label: "Đang phát",
    },
    {
      id: "review",
      icon: <img src="./images/star.png" className="w-5 h-5 mr-2" />,
      label: "Review",
    },
    {
      id: "time",
      icon: <PiClockFill className="w-6 h-6 mr-2 rotate-270" />,
      label: formattedTime,
    },
    {
      id: "location",
      icon: (
        <img
          src="./images/location_icon_Normal@3x.png"
          className="w-6 h-6 mr-1"
        />
      ),
      label: locationText,
    },
    {
      id: "weather",
      icon: (
        <img
          src="./images/sun_max_indicator_Normal@3x.png"
          className="w-6 h-6 mr-1"
        />
      ),
      label: "Thời tiết",
    },
  ];

  return (
    <div>
      {title && (
        <h2 className="text-md font-semibold text-primary mb-2">{title}</h2>
      )}
      <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start">
        {buttons.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className="flex flex-col whitespace-nowrap bg-black/60 backdrop-blur-3xl items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
          >
            <span className="text-base flex flex-row items-center text-white">
              {icon}
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Popup Spotify */}
      <div
        className={`
    fixed inset-0 bg-b-100/30 backdrop-blur-sm outline-t-2 outline-dashed rounded-tr-4xl rounded-tl-4xl
    flex justify-center items-center z-50 transition-all duration-500
    ${
      showSpotifyForm
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }
  `}
        onClick={() => setShowSpotifyForm(false)}
      >
        <form
          onSubmit={handleSpotifySubmit}
          className={`bg-base-200 border-2 border-dashed p-6 rounded-3xl max-w-md w-full mx-3
            transform transition-all duration-500 ease-out
            ${
              showSpotifyForm
                ? "scale-100 opacity-100"
                : "scale-0 opacity-0 pointer-events-none"
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <label className="text-base-content font-semibold mb-2 block">
            Nhập link Spotify:
          </label>
          <input
            type="text"
            value={spotifyLink}
            onChange={(e) => setSpotifyLink(e.target.value)}
            placeholder="https://open.spotify.com/track/..."
            className="input p-2 rounded-md text-black outline-none w-full mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowSpotifyForm(false)}
              className="px-4 py-2 rounded bg-gray-500 text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-white font-semibold"
            >
              Gửi
            </button>
          </div>
        </form>
      </div>

      {/* Popup Review */}
      <div
        className={`
          fixed inset-0 bg-b-100/30 backdrop-blur-sm outline-t-2 outline-dashed rounded-tr-4xl rounded-tl-4xl
          flex justify-center items-center z-50 transition-all duration-500
          ${
            showReviewForm
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        onClick={() => setShowReviewForm(false)}
      >
        <form
          onSubmit={handleReviewSubmit}
          className={`bg-base-200 border-2 border-dashed p-6 rounded-3xl max-w-md w-full mx-3
    transform transition-all duration-500 ease-out
    ${
      showReviewForm
        ? "scale-100 opacity-100"
        : "scale-0 opacity-0 pointer-events-none"
    }
  `}
          onClick={(e) => e.stopPropagation()}
        >
          <label className="font-semibold block">Đánh giá (số sao):</label>
          <span className="text-xs text-error mb-2">Kéo để thay đổi</span>

          {/* Hiển thị sao nằm ngang dùng StarProgress */}
          <div className="flex items-center space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const fillPercent = Math.min(
                100,
                Math.max(0, (reviewRating - (star - 1)) * 100)
              );

              return (
                <StarProgress
                  key={star}
                  size={24}
                  fillPercent={fillPercent}
                  className=""
                />
              );
            })}
          </div>

          {/* Hiển thị số sao + range input */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600 w-15">
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

          {/* Viết đánh giá */}
          <label className="text-base-content font-semibold mb-2 block">
            Viết đánh giá của bạn:
          </label>
          <input
            value={reviewText}
            onChange={(e) => {
              if (e.target.value.length <= 24) {
                setReviewText(e.target.value);
              }
            }}
            placeholder="Nhập vào đây giới hạn 24 ký tự..."
            className="input p-2 rounded-md text-black outline-none w-full mb-4"
          />

          {/* Button */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
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
    </div>
  );
}

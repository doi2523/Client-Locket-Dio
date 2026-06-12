import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const EMOJI_PAIRS = [
  { left: "👍", right: "👎" },
  { left: "🔥", right: "❄️" },
  { left: "😂", right: "😢" },
  { left: "😍", right: "😡" },
  { left: "🎉", right: "💀" },

  { left: "💯", right: "🧊" },
  { left: "⚡", right: "🌧️" },
  { left: "🚀", right: "🪨" },
  { left: "❤️", right: "💔" },
  { left: "😎", right: "🤡" },

  { left: "👀", right: "🙈" },
  { left: "🥵", right: "🥶" },
  { left: "🤝", right: "✋" },
  { left: "💪", right: "🪫" },
  { left: "🎯", right: "🎲" },
];

const EMOJIS = [
  "👍",
  "👎",
  "👌",
  "✌️",
  "🤞",

  "🔥",
  "❄️",
  "⚡",
  "💥",
  "🌧️",

  "😂",
  "😢",
  "😭",
  "😍",
  "😡",

  "😎",
  "🤡",
  "🥶",
  "🥵",
  "👀",

  "❤️",
  "💔",
  "💘",
  "💞",
  "💯",

  "🎉",
  "🎊",
  "🥳",
  "💀",
  "☠️",

  "💪",
  "🪫",
  "🚀",
  "🪨",
  "🎯",

  "🙏",
  "👏",
  "🤝",
  "✋",
  "🙌",
];

function EmojiModal({
  open,
  onClose,
  setPostOverlay,
  activeSide,
  title = "Chọn emoji",
}) {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [tab, setTab] = useState("pair");

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  useEffect(() => {
    if (open) {
      setShowModal(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setShowModal(false), 300);
    }
  }, [open]);

  if (!showModal) return null;

  const updatePair = (pair) => {
    setPostOverlay({
      payload: {
        left_emoji: pair.left,
        right_emoji: pair.right,
      },
    });

    onClose();
  };

  const updateSingle = (emoji) => {
    if (!activeSide) return;

    setPostOverlay({
      payload: {
        [activeSide === "left" ? "left_emoji" : "right_emoji"]: emoji,
      },
    });

    onClose();
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-base-100/30 backdrop-blur-[4px] transition-opacity duration-500 z-[62] ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 w-full h-2/3 bg-base-100 text-base-content rounded-t-4xl border-t border-base-300 shadow-lg transition-all duration-500 ease-in-out z-[63] flex flex-col
        ${animate ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 pb-0 flex flex-col h-full">
          <h3 className="text-xl font-semibold text-center mb-4">{title}</h3>

          <div className="flex justify-center gap-2 mb-5">
            <button
              onClick={() => setTab("pair")}
              className={`btn btn-sm rounded-full ${
                tab === "pair" ? "btn-primary" : "btn-ghost"
              }`}
            >
              Gợi ý cặp
            </button>

            <button
              onClick={() => setTab("single")}
              className={`btn btn-sm rounded-full ${
                tab === "single" ? "btn-primary" : "btn-ghost"
              }`}
            >
              Chỉnh lẻ
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {tab === "pair" && (
              <div className="grid grid-cols-2 gap-3">
                {EMOJI_PAIRS.map((pair, idx) => (
                  <button
                    key={idx}
                    onClick={() => updatePair(pair)}
                    className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-base-200 hover:bg-base-300 transition"
                  >
                    <span className="text-3xl">{pair.left}</span>
                    <span className="text-3xl">{pair.right}</span>
                  </button>
                ))}
              </div>
            )}

            {tab === "single" && (
              <div className="grid grid-cols-6 gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => updateSingle(emoji)}
                    className="text-3xl p-2 rounded-xl hover:bg-base-200 transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default EmojiModal;

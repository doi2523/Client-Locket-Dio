import { useState, useEffect, useRef } from "react";
import { Send, SmilePlus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { SendReactMoment } from "@/services";
import { showError, showSuccess, showWarning } from "@/components/Toast";

const InputForMoment = () => {
  const {
    reactionInfo,
    setReactionInfo,
    selectedMomentId,
    showEmojiPicker,
    setShowEmojiPicker,
  } = useApp().post;
  const {
    showFlyingEffect,
    setShowFlyingEffect,
    flyingEmojis,
    setFlyingEmojis,
  } = useApp().navigation;
  const [showFullInput, setShowFullInput] = useState(false);
  const [message, setMessage] = useState("");
  const [reactionPower, setReactionPower] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdingEmoji, setHoldingEmoji] = useState(null);
  const holdInterval = useRef(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const sendReact = async (emoji, power = 0) => {
    console.log("React:", emoji, "Power:", power);
    try {
      setFlyingEmojis(emoji);
      setShowFlyingEffect(true);
      const res = await SendReactMoment(emoji, selectedMomentId, power);
      showSuccess(`Gửi cảm xúc thành công tới ${res}!`);
      setShowEmojiPicker(false);
      console.log(res);
    } catch (error) {
      showError("Gửi cảm xúc thất bại!");
      console.error("Lỗi khi gửi react:", error);
    }
  };

  // ✅ Bắt đầu nhấn giữ
  const handleHoldStart = (emoji) => {
    setIsHolding(true);
    setHoldingEmoji(emoji);
    setReactionPower(0);

    holdInterval.current = setInterval(() => {
      setReactionPower((prev) => {
        if (prev >= 1000) {
          clearInterval(holdInterval.current);
          return 1000;
        }
        return prev + 1; // Tăng mỗi 20ms
      });
    }, 20);
  };

  // ✅ Kết thúc nhấn giữ
  const handleHoldEnd = (emoji) => {
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
    }
    if (isHolding) {
      sendReact(emoji, reactionPower);
    }
    setIsHolding(false);
    setHoldingEmoji(null);
    setReactionPower(0);
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log("Gửi:", message);
      setMessage("");
      setShowFullInput(false);
      showWarning("Đang phát triển babi ơi!");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowFullInput(false);
      }
    };

    if (showFullInput) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFullInput]);

  useEffect(() => {
    if (showFullInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showFullInput]);

  return (
    <>
      {/* ✅ Input hiện khi gõ */}
      {showFullInput && (
        <div
          ref={wrapperRef}
          className="z-50 bg-base-100 border-base-300 w-full"
        >
          <div className="flex w-full items-center gap-3 px-4 py-1 bg-base-200 rounded-full shadow-md">
            <input
              ref={inputRef}
              type="text"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-2xl font-semibold pl-3"
            />
            <button
              onClick={handleSend}
              className="btn btn-lg btn-primary btn-circle"
            >
              <Send className="text-white w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ✅ Khung rút gọn */}
      {!showFullInput && (
        <div className="w-full">
          <div className="relative w-full">
            <div
              className="input input-bordered input-ghost w-full pr-28 py-6 text-base rounded-3xl bg-base-300/50 backdrop-blur-md cursor-text"
              onClick={() => setShowFullInput(true)}
            >
              <span className="text-md text-base-content/60 font-semibold pl-3">
                Gửi tin nhắn...
              </span>
            </div>

            {/* ✅ Icon cảm xúc */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-4 pointer-events-auto px-3">
              {["🤣", "💛", "👍"].map((emoji) => (
                <button
                  key={emoji}
                  title={emoji}
                  onMouseDown={() => handleHoldStart(emoji)}
                  onMouseUp={() => handleHoldEnd(emoji)}
                  onMouseLeave={() => handleHoldEnd(emoji)}
                  onTouchStart={() => handleHoldStart(emoji)}
                  onTouchEnd={() => handleHoldEnd(emoji)}
                  className={`cursor-pointer select-none text-3xl transition-transform ${
                    holdingEmoji === emoji ? "shake" : ""
                  }`}
                >
                  <span>{emoji}</span>
                </button>
              ))}
              <button
                type="button"
                className="cursor-pointer relative"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <SmilePlus className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputForMoment;

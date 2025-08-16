import { useState, useEffect, useRef } from "react";
import { ArrowUp, SmilePlus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { SendMessageMoment, SendReactMoment } from "@/services";
import { showError, showSuccess } from "@/components/Toast";
import { getMomentById } from "@/cache/momentDB";

const InputForMoment = ({ uid }) => {
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

  const [userDetail, setUserDetail] = useState(null);
  const getUserFromFriendDetails = (uid) => {
    if (!uid) return null;

    try {
      const data = localStorage.getItem("friendDetails");
      if (!data) return null;

      const users = JSON.parse(data);
      return users.find((user) => user.uid === uid) || null;
    } catch (error) {
      console.error("Lỗi khi đọc friendDetails từ localStorage:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchMomentAndUser = async () => {
      try {
        const moment = await getMomentById(selectedMomentId);
        const data = await getUserFromFriendDetails(moment.user);
        setUserDetail(data);
      } catch (err) {
        console.error("Lỗi khi lấy moment hoặc user:", err);
      }
    };
    fetchMomentAndUser();
  }, [selectedMomentId]);

  const handleSend = async () => {
    try {
      const moment = await getMomentById(selectedMomentId);

      if (message.trim()) {
        await SendMessageMoment(message, moment.id, moment.user);
        setMessage("");
        setShowFullInput(false);
        showSuccess("Gửi tin nhắn thành công!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi message:", error);
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
        <div ref={wrapperRef} className="z-50 w-full">
          <div className="relative w-full">
            <div className="flex w-full items-center gap-3 px-4 py-2.5 bg-base-200 rounded-3xl shadow-md">
              <input
                ref={inputRef}
                type="text"
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none font-semibold pl-1"
              />
              <button
                onClick={handleSend}
                className="btn absolute right-3 p-1 btn-sm bg-base-300 btn-circle flex justify-center items-center"
              >
                <ArrowUp className="text-base-content w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Khung rút gọn */}
      {!showFullInput && (
        <div className="w-full">
          <div className="relative w-full">
            <div
              className="flex items-center w-full px-4 py-2.5 rounded-3xl bg-base-200 shadow-md cursor-text"
              onClick={() => setShowFullInput(true)}
            >
              <span className="flex-1 text-md text-base-content/60 font-semibold pl-1">
                Gửi tin nhắn đến {userDetail?.firstName} {userDetail?.lastName}
                ...
              </span>
            </div>

            {/* ✅ Icon cảm xúc */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-4 pointer-events-auto px-2">
              {["🤣", "💛", "👍"].map((emoji) => (
                <button
                  key={emoji}
                  title={emoji}
                  onMouseDown={() => handleHoldStart(emoji)}
                  onMouseUp={() => handleHoldEnd(emoji)}
                  onMouseLeave={() => handleHoldEnd(emoji)}
                  onTouchStart={() => handleHoldStart(emoji)}
                  onTouchEnd={() => handleHoldEnd(emoji)}
                  className={`cursor-pointer select-none text-2xl transition-transform ${
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
                <SmilePlus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputForMoment;

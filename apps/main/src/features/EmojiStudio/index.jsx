import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Laugh, X } from "lucide-react";

import { SendReactMoment } from "@/services";
import { allEmojis } from "@/constants/emojis";
import PlanBadge from "@/components/ui/PlanBadge/PlanBadge";
import { useApp } from "@/context/AppContext";
import { SonnerError, SonnerSuccess } from "@/components/ui/SonnerToast";
import { useReactionStore, useSelectedStore } from "@/stores";

const popularEmojis = allEmojis.slice(0, 20);

const EmojiPicker = () => {
  const selectedMomentId = useSelectedStore((s) => s.selectedMomentId);
  const triggerReaction = useReactionStore((s) => s.triggerReaction);

  const { showEmojiPicker, setShowEmojiPicker } = useApp().post;

  const [searchTerm, setSearchTerm] = useState("");

  const [recentEmojis, setRecentEmojis] = useState(() => {
    try {
      const saved = localStorage.getItem("recentEmojis");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading recent emojis:", error);
      return [];
    }
  });

  const holdStartRef = useRef(null);
  const touchStartPosRef = useRef(null);
  const movedRef = useRef(false);
  const sendingRef = useRef(false);

  const [holdingEmoji, setHoldingEmoji] = useState(null);
  const [intensity, setIntensity] = useState(0);

  const getIntensity = (startTime) => {
    const HOLD_MAX_MS = 5000;

    const elapsed = Date.now() - startTime;

    return Number(Math.min(elapsed / HOLD_MAX_MS, 1).toFixed(6));
  };

  const handlePointerDown = (e, emoji) => {
    touchStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    movedRef.current = false;

    holdStartRef.current = Date.now();

    setHoldingEmoji(emoji);
  };

  const handlePointerMove = (e) => {
    if (!touchStartPosRef.current) return;

    const dx = e.clientX - touchStartPosRef.current.x;
    const dy = e.clientY - touchStartPosRef.current.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 10) {
      movedRef.current = true;

      holdStartRef.current = null;

      setHoldingEmoji(null);
      setIntensity(0);
    }
  };

  const handlePointerUp = (emoji) => {
    if (movedRef.current) {
      cleanupHold();
      return;
    }

    let power = 0;

    if (holdStartRef.current) {
      power = getIntensity(holdStartRef.current);
    }

    sendReact(emoji, power);

    cleanupHold();
  };

  const handlePointerCancel = () => {
    cleanupHold();
  };

  const cleanupHold = () => {
    holdStartRef.current = null;
    touchStartPosRef.current = null;
    movedRef.current = false;

    setHoldingEmoji(null);
    setIntensity(0);
  };

  useEffect(() => {
    if (!holdingEmoji) return;

    const interval = setInterval(() => {
      if (!holdStartRef.current) return;

      setIntensity(getIntensity(holdStartRef.current));
    }, 16);

    return () => clearInterval(interval);
  }, [holdingEmoji]);

  const sendReact = async (emoji, power) => {
    if (sendingRef.current) return;

    sendingRef.current = true;
    try {
      setShowEmojiPicker(false);

      await SendReactMoment(emoji, selectedMomentId, power);

      SonnerSuccess(`Đã gửi cảm xúc ${emoji}, power: ${power}`);
      triggerReaction(emoji);

      if (!recentEmojis.includes(emoji)) {
        const newRecentEmojis = [emoji, ...recentEmojis.slice(0, 9)];

        setRecentEmojis(newRecentEmojis);

        localStorage.setItem("recentEmojis", JSON.stringify(newRecentEmojis));
      }
    } catch (error) {
      SonnerError("Gửi cảm xúc thất bại!");
      console.error(error);
    } finally {
      sendingRef.current = false;
    }
  };

  const filteredEmojis = allEmojis.filter((emoji) =>
    emoji.includes(searchTerm),
  );

  const renderEmojiGroup = (title, emojis) => (
    <div className="mb-6">
      <div className="text-sm text-base-content/60 font-medium mb-3">
        {title}
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-18 gap-2 select-none">
        {emojis.map((emoji, index) => {
          const emojiId = `${title}-${emoji}-${index}`;

          return (
            <button
              key={emojiId}
              onPointerDown={(e) => handlePointerDown(e, emojiId)}
              onPointerMove={handlePointerMove}
              onPointerUp={() => handlePointerUp(emoji)}
              onPointerCancel={handlePointerCancel}
              className={`
                aspect-square
                w-full
                flex
                items-center
                justify-center
                text-5xl
                md:text-5xl
                rounded-xl
                hover:bg-base-200
                transition-all
                duration-200
                ${holdingEmoji === emojiId ? "shake" : ""}
              `}
              style={
                holdingEmoji === emojiId
                  ? {
                      "--emoji-scale": 1 + intensity * 0.1, // 1 -> 1.3
                      "--shake-speed": `${Math.max(0.03, 0.15 - intensity * 0.12)}s`,
                    }
                  : undefined
              }
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );

  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  useEffect(() => {
    if (showEmojiPicker) {
      setShowModal(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setShowModal(false), 300);
    }
  }, [showEmojiPicker]);

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-base-100/30 backdrop-blur-[4px] transition-opacity duration-500 z-[62] ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setShowEmojiPicker(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed bottom-0 left-0 w-full h-2/3 bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 ease-in-out z-[63] flex flex-col text-base-content ${
          animate ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="flex justify-between items-center py-3 px-4 bg-base-100 rounded-t-4xl sticky top-0 z-50 border-b border-base-200">
          <div className="flex items-center space-x-2 text-primary">
            <Laugh size={22} />

            <div className="text-2xl font-lovehouse mt-1.5 font-semibold">
              Emoji studio
            </div>

            <PlanBadge />
          </div>

          <button
            onClick={() => setShowEmojiPicker(false)}
            className="text-primary cursor-pointer hover:bg-base-200 rounded-lg p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-2">
          <p className="text-sm text-base-content/70">Chạm để gửi cảm xúc</p>
        </div>

        <div className="px-4 flex-1 flex flex-col overflow-hidden">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm emoji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-full rounded-xl border border-base-300 bg-base-200 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex-1 overflow-y-auto pb-4">
            {searchTerm ? (
              renderEmojiGroup("Kết quả tìm kiếm", filteredEmojis)
            ) : (
              <>
                {recentEmojis.length > 0 &&
                  renderEmojiGroup("🕒 Gần đây", recentEmojis)}

                {renderEmojiGroup("🔥 Phổ biến", popularEmojis)}

                {renderEmojiGroup("😊 Tất cả", allEmojis)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default EmojiPicker;

import React, { useState, useRef, useEffect } from "react";
import { SendReactMoment } from "@/services/LocketDioService/ActionMoments";
import { showError, showSuccess } from "@/components/Toast";
import { Laugh, X } from "lucide-react";
import { allEmojis } from "@/constants/emojis";
import PlanBadge from "@/components/ui/PlanBadge/PlanBadge";
import { useApp } from "@/context/AppContext";

const popularEmojis = allEmojis.slice(0, 20);

const EmojiPicker = () => {
  const { selectedMomentId, showEmojiPicker, setShowEmojiPicker } =
    useApp().post;
  const {
    showFlyingEffect,
    setShowFlyingEffect,
    flyingEmojis,
    setFlyingEmojis,
  } = useApp().navigation;

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

  // Hold state
  const [reactionPower, setReactionPower] = useState(0);
  const [activeEmojiId, setActiveEmojiId] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdingEmoji, setHoldingEmoji] = useState(null);

  // Touch/scroll tracking
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const holdInterval = useRef(null);
  const wrapperRef = useRef(null);
  const holdTimeout = useRef(null);
  const hasSentRef = useRef(false);
  const isTouching = useRef(false);

  // Threshold cho việc phân biệt scroll và hold
  const MOVE_THRESHOLD = 10; // px
  const HOLD_DELAY = 600; // ms

  useEffect(() => {
    if (!showEmojiPicker) {
      resetAllStates();
    }
  }, [showEmojiPicker]);

  // Reset tất cả states
  const resetAllStates = () => {
    setActiveEmojiId(null);
    setReactionPower(0);
    setIsHolding(false);
    setHoldingEmoji(null);
    setShowFlyingEffect(false);
    setIsScrolling(false);
    setHasMoved(false);
    clearInterval(holdInterval.current);
    clearTimeout(holdTimeout.current);
    hasSentRef.current = false;
  };

  const handleReact = (emoji, power) => {
    cleanupHold();
    sendReact(emoji, power);
    return;
  };

  const sendReact = async (emoji, power = 0) => {
    if (hasSentRef.current) return; // ✅ Ngăn gọi lại nếu đã gửi
    hasSentRef.current = true; // ✅ Đánh dấu đã gửi

    try {
      setFlyingEmojis(emoji);
      setShowFlyingEffect(true);
      setShowEmojiPicker(false);

      await SendReactMoment(emoji, selectedMomentId, power);
      setFlyingEmojis(null);

      showSuccess(
        `Đã gửi cảm xúc ${emoji}${power > 0 ? ` (Power: ${power})` : ""}`
      );

      // Lưu recent
      if (!recentEmojis.includes(emoji)) {
        const newRecentEmojis = [emoji, ...recentEmojis.slice(0, 9)];
        setRecentEmojis(newRecentEmojis);
        localStorage.setItem("recentEmojis", JSON.stringify(newRecentEmojis));
      }
    } catch (error) {
      showError("Gửi cảm xúc thất bại!");
      console.error(error);
    }
  };

  // Mouse Events
  const handleMouseDown = (emoji, emojiId) => {
    if (isTouching.current) return;
    setActiveEmojiId(emojiId);
    setHoldingEmoji(emoji);
    setReactionPower(0);

    holdTimeout.current = setTimeout(() => {
      setIsHolding(true);
      startHoldEffect();
    }, HOLD_DELAY);
  };

  const handleMouseUp = (emoji, emojiId) => {
    if (isTouching.current || hasSentRef.current) return; // ✅ Ngăn gửi lại nếu đã gửi
    if (activeEmojiId !== emojiId) return;

    const power = isHolding ? reactionPower : 0;
    handleReact(emoji, power);
    return;
  };

  const handleMouseLeave = (emoji, emojiId) => {
    if (activeEmojiId === emojiId) {
      cleanupHold();
    }
  };

  // Touch Events
  const handleTouchStart = (e, emoji, emojiId) => {
    e.preventDefault();
    e.stopPropagation(); // ✅ chặn mouse event kế tiếp
    isTouching.current = true;

    const touch = e.touches[0];

    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchStartTime(Date.now());
    setHasMoved(false);
    setIsScrolling(false);
    setActiveEmojiId(emojiId);
    setHoldingEmoji(emoji);
    setReactionPower(0);

    holdTimeout.current = setTimeout(() => {
      if (!hasMoved && !isScrolling) {
        setIsHolding(true);
        startHoldEffect();
      }
    }, HOLD_DELAY);
  };

  const handleTouchMove = (e) => {
    if (!activeEmojiId) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
    const totalMove = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (totalMove > MOVE_THRESHOLD) {
      setHasMoved(true);
      setIsScrolling(true);
      cleanupHold();
    }
  };

  const handleTouchEnd = (e, emoji, emojiId) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasSentRef.current) return; // ✅ Ngăn gửi lại nếu đã gửi từ hold

    const touchDuration = Date.now() - touchStartTime;

    if (activeEmojiId === emojiId && !hasMoved && !isScrolling) {
      const power =
        isHolding || touchDuration >= HOLD_DELAY ? reactionPower : 0;
      handleReact(emoji, power);
    }

    cleanupHold();
    isTouching.current = false;
    return;
  };

  // Bắt đầu hiệu ứng hold
  const startHoldEffect = () => {
    holdInterval.current = setInterval(() => {
      setReactionPower((prev) => {
        if (prev >= 100) {
          clearInterval(holdInterval.current);
          return 100;
        }
        return prev + 1;
      });
    }, 50); // Tăng mỗi 50ms
  };

  // Dọn dẹp hold
  const cleanupHold = () => {
    setActiveEmojiId(null);
    setIsHolding(false);
    setHoldingEmoji(null);
    setReactionPower(0);
    setHasMoved(false);
    setIsScrolling(false);
    clearInterval(holdInterval.current);
    clearTimeout(holdTimeout.current);
  };

  const filteredEmojis = allEmojis.filter((e) => e.includes(searchTerm));

  const renderEmojiGroup = (title, emojis) => (
    <div className="mb-6">
      <div className="text-sm text-base-content/60 font-medium mb-3">
        {title}
      </div>
      <div className="flex flex-wrap gap-3">
        {emojis.map((emoji, index) => {
          const emojiId = `${title}-${emoji}-${index}`;
          const isActive = activeEmojiId === emojiId;

          return (
            <button
              key={emojiId}
              // Mouse events
              onMouseDown={(e) => {
                e.preventDefault();
                handleMouseDown(emoji, emojiId);
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                handleMouseUp(emoji, emojiId);
              }}
              onMouseLeave={() => handleMouseLeave(emoji, emojiId)}
              onTouchStart={(e) => handleTouchStart(e, emoji, emojiId)}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleTouchEnd(e, emoji, emojiId)}
              // Prevent context menu and selection
              onContextMenu={(e) => e.preventDefault()}
              className={`
                text-5xl cursor-pointer transition-all ease-in-out duration-200 
                select-none relative flex items-center justify-center
                w-12 h-12 rounded-lg
                ${isActive ? "shake" : "hover:scale-110"}
              `}
              style={{
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
            >
              {emoji}
              {/* Power indicator */}
              {isActive && isHolding && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary rounded-full px-2 py-1 text-xs text-primary-content min-w-8 text-center">
                    {reactionPower}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-base-100/30 backdrop-blur-[2px] transition-opacity duration-500 z-[62] ${
          showEmojiPicker
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowEmojiPicker(false)}
      />

      {/* Emoji Picker Container */}
      <div
        className={`fixed bottom-0 left-0 w-full h-2/3 bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 ease-in-out z-[63] flex flex-col ${
          showEmojiPicker
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full"
        }`}
        ref={wrapperRef}
      >
        {/* Header */}
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
          <p className="text-sm text-base-content/70">
            Chạm để gửi • Giữ để tăng power
          </p>
        </div>

        {/* Content */}
        <div className="px-4 flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm emoji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-full rounded-xl border border-base-300 bg-base-200 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Emoji groups - scrollable */}
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
    </>
  );
};

export default EmojiPicker;

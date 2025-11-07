import React, { useEffect, useState } from "react";

const FlyingEmojiEffect = ({ emoji, show = false, count = 40 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [cachedEmoji, setCachedEmoji] = useState(null);

  useEffect(() => {
    let timeout;

    if (show && emoji) {
      setCachedEmoji(emoji);      // Lưu emoji lại
      setIsVisible(true);         // Bắt đầu hiển thị
    } else if (!show && cachedEmoji) {
      timeout = setTimeout(() => {
        setIsVisible(false);      // Ẩn sau khi hiệu ứng kết thúc
        setCachedEmoji(null);     // Xoá emoji sau khi hoàn tất
      }, 4500); // ~4.5 giây cho hiệu ứng hoàn tất
    }

    return () => clearTimeout(timeout);
  }, [show, emoji]);

  if (!isVisible || !cachedEmoji) return null;

  return (
<div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden">
  {[...Array(count)].map((_, i) => {
    const randomLeft = Math.random() * 100;
    const randomScale = Math.random() * 1.5 + 0.8;
    const randomRotation = Math.random() * 360 - 180;
    const randomX = Math.random() * 200 - 100; // bay xiên trái/phải
    const randomY = Math.random() * 60 + 60; // bay cao hơn
    const randomDuration = Math.random() * 0.6 + 3.6; // 3.6 - 4.2s
    const randomDelay = Math.random() * 0.5;
    const randomOpacity = Math.random() * 0.4 + 0.6;

    const animationName = `flyUp-${i}`;

    return (
      <div
        key={i}
        className="absolute"
        style={{
          left: `${randomLeft}%`,
          bottom: "-30px",
          transform: `scale(${randomScale}) rotate(${randomRotation}deg)`,
          opacity: randomOpacity,
          fontSize: "2.5rem",
          animation: `${animationName} ${randomDuration}s ease-out ${randomDelay}s forwards`,
        }}
      >
        {cachedEmoji}
        <style jsx>{`
          @keyframes ${animationName} {
            0% {
              transform: translate(0, 0) scale(${randomScale}) rotate(${randomRotation}deg);
              opacity: ${randomOpacity};
            }
            30% {
              transform: translate(${randomX / 2}vw, -${randomY / 2}vh)
                scale(${randomScale + 0.3})
                rotate(${randomRotation + 90}deg);
              opacity: ${randomOpacity + 0.2};
            }
            100% {
              transform: translate(${randomX}vw, -${randomY}vh)
                scale(${randomScale - 0.2})
                rotate(${randomRotation + 180}deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  })}
</div>

  );
};

export default FlyingEmojiEffect;

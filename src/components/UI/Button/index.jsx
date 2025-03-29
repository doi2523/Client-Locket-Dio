import { useState, useRef } from "react";

export default function HoldButton() {
  const [isHolding, setIsHolding] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const holdTimeout = useRef(null);
  const intervalRef = useRef(null);

  const handleMouseDown = () => {
    setIsHolding(true);
    setHoldTime(0);

    intervalRef.current = setInterval(() => {
      setHoldTime((prev) => prev + 0.1);
    }, 100);

    holdTimeout.current = setTimeout(() => {
      console.log("Button held down!");
    }, 1000); // 1s giữ
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    clearTimeout(holdTimeout.current);
    clearInterval(intervalRef.current);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        className={`px-6 py-3 text-white font-bold rounded-lg transition-all duration-200 select-none ${
          isHolding ? "bg-red-600 scale-95" : "bg-blue-600 hover:bg-blue-700"
        }`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        Nhấn giữ
      </button>
      {/* {isHolding && (
        <p className="text-gray-700 font-medium">
          Đã giữ: {holdTime.toFixed(1)} giây
        </p>
      )} */}
    </div>
  );
}

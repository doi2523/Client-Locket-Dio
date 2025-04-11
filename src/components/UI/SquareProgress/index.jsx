import { useRef, useState } from "react";
import React from "react";
import "./SquareProgress.css"; // Nhớ import

const SquareProgress = () => {
  const [running, setRunning] = useState(false);
  const pathRef = useRef(null);

  const handleStart = () => {
    if (!pathRef.current) return;
    pathRef.current.style.animationPlayState = "running";
    setRunning(true);
  };

  const handlePause = () => {
    if (!pathRef.current) return;
    pathRef.current.style.animationPlayState = "paused";
    setRunning(false);
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      <svg viewBox="0 0 210 210" className="square-progress w-full h-full">
        <path
          className="path-bg"
          d="
            M110,10
            H190
            A10,10 0 0 1 200,20
            V190
            A10,10 0 0 1 190,200
            H30
            A10,10 0 0 1 20,190
            V20
            A10,10 0 0 1 30,10
            H110
          "
        />
        <path
          ref={pathRef}
          className="path-progress"
          d="
            M110,10
            H190
            A10,10 0 0 1 200,20
            V190
            A10,10 0 0 1 190,200
            H30
            A10,10 0 0 1 20,190
            V20
            A10,10 0 0 1 30,10
            H110
          "
        />
      </svg>
    </div>
  );
  
};

export default SquareProgress;

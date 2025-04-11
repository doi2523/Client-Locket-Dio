import React from "react";

const BorderProgress = ({ show = false, running = false }) => {
  if (!show) return null;

  return (
    <>
      <svg
        className="absolute w-full h-full z-50"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ borderRadius: "65px", overflow: "hidden" }}
      >
        <defs>
          <clipPath id="roundedClip">
            <rect x="0" y="0" width="100" height="100" rx="15" ry="15" />
          </clipPath>
        </defs>

        <path
          clipPath="url(#roundedClip)"
          d="
            M15,0 H85 A15,15 0 0 1 100,15
            V85 A15,15 0 0 1 85,100
            H15 A15,15 0 0 1 0,85
            V15 A15,15 0 0 1 15,0 Z
          "
          stroke="#444"
          strokeWidth="2"
          fill="none"
        />

        <path
          clipPath="url(#roundedClip)"
          d="
            M50,0 H85 A15,15 0 0 1 100,15
            V85 A15,15 0 0 1 85,100
            H15 A15,15 0 0 1 0,85
            V15 A15,15 0 0 1 15,0 Z
          "
          stroke="#00ccff"
          strokeWidth="4"
          fill="none"
          strokeLinecap="butt"
          strokeDasharray="400"
          strokeDashoffset="400"
          style={{
            animation: running ? "pathProgress 5s linear forwards" : "none",
          }}
        />
      </svg>

      <style>{`
        @keyframes pathProgress {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </>
  );
};

export default BorderProgress;

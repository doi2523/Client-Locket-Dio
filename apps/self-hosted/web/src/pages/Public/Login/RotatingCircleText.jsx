import React from "react";

export default function RotatingCircleText() {
  return (
    <div className="absolute -z-10 -top-9 -right-9 w-24 h-24 flex items-center justify-center">
      <div className="absolute animate-spin-slow-reverse">
        <svg viewBox="0 0 200 200" className="w-27 h-27">
          <defs>
            <path
              id="circlePath"
              d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
            />
          </defs>
          <text fontSize="19" fill="#6B21A8" fontWeight="bold">
            <textPath
              href="#circlePath"
              startOffset="0"
              textLength="500"
              spacing="auto"
            >
              Locket Dio • Share Moments • Locket Dio • Share Moments •
            </textPath>
          </text>
        </svg>
      </div>
      <div className="absolute animate-spin-slow">
        <svg viewBox="0 0 200 200" className="w-40 h-40">
          <defs>
            <path
              id="circlePath"
              d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
            />
          </defs>
          <text fontSize="19" fill="#6B21A8" fontWeight="bold">
            <textPath
              href="#circlePath"
              startOffset="0"
              textLength="500"
              spacing="auto"
            >
              Locket Dio • Modern • Convenient • Cross-Platform • Security •
            </textPath>
          </text>
        </svg>
      </div>
      {/* <div className="text-purple-700 font-semibold text-xl">💜</div> */}
    </div>
  );
}

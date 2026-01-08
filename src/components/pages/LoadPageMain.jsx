import React from "react";
import { Zoomies } from "ldrs/react";
import "ldrs/react/Zoomies.css";
import "./styles.css";

const LoadingPageMain = ({ isLoading }) => {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 bg-base-100 gap-2 text-base-content transition-opacity duration-700 ${
        isLoading
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"
      }`}
    >
      {/* Logo */}
      <div>
        <img
          src="/apple-touch-icon.png"
          alt="Locket Dio"
          loading="lazy"
          className="w-20 h-20 shadow-md rounded-2xl loading-bounce-y"
        />
      </div>
      <h1 className="text-xl font-semibold">The Locket Dio is loading.</h1>
      <p className="text-sm opacity-70 animate-pulse">
        Preparing your memories…
      </p>
      <Zoomies
        size="80"
        stroke="5"
        bgOpacity="0.1"
        speed="1.4"
        color="currentColor"
      />
    </div>
  );
};

export default LoadingPageMain;

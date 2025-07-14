import React from "react";
import Mirage from "../UI/Loading/mirage";

const LoadingPage = ({ isLoading }) => {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 bg-base-100 text-base-content transition-opacity duration-700 ${
        isLoading
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"
      }`}
    >
      <Mirage />
    </div>
  );
};

export default LoadingPage;

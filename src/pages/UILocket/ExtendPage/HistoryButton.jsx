import React from "react";

const HistoryArrow = () => {
  return (
    <div className="relative flex flex-col items-center h-20 pt-4">
      <div className="flex items-center justify-center space-x-2">
        <div className="bg-base-content text-accent font-semibold px-2 py-0.5 rounded-lg shadow-md">
          8
        </div>
        <span className="text-md font-semibold text-gray-800">Lịch sử</span>
      </div>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-1"
      >
        <path
          d="M4 8l14 7l14-7"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default HistoryArrow;

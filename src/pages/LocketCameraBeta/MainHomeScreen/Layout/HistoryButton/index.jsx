import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";

const HistoryArrow = ({ setIsBottomOpen }) => {
  const { navigation, post } = useApp();
  const { recentPosts, setRecentPosts } = post;

  const handleClick = () => {
    setIsBottomOpen(true);
  };
  // Khởi tạo và đồng bộ dữ liệu từ localStorage
  useEffect(() => {
    const savedPayloads = JSON.parse(
      localStorage.getItem("uploadedMoments") || "[]"
    );
    setRecentPosts(savedPayloads); // Cập nhật state từ localStorage
  }, [, setRecentPosts]);

  return (
    <>
      <div className={`flex flex-col items-center select-none`}>
        <button
          className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          onClick={handleClick}
        >
          <div className="flex items-center justify-center space-x-2 mb-1">
            {/* <div className="bg-accent text-base-content font-semibold px-[9px] py-0.5 rounded-lg shadow-md">
          {recentPosts.length}
        </div> */}
            <span className="text-xl font-semibold text-base-content">
              Lịch sử
            </span>
          </div>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className=""
          >
            <path
              d="M4 8l17 7l17-7"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default HistoryArrow;

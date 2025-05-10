import React, { useEffect } from "react";
import { useApp } from "../../../context/AppContext";
import { ChevronDown } from "lucide-react";

const HistoryArrow = () => {
  const { navigation, post } = useApp();
  const { setIsBottomOpen } = navigation;
  const { recentPosts, setRecentPosts } = post;

  const handleClick = () => {
    setIsBottomOpen(true);
  };
  // Khởi tạo và đồng bộ dữ liệu từ localStorage
  useEffect(() => {
    const savedPayloads = JSON.parse(
      localStorage.getItem("uploadPayloads") || "[]"
    );
    setRecentPosts(savedPayloads); // Cập nhật state từ localStorage
  }, [, setRecentPosts]);

  return (
    <div
      className="relative flex flex-col items-center h-20 pt-4 cursor-pointer transition-transform hover:scale-105 active:scale-95"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center space-x-2">
        <div className="bg-accent text-base-content font-semibold px-[9px] py-0.5 rounded-lg shadow-md">
          {recentPosts.length}
        </div>
        <span className="text-md font-semibold text-base-content">Lịch sử</span>
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

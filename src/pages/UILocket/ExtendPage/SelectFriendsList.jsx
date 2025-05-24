import React from "react";
import { useApp } from "../../../context/AppContext";

const SelectFriendsList = () => {
  const { navigation } = useApp();
  const { isFriendsTabOpen, setFirendsTabOpen } = navigation;
  const handleClick = () => {
    alert("Sắp ra mắt!\n\nChức năng 'Bạn bè' đang được phát triển.\nHãy ủng hộ để giúp duy trì và phát triển trang web nhé ❤️\n\nDio");
    // setFirendsTabOpen(true);
  };

  return (
    <div
      className="relative pl-1 flex flex-col items-center pt-4 h-20 cursor-pointer transition-transform hover:scale-105 active:scale-95"
      onClick={handleClick}
    >
      <span className="text-md font-semibold text-base-content text-center">
        <span> ?? {" "}
        </span>
        Bạn bè</span>
      <svg
        width="35"
        height="40"
        viewBox="0 20 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-base-content mr-1"
      >
        <path
          d="M4 8l14 7l14-7"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="rotate(180 20 20)"
        />
      </svg>
    </div>
  );
};

export default SelectFriendsList;

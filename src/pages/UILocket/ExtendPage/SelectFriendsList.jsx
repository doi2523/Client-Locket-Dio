import React, { useContext, useState, useEffect } from "react";
import { FaUserFriends } from "react-icons/fa";
import { useApp } from "../../../context/AppContext";
import { AuthContext } from "../../../context/AuthLocket";
import clsx from "clsx";

const SelectFriendsList = () => {
  const { friendDetails } = useContext(AuthContext);
  const [selectedFriends, setSelectedFriends] = useState([]);

  // Lưu vào localStorage hoặc context nếu cần
  // useEffect(() => {
  //   localStorage.setItem("selectedFriends", JSON.stringify(selectedFriends));
  // }, [selectedFriends]);

  const handleToggle = (uid) => {
    // setSelectedFriends((prev) =>
    //   prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    // );
  };

  const handleSelectAll = () => {
    // if (selectedFriends.length === friendDetails.length) {
    //   setSelectedFriends([]);
    // } else {
    //   const allIds = friendDetails.map((f) => f.uid);
    //   setSelectedFriends(allIds);
    // }
  };
  const handleClick = () => {
    alert("Sắp ra mắt!\n\nChức năng 'Bạn bè' đang được phát triển.\nHãy ủng hộ để giúp duy trì và phát triển trang web nhé ❤️\n\nDio");
    // setFirendsTabOpen(true);
  };
  return (
    <div className="flex flex-col items-start w-full px-4"
    onClick={handleClick}>
      <div className="flex gap-3 overflow-x-auto pb-2 w-full no-scrollbar">
        {/* Mục "Tất cả" */}
        <div className="flex flex-col items-center justify-center">
          <div
            onClick={handleSelectAll}
            className={clsx(
              "flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95",
              selectedFriends.length === friendDetails.length &&
                "border-2 p-[3px] rounded-full"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-xl font-bold text-primary">
            <FaUserFriends className="w-6 h-6 text-base-content"/>
            </div>
          </div>
          <span className="text-xs mt-1 text-base-content font-semibold">
            Tất cả
          </span>
        </div>

        {/* Danh sách bạn bè */}
        {friendDetails.map((friend) => {
          const isSelected = selectedFriends.includes(friend.uid);
          return (
            <div
              key={friend.uid}
              onClick={() => handleToggle(friend.uid)}
              className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <div className="w-10 h-10 aspect-square">
                <img
                  src={friend.profilePic || "./default-avatar.png"}
                  alt={friend.firstName}
                  className={clsx(
                    "w-full h-full rounded-full object-cover border-2 p-[1px]",
                    isSelected ? "border-primary" : "border-transparent"
                  )}
                />
              </div>

              <span className="text-xs mt-1 text-center max-w-[4rem] truncate text-base-content">
                {friend.firstName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectFriendsList;

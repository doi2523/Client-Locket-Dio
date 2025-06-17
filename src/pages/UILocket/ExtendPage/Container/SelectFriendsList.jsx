import React, { useContext, useState, useEffect, useRef } from "react";
import { FaUserFriends } from "react-icons/fa";
import { useApp } from "../../../../context/AppContext";
import { AuthContext } from "../../../../context/AuthLocket";
import clsx from "clsx";

const SelectFriendsList = () => {
  const { userPlan, friendDetails } = useContext(AuthContext);
  const { post } = useApp();
  const { audience, setAudience, selectedRecipients, setSelectedRecipients } =
    post;

  const [selectedFriends, setSelectedFriends] = useState([]);

  // Nếu audience là "all", chọn tất cả bạn bè
  useEffect(() => {
    if (audience === "all") {
      const allIds = friendDetails.map((f) => f.uid);
      setSelectedFriends(allIds);
    }
  }, [audience, friendDetails]);

  // Đồng bộ với context + log
  useEffect(() => {
    setSelectedRecipients(selectedFriends);
    // console.log("Selected Friends:", selectedFriends);
  }, [selectedFriends]);

  const handleToggle = (uid) => {
    setAudience("selected");
    setSelectedFriends((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleSelectAll = () => {
    const allIds = friendDetails.map((f) => f.uid);
    if (selectedFriends.length === friendDetails.length) {
      setAudience("selected");
      setSelectedFriends([]);
    } else {
      setAudience("all");
      setSelectedFriends(allIds);
    }
  };
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Lấy chiều rộng viewport
      const vw = window.innerWidth;
      // Lấy phần tử đầu tiên (index 0)
      const firstChild = scrollRef.current.children[0];
      if (firstChild) {
        // Tính vị trí scroll để căn giữa phần tử đầu tiên:
        // scrollLeft = vị trí phần tử đầu tiên - 1/2 chiều rộng viewport + 1/2 chiều rộng phần tử
        const firstChildRect = firstChild.getBoundingClientRect();
        const containerRect = scrollRef.current.getBoundingClientRect();
        const offsetLeft = firstChild.offsetLeft;
        const offsetCenter = offsetLeft - vw / 2 + firstChildRect.width / 2;
        scrollRef.current.scrollLeft = offsetCenter;
      }
    }
  }, [friendDetails]);
  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x snap-mandatory px-[47vw]"
      >
        {/* Mục "Tất cả" */}
        <div className="flex flex-col items-center justify-center snap-center shrink-0">
          <div
            onClick={handleSelectAll}
            className={clsx(
              "flex flex-col items-center justify-center cursor-pointer rounded-full border-2 transition-all duration-300 transform",
              selectedFriends.length === friendDetails.length
                ? "border-primary scale-100"
                : "border-transparent scale-95"
            )}
          >
            <div className="w-11 h-11 rounded-full bg-base-300 flex items-center justify-center text-xl font-bold text-primary">
              <FaUserFriends className="w-6 h-6 text-base-content" />
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
              className="flex flex-col items-center cursor-pointer transition-opacity hover:opacity-80 active:opacity-60 snap-center shrink-0"
            >
              <div
                className={clsx(
                  "w-11 h-11 border-2 p-[1px] rounded-full transition-all duration-300 transform",
                  isSelected
                    ? "border-primary scale-100"
                    : "border-transparent scale-95"
                )}
              >
                <img
                  src={friend.profilePic || "./prvlocket.png"}
                  alt={friend.firstName}
                  className="w-full h-full rounded-full object-cover"
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

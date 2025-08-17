import React, { useContext, useState, useEffect, useRef } from "react";
import { FaUserFriends, FaLock } from "react-icons/fa";
import { useApp } from "@/context/AppContext";
import { AuthContext } from "@/context/AuthLocket";
import clsx from "clsx";
import { getToken } from "@/utils";
import FriendSelectItems from "./FriendSelectItems";
import { showWarning } from "@/components/Toast";

const SelectFriendsList = () => {
  const { userPlan, friendDetails } = useContext(AuthContext);
  const { post } = useApp();
  const { audience, setAudience, setSelectedRecipients } = post;

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

  const handleSelectPrivate = () => {
    showWarning("Chưa hỗ trợ điều này...");
    // const { localId } = getToken() || {};
    // setAudience("private"); // Thay đổi audience thành "private"
    // setSelectedFriends([localId]); // Set selectedFriends là array chứa localId
  };

  // Check xem có phải đang ở chế độ private không
  const isPrivateMode = () => {
    const { localId } = getToken() || {};
    return (
      audience === "private" ||
      (selectedFriends.length === 1 && selectedFriends.includes(localId))
    );
  };

  // Check xem có phải đang select tất cả không
  const isSelectAll = () => {
    return (
      audience === "all" || selectedFriends.length === friendDetails.length
    );
  };

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Lấy chiều rộng viewport
      const vw = window.innerWidth;
      // Lấy phần tử thứ hai (index 1) - "Tất cả"
      const secondChild = scrollRef.current.children[1];
      if (secondChild) {
        // Tính vị trí scroll để căn giữa phần tử "Tất cả":
        const secondChildRect = secondChild.getBoundingClientRect();
        const offsetLeft = secondChild.offsetLeft;
        const offsetCenter = offsetLeft - vw / 2 + secondChildRect.width / 2;
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
        {/* Mục "Riêng tư" */}
        <div
          className={clsx(
            "flex flex-col items-center justify-center snap-center shrink-0 transition-all duration-300",
            isPrivateMode() ? "opacity-100" : "opacity-60"
          )}
        >
          <div
            onClick={handleSelectPrivate}
            className={clsx(
              "flex p-0.5 flex-col items-center justify-center cursor-pointer rounded-full border-[2.5px] transition-all duration-300 transform",
              isPrivateMode()
                ? "border-amber-400 scale-100"
                : "border-gray-700 scale-95"
            )}
          >
            <div className="w-11 h-11 rounded-full bg-base-300 flex items-center justify-center text-xl font-bold text-primary">
              <FaLock className="w-5 h-5 text-base-content" />
            </div>
          </div>
          <span className="text-xs mt-1 text-base-content font-semibold">
            Riêng tư
          </span>
        </div>

        {/* Mục "Tất cả" */}
        <div
          className={clsx(
            "flex flex-col items-center justify-center snap-center shrink-0 transition-all duration-300",
            isSelectAll() ? "opacity-100" : "opacity-60"
          )}
        >
          <div
            onClick={handleSelectAll}
            className={clsx(
              "flex p-0.5 flex-col items-center justify-center cursor-pointer rounded-full border-[2.5px] transition-all duration-300 transform",
              isSelectAll()
                ? "border-amber-400 scale-100"
                : "border-gray-700 scale-95"
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
        {friendDetails.map((friend) => (
          <FriendSelectItems
            key={friend.uid}
            friend={friend}
            isSelected={selectedFriends.includes(friend.uid)}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectFriendsList;

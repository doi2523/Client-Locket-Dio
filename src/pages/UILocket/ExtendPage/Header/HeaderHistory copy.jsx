import { ChevronDown, MessageCircle } from "lucide-react";
import BadgePlan from "../Badge";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../../context/AuthLocket";

const HeaderHistory = () => {
  const { friendDetails } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full px-4 py-2 text-base-content absolute z-60">
      <div className="grid grid-cols-3 items-center">
        {/* Trái: Badge */}
        <div className="flex justify-start items-center">
          <BadgePlan />
        </div>

        {/* Giữa: Dropdown */}
        <div
          className="flex justify-center items-center relative"
          ref={dropdownRef}
        >
          <div
            onClick={toggleDropdown}
            className="bg-base-300/20 drop-shadow-2xl backdrop-blur-md px-4 py-2.5 rounded-3xl font-semibold text-md flex items-center cursor-pointer hover:bg-base-300 transition"
          >
            Mọi người{" "}
            <ChevronDown
              className={`ml-1 w-5 h-5 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              strokeWidth={2.5}
            />
          </div>

          {/* Dropdown chỉ chứa 2 lựa chọn */}
          {/* {isOpen && (
            <div className="absolute top-full mt-2 w-full bg-base-100 border border-base-300 rounded-xl shadow-lg z-60">
              <ul className="py-2 text-sm max-h-60 overflow-y-auto">
                <li className="px-4 py-2 hover:bg-base-200 cursor-pointer font-medium text-base">
                  Tất cả
                </li>
                <li className="px-4 py-2 hover:bg-base-200 cursor-pointer font-medium text-base">
                  Chỉ mình tôi
                </li>
              </ul>
            </div>
          )} */}
        </div>

        {/* Phải: Tin nhắn */}
        <div className="flex justify-end items-center">
          <button className="rounded-full p-2 backdrop-blur-2xl relative">
            <MessageCircle size={30} />
          </button>
        </div>
      </div>

      {/* Danh sách bạn bè - TÁCH RIÊNG */}
      {isOpen && (
        <div className={`mt-4 bg-base-100 border border-base-300 rounded-xl shadow-md p-3 transition-all duration-500 ${isOpen ? "scale-100" : "scale-0"}`}>
          <h3 className="font-semibold mb-2 text-base">Danh sách bạn bè</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {friendDetails && friendDetails.length > 0 ? (
              friendDetails.map((friend) => (
                <div
                  key={friend.uid || friend.email || friend.username}
                  className="flex items-center gap-3 hover:bg-base-200 px-3 py-2 rounded-lg transition cursor-pointer"
                >
                  <img
                    src={friend.profilePic || "/default-avatar.png"}
                    alt={friend.name || "avatar"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-base font-medium">
                    {friend.firstName || friend.lastName || "Bạn bè"}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-400 italic text-sm text-center">
                Không có bạn bè
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderHistory;

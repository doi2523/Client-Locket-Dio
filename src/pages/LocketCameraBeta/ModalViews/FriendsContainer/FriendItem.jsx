import React, { useState, useEffect, useRef } from "react";
import { Ban, EyeOff, UserRoundX, X } from "lucide-react";
import Modal from "@/components/ui/Modal";

export default function FriendItem({ friends, onDelete, onHidden }) {
  const [openMenuUid, setOpenMenuUid] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalTwo, setOpenModalTwo] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Map ref cho từng friend
  const menuRefs = useRef({});

  const toggleMenu = (uid) => {
    setOpenMenuUid((prev) => (prev === uid ? null : uid));
  };

  // Click outside để đóng menu
  useEffect(() => {
    const handleClick = (e) => {
      if (!openMenuUid) return;

      const ref = menuRefs.current[openMenuUid];
      if (ref && !ref.contains(e.target)) {
        setOpenMenuUid(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenuUid]);

  return (
    <>
      {friends
        .slice()
        .sort((a, b) =>
          a.isCelebrity === b.isCelebrity ? 0 : a.isCelebrity ? -1 : 1
        )
        .map((friend) => (
          <div
            key={friend.uid}
            className="flex items-center gap-3 rounded-md justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16">
                <img
                  src={friend.profilePic || "/images/default_profile.png"}
                  alt={`${friend.firstName} ${friend.lastName}`}
                  className="w-16 h-16 rounded-full border-[3.5px] p-0.5 border-amber-400 object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // tránh loop
                    e.target.src = "/images/default_profile.png";
                  }}
                />

                {friend.badge === "locket_gold" ? (
                  <img
                    src="https://cdn.locket-dio.com/v1/caption/caption-icon/locket_gold_badge.png"
                    alt="Gold Badge"
                    className="absolute bottom-0 right-0 w-6 h-6 p-0.5 bg-base-100 rounded-full"
                  />
                ) : friend.isCelebrity ? (
                  <img
                    src="https://cdn.locket-dio.com/v1/caption/caption-icon/celebrity_badge.png"
                    alt="Celebrity"
                    className="absolute bottom-0 right-0 w-6 h-6 p-0.5 bg-base-100 rounded-full"
                  />
                ) : null}
              </div>

              <div>
                <h2 className="font-medium text-base">
                  {friend.firstName} {friend.lastName}
                </h2>
                <p className="text-sm text-gray-500">
                  @{friend.username || "Không có username"}
                </p>
              </div>
            </div>

            {/* MENU */}
            <div
              className="relative"
              ref={(el) => (menuRefs.current[friend.uid] = el)} // <- gán ref riêng
            >
              <button
                className="text-red-500 p-2 rounded-full transition active:scale-95"
                onClick={() => toggleMenu(friend.uid)}
              >
                <X className="w-6 h-6" />
              </button>

              <div
                className={`
    absolute -top-38 right-1 origin-bottom-right bg-white shadow-xl rounded-xl w-48 p-2 flex flex-col justify-center gap-2 z-50
    transition-all duration-200 
    ${
      openMenuUid === friend.uid
        ? "scale-100 opacity-100"
        : "scale-0 opacity-0 pointer-events-none"
    }
  `}
              >
                {/* Ẩn bạn bè */}
                <button
                  onClick={() => {
                    setOpenModalTwo(true);
                    setOpenMenuUid(null);
                    setSelectedFriend(friend);
                  }}
                  className="btn w-full flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                >
                  <span className="text-gray-700">Ẩn bạn bè</span>
                  <EyeOff className="w-4 h-4 text-gray-600" />
                </button>

                {/* Xóa bạn bè */}
                <button
                  onClick={() => {
                    setOpenMenuUid(null);
                    setSelectedFriend(friend);
                    setOpenModal(true);
                  }}
                  className="btn w-full flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-red-600"
                >
                  <span>Xoá bạn bè</span>
                  <UserRoundX className="w-4 h-4" />
                </button>

                {/* Chặn bạn bè */}
                <button className="btn w-full flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-red-700 font-medium">
                  <span>Chặn bạn bè</span>
                  <Ban className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Bạn có chắc muốn xoá người bạn này?"
        actions={
          <>
            <button
              onClick={() => setOpenModal(false)}
              className="btn btn-soft px-4 py-2 rounded-xl transition-colors"
            >
              Huỷ
            </button>
            <button
              onClick={() => {
                onDelete(selectedFriend.uid);
                setOpenModal(false);
              }}
              className="btn btn-error px-4 rounded-xl py-2 transition-colors"
            >
              Xoá bạn
            </button>
          </>
        }
      >
        <div className="mb-1">
          Người bạn đã chọn:{" "}
          <span className="font-semibold text-primary">
            {selectedFriend?.firstName} {selectedFriend?.lastName}
          </span>
        </div>
        Việc này sẽ xoá bạn bè khỏi danh sách bạn bè của bạn và không thể hoàn
        tác.
      </Modal>

      <Modal
        open={openModalTwo}
        onClose={() => setOpenModalTwo(false)}
        title="Bạn có chắc muốn ẩn người bạn này?"
        actions={
          <>
            <button
              onClick={() => setOpenModalTwo(false)}
              className="btn btn-soft px-4 py-2 rounded-xl transition-colors"
            >
              Huỷ
            </button>
            <button
              onClick={() => {
                onHidden(selectedFriend.uid);
                setOpenModalTwo(false);
              }}
              className="btn btn-accent px-4 rounded-xl py-2 transition-colors"
            >
              Ẩn bạn
            </button>
          </>
        }
      >
        <div className="mb-1">
          Người bạn đã chọn:{" "}
          <span className="font-semibold text-primary">
            {selectedFriend?.firstName} {selectedFriend?.lastName}
          </span>
        </div>
        <p className="text-center mb-1">
          Bạn sẽ không còn thấy Locket của họ và họ sẽ không thấy Locket mới của
          bạn kể từ bây giờ.
        </p>
        <p className="text-center">
          Họ sẽ không nhận được thông báo rằng họ bị ẩn và các bạn vẫn là bạn
          bè.
        </p>
      </Modal>
    </>
  );
}

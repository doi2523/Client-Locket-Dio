import React, { useState, useEffect, useRef } from "react";
import {
  Ban,
  EyeOff,
  UserRoundX,
  X,
  Info,
  Eye,
  CircleEllipsis,
} from "lucide-react";
import { useFriendStoreV2 } from "@/stores";
import { SonnerInfo } from "@/components/ui/SonnerToast";
import ConfirmPoup from "@/components/PoupScreen/ConfirmPoup";

export default function FriendItem({ friend, onDelete, onHidden }) {
  const [openMenuUid, setOpenMenuUid] = useState(null);
  const [openInfoUid, setOpenInfoUid] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openHiddenModal, setOpenHiddenModal] = useState(false);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const menuRefs = useRef({});
  const infoRefs = useRef({});

  const friendRelationsMap = useFriendStoreV2((s) => s.friendRelationsMap);
  const relation = friendRelationsMap[friend.uid] || {};

  const isHidden = relation.hidden;
  const sharedHistoryOn = relation.sharedHistoryOn;
  const createdAt = relation.createdAt;

  const toggleMenu = (uid) =>
    setOpenMenuUid((prev) => (prev === uid ? null : uid));

  const toggleInfo = (uid) =>
    setOpenInfoUid((prev) => (prev === uid ? null : uid));

  // click outside handler
  useEffect(() => {
    const handleClick = (e) => {
      if (openMenuUid) {
        const ref = menuRefs.current[openMenuUid];
        if (ref && !ref.contains(e.target)) setOpenMenuUid(null);
      }

      if (openInfoUid) {
        const ref = infoRefs.current[openInfoUid];
        if (ref && !ref.contains(e.target)) setOpenInfoUid(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenuUid, openInfoUid]);

  const handleDelete = () => {
    onDelete(selectedFriend.uid);
    setOpenDeleteModal(false);
  };

  const handleHidden = () => {
    onHidden(relation, selectedFriend.uid);
    setOpenHiddenModal(false);
  };

  const handleBlock = () => {
    // onHidden(relation, selectedFriend.uid);
    SonnerInfo("Chậm một chút :))", "Tính năng đang được phát triển!");
    // setOpenHiddenModal(false);
  };

  return (
    <>
      <div className="flex items-center justify-between py-2">
        {/* LEFT */}
        <div className={`flex items-center gap-3 ${isHidden && "opacity-60"}`}>
          <Avatar friend={friend} />

          <div>
            <h2 className={`font-medium ${isHidden && "text-gray-400"}`}>
              {friend.firstName} {friend.lastName}
            </h2>
            <p className="text-sm text-gray-500">
              @{friend.username || "Không có username"}
            </p>
          </div>

          {isHidden && (
            <div className="flex items-center gap-1 text-sm">
              <EyeOff className="w-4 h-4" /> Hidden
            </div>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-1">
          {/* INFO */}
          {!isHidden && (
            <div
              className="relative"
              ref={(el) => (infoRefs.current[friend.uid] = el)}
            >
              <button
                onClick={() => toggleInfo(friend.uid)}
                className="text-blue-500 p-2 rounded-full"
              >
                <Info className="w-5 h-5" />
              </button>

              <InfoDropdown
                open={openInfoUid === friend.uid}
                sharedHistoryOn={sharedHistoryOn}
                createdAt={createdAt}
              />
            </div>
          )}

          {/* MENU */}
          <div
            className="relative"
            ref={(el) => (menuRefs.current[friend.uid] = el)}
          >
            <button
              onClick={() => toggleMenu(friend.uid)}
              className="p-2 rounded-full"
            >
              {isHidden ? (
                <CircleEllipsis className="w-6 h-6" />
              ) : (
                <X className="w-6 h-6 text-red-500" />
              )}
            </button>

            <MenuDropdown
              open={openMenuUid === friend.uid}
              isHidden={isHidden}
              onHidden={() => {
                setSelectedFriend(friend);
                setOpenHiddenModal(true);
                setOpenMenuUid(null);
              }}
              onDelete={() => {
                setSelectedFriend(friend);
                setOpenDeleteModal(true);
                setOpenMenuUid(null);
              }}
              onBlock={() => {
                setSelectedFriend(friend);
                setOpenBlockModal(true);
                setOpenMenuUid(null);
              }}
            />
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      <ConfirmPoup
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        title={`Bạn có chắc muốn xoá ${friend?.firstName} ${friend?.lastName}?`}
        icon={<X size={28} className="text-gray-600" />}
        labelConfirm={"Xoá bạn"}
      >
        Cả hai bạn sẽ không là bạn bè với nhau nữa. Hành động này không thể hoàn
        tác.
      </ConfirmPoup>

      {/* HIDDEN MODAL */}
      <ConfirmPoup
        open={openHiddenModal}
        onClose={() => setOpenHiddenModal(false)}
        onConfirm={handleHidden}
        title={
          isHidden
            ? `Bỏ ẩn ${friend?.firstName} ${friend?.lastName}?`
            : `Ẩn ${friend?.firstName} ${friend?.lastName}?`
        }
        icon={
          isHidden ? (
            <Eye size={28} className="text-gray-600" />
          ) : (
            <EyeOff size={28} className="text-gray-500" />
          )
        }
        labelConfirm={isHidden ? "Bỏ ẩn" : "Ẩn"}
      >
        {isHidden
          ? "Bạn sẽ thấy lại Locket của họ và họ cũng sẽ xem được các Locket mới kể từ bây giờ."
          : "Bạn sẽ không còn thấy Locket của họ nữa. Họ sẽ không nhận được các Locket mới mà bạn đăng kể từ khi ẩn.\nHọ sẽ không nhận được thông báo họ bị ẩn và cả hai vẫn xuất hiện trên danh sách bạn bè của người kia."}
      </ConfirmPoup>
      {/* BLOCK MODAL */}
      <ConfirmPoup
        open={openBlockModal}
        onClose={() => setOpenBlockModal(false)}
        onConfirm={handleBlock}
        title={`Chặn ${friend?.firstName} ${friend?.lastName}?`}
        icon={<Ban size={28} className="text-gray-600" />}
        labelConfirm={"Chặn"}
      >
        Họ sẽ không thể xem Locket của bạn, gửi tin nhắn, hoặc yêu cầu làm bạn
        của bạn. Hành động này không thể hoàn tác.
      </ConfirmPoup>
    </>
  );
}

/* ---------------- COMPONENTS TÁCH RIÊNG ---------------- */

function Avatar({ friend }) {
  return (
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
  );
}

function InfoDropdown({ open, sharedHistoryOn, createdAt }) {
  return (
    <div
      className={`absolute z-50 right-0 -top-20 origin-bottom-right bg-base-200 shadow-lg rounded-xl p-3 text-sm w-56 transition-all duration-500 ${
        open
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <p>
        <span className="font-medium">Chia sẻ lịch sử:</span>{" "}
        {sharedHistoryOn
          ? new Date(sharedHistoryOn).toLocaleString("vi-VN")
          : "Không rõ"}
      </p>
      <p>
        <span className="font-medium">Kết bạn lúc:</span>{" "}
        {createdAt ? new Date(createdAt).toLocaleString("vi-VN") : "Không rõ"}
      </p>
    </div>
  );
}

function MenuDropdown({ open, isHidden, onHidden, onDelete, onBlock }) {
  return (
    <div
      className={`absolute -top-38 right-1 origin-bottom-right bg-base-300 shadow-xl rounded-xl w-48 p-2 flex flex-col gap-2 transition-all duration-300 ${
        open ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
      }`}
    >
      <button onClick={onHidden} className="btn w-full justify-between">
        {isHidden ? "Bỏ ẩn bạn bè" : "Ẩn bạn bè"}
        {isHidden ? (
          <Eye className="w-5 h-5" />
        ) : (
          <EyeOff className="w-5 h-5" />
        )}
      </button>

      <button
        onClick={onDelete}
        className="btn w-full justify-between text-red-600"
      >
        Xoá bạn bè <UserRoundX className="w-5 h-5" />
      </button>

      <button
        onClick={onBlock}
        className="btn w-full justify-between text-red-700"
      >
        Chặn bạn bè <Ban className="w-5 h-5" />
      </button>
    </div>
  );
}

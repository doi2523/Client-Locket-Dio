// components/FriendItem.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";

export default function FriendItem({ friend, onDelete }) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div
      key={friend.uid}
      className="flex items-center gap-3 space-y-2 rounded-md cursor-pointer justify-between"
    >
      <div className="flex items-center gap-3">
        {/* Avatar + badge overlay */}
        <div className="relative w-16 h-16">
          <img
            src={friend.profilePic || "./default-avatar.png"}
            alt={`${friend.firstName} ${friend.lastName}`}
            className="w-16 h-16 rounded-full border-[3.5px] p-0.5 border-amber-400 object-cover"
          />

          {/* Ưu tiên hiển thị badge nếu có, nếu không thì celeb */}
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

        {/* Thông tin bạn bè */}
        <div>
          <h2 className="font-medium">
            {friend.firstName} {friend.lastName}
          </h2>
          <p className="text-sm text-gray-500 underline">
            @{friend.username || "Không có username"}
          </p>
        </div>
      </div>

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
                onDelete();
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
            {friend.firstName} {friend.lastName}
          </span>
        </div>
        Việc này sẽ xoá bạn bè khỏi danh sách bạn bè của bạn và không thể hoàn
        tác.
      </Modal>
      {/* Nút xoá bạn */}
      <button
        className="text-red-500 flex flex-row justify-center p-1 px-2.5 rounded-full transition shrink-0"
        onClick={() => setOpenModal(true)}
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}

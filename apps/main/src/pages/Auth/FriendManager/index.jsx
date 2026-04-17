import React from "react";
import { BookUser } from "lucide-react";

const FriendManager = () => {
  return (
    <div className="h-[80vh] flex flex-col bg-base-100 text-base-content">
      <div className="flex flex-col items-center justify-center px-4 text-center gap-3 mt-6">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-base-200">
          <BookUser className="w-6 h-6" />
        </div>

        <p className="font-medium">Chưa có dữ liệu</p>
        <p className="text-sm text-base-content/60">
          Tính năng đang được phát triển
        </p>
      </div>
    </div>
  );
};

export default FriendManager;

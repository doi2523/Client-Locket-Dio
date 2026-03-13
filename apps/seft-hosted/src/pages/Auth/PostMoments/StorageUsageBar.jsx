import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function StorageUsageBar({
  totalUsedMB,
  storageLimitMB,
}) {

  // Tính phần trăm dung lượng đã sử dụng
  const percentageUsed =
    storageLimitMB === -1
      ? 0 // Vô hạn thì không cần progress
      : Math.min((totalUsedMB / storageLimitMB) * 100, 100);
      
  const isOverLimit =
    storageLimitMB !== -1 && totalUsedMB > storageLimitMB;

  if (storageLimitMB === -1) {
    return (
      <div className="text-green-600 text-sm">
        Dung lượng: Không giới hạn
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">
          Đã sử dụng: {totalUsedMB}MB / {storageLimitMB}MB
        </span>
        {isOverLimit && (
          <span className="text-sm text-red-600 flex items-center gap-1">
            <AlertTriangle size={14} /> Vượt giới hạn!
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${
            isOverLimit ? "bg-red-500" : "bg-blue-500"
          }`}
          style={{ width: `${percentageUsed}%` }}
        ></div>
      </div>
      <Link className="text-sm underline" to={"/pricing"}>Xem gói hiện tại</Link>
    </div>
  );
}

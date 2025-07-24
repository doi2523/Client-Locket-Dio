// components/plan/PlanEmptyNotice.jsx
import React from "react";

export default function PlanEmptyNotice() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl p-8 shadow-xl">
      {/* Vòng tròn nền trang trí */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/30 rounded-full translate-y-12 -translate-x-12"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-2xl font-bold text-yellow-800 mb-3">
          Bạn chưa đăng ký gói nào
        </h3>
        <p className="text-yellow-700 text-lg mb-6">
          Hãy chọn một gói bên dưới để bắt đầu trải nghiệm tuyệt vời!
        </p>
        <div className="inline-flex items-center gap-2 bg-yellow-200/50 px-4 py-2 rounded-full text-yellow-800 font-medium">
          <span>👇</span>
          <span>Xem các gói bên dưới</span>
        </div>
      </div>
    </div>
  );
}

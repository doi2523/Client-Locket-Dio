import { Info } from "lucide-react";
import React from "react";

function NoticePricing() {
  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <h4 className="font-semibold text-yellow-800">Lưu ý:</h4>
      </div>
      <p className="text-sm text-yellow-700">
        1. Nhấn <strong>"Tiếp tục thanh toán"</strong> để hoàn tất. Gói sẽ được
        kích hoạt trong vòng <strong>5–10 phút</strong> sau khi thanh toán. Liên
        hệ hỗ trợ qua{" "}
        <a
          className="text-blue-600 underline"
          href="https://zalo.me/0329254203"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zalo
        </a>
        .
      </p>
      <p className="text-sm text-yellow-700">
        2. Mã giảm giá chỉ có hiệu lực cho một lần sử dụng với một đơn hàng được
        tạo.
      </p>
      <p className="text-sm text-yellow-700">
        3. Khi đăng ký gói mới, gói hiện tại của bạn sẽ được cập nhật hoặc thay
        thế.
      </p>
    </div>
  );
}
export default NoticePricing;

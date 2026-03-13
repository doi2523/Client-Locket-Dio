import FeatureMarquee from "@/components/ui/Marquee/FeatureMarquee";
import { Check } from "lucide-react";
import React from "react";

function PlanDetailCard({planData}) {
  return (
    <>
      {/* Plan Information */}
      <div className="bg-base-200 rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-base-content">
            Thông tin gói
          </h2>
          {planData.recommended && (
            <span className="px-4 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 self-start">
              Đề xuất
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 text-sm">
          <div>
            <p className="text-gray-600">Giá</p>
            <p className="text-xl sm:text-2xl font-semibold text-green-600">
              {planData.price === 0
                ? "Miễn phí"
                : `${planData.price.toLocaleString()}đ`}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Thời hạn</p>
            <p className="text-base sm:text-lg font-medium text-blue-600">
              {planData.duration_days} ngày
            </p>
          </div>
          <div>
            <p className="text-gray-600">Dung lượng</p>
            <p className="text-base sm:text-lg font-medium text-indigo-600">
              {planData.storage_limit_mb === -1
                ? "Không giới hạn"
                : `${planData.storage_limit_mb} MB`}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Số lượng ảnh/video</p>
            <p className="text-base sm:text-lg font-medium text-indigo-600">
              {planData.max_uploads === -1
                ? "Không giới hạn"
                : planData.max_uploads}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Features */}
      <div className="bg-base-200 rounded-2xl shadow-lg p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-6">
          Tính năng nổi bật
        </h3>
        <ul className="space-y-3">
          {planData.features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-800">
              <Check className="text-green-500 w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Feature Details */}
      <div className="bg-base-200 rounded-2xl shadow-lg p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-6">
          Chi tiết tính năng
        </h3>
        <FeatureMarquee flags={planData.feature_flags} />
      </div>
    </>
  );
}

export default PlanDetailCard;
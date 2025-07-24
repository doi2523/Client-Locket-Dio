import React from "react";
import { useNavigate } from "react-router-dom";

export default function PlanListSection({
  tab,
  setTab,
  filteredPlans,
  userPlan,
  isLoading = false, // 👈 Thêm prop để kiểm soát loading
}) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return price === 0 ? "Miễn phí" : `${price.toLocaleString()}đ`;
  };

  const skeletons = Array.from({ length: 4 }); // 👈 Số lượng khung giả

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded-full font-semibold text-sm ${
            tab === "all"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Gói dùng thử & theo tháng
        </button>
        <button
          onClick={() => setTab("yearly")}
          className={`px-4 py-2 rounded-full font-semibold text-sm ${
            tab === "yearly"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Gói theo năm
        </button>
      </div>

      {/* Plan Cards hoặc Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isLoading
          ? skeletons.map((_, i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl shadow-lg p-4 sm:p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-3" />
                <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-6" />
                <div className="space-y-3 mb-6 min-h-[180px] sm:min-h-[220px]">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="h-4 bg-gray-200 rounded w-full" />
                  ))}
                </div>
                <div className="h-10 bg-gray-300 rounded w-full" />
              </div>
            ))
          : filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                  userPlan?.plan_id === plan.id
                    ? "outline-4 outline-purple-400 shadow-purple-200"
                    : "hover:transform hover:scale-105"
                } ${
                  plan.active === false
                    ? "opacity-50 pointer-events-none cursor-not-allowed"
                    : ""
                }`}
              >
                {/* Badge */}
                {plan.ui?.badge && (
                  <div
                    className="absolute top-0 right-0 font-semibold text-white text-sm px-3 py-1 rounded-bl-lg"
                    style={{
                      background:
                        plan.ui?.gradient ||
                        "linear-gradient(to bottom, #f9fafb, #e5e7eb)",
                      color: plan.ui?.highlight_color || "#f9fafb",
                    }}
                  >
                    {plan.ui.badge}
                  </div>
                )}

                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-primary">
                      {plan.name}
                    </h2>
                    <div className="text-2xl sm:text-3xl font-bold mb-2 text-secondary">
                      {formatPrice(plan.price)}
                    </div>
                    <p className="text-xs sm:text-sm text-accent">
                      {plan.duration_days > 0
                        ? `Hiệu lực: ${plan.duration_days} ngày`
                        : "Gói cơ bản miễn phí"}
                    </p>
                  </div>

                  {/* Description */}
                  {plan.description && (
                    <p className="text-sm text-gray-600 text-center mb-4">
                      {plan.description}
                    </p>
                  )}

                  {/* Features */}
                  <div className="space-y-2 mb-6 min-h-[180px] sm:min-h-[220px]">
                    {plan.features?.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs sm:text-sm"
                      >
                        <span className="text-green-500 font-bold mt-0.5">
                          ✓
                        </span>
                        <span className="text-gray-800 leading-relaxed">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <button
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                      userPlan?.plan_id === plan.id
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : plan.price === 0
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                    }`}
                    onClick={() => navigate(`/pricing/${plan.id}`)}
                    disabled={userPlan?.plan_id === plan.id}
                  >
                    {userPlan?.plan_id === plan.id
                      ? "✓ Đang sử dụng"
                      : plan.price === 0
                      ? "🚀 Bắt đầu miễn phí"
                      : "💎 Chọn gói này"}
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

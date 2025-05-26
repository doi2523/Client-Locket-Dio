import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { fetchUserPlan, registerFreePlan } from "../../../utils";
import { showInfo } from "../../../components/Toast";
// plans.js
const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    duration_days: 0,
    max_uploads: 20,
    storage_limit: 50,
    features: {
      custome: false,
      background: true,
      decorative: true,
      image_icon: false,
      priority_support: false,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 19000,
    duration_days: 30,
    max_uploads: 20,
    storage_limit: 500,
    features: {
      custome: true,
      background: true,
      decorative: true,
      image_icon: true,
      priority_support: true,
    },
  },
  {
    id: "premium",
    name: "Premium",
    price: 49000,
    duration_days: 30,
    max_uploads: 50,
    storage_limit: 2000,
    features: {
      custome: true,
      background: true,
      decorative: true,
      image_icon: true,
      priority_support: true,
    },
  },
  {
    id: "pro_plus",
    name: "Pro Plus",
    price: 199000,
    duration_days: 365,
    max_uploads: 100,
    storage_limit: 5000,
    features: {
      custome: true,
      background: true,
      decorative: true,
      image_icon: true,
      priority_support: true,
    },
  },
];

const formatPrice = (price) =>
  price === 0 ? "Miễn phí" : `${price.toLocaleString()}đ`;

export default function RegisterMemberPage() {
  const { user, userPlan, setUserPlan, authTokens } = useContext(AuthContext);

  useEffect(() => {
    //   if (authTokens.localId && authTokens.idToken) {
    //     fetchUserPlan(authTokens.localId, authTokens.idToken).then((data) => {
    //       if (data) {
    //         setUserPlan(data);
    //       }
    //     });
    //   }
  }, []);

  const handleSelectPlan = (planId) => {
    if (planId === "free") {
        registerFreePlan(user, authTokens.idToken);
        showInfo("Bạn đã đăng ký gói Free thành công!");
        fetchUserPlan(user.localId, authTokens.idToken)
          .then((data) => {
            if (data) {
              setUserPlan(data);
            }
          })
          .catch((err) => {
            console.error("Lỗi khi lấy gói Free:", err);
          });
        return;
    }
    showInfo("Chức năng nâng cấp gói sẽ sớm có mặt!");
    // TODO: Gọi API nâng cấp
  };

  return (
    <div className="min-h-screen bg-pink-50 py-6 px-4">
      <div className="h-16"></div>
      <h1 className="text-3xl font-bold text-left mb-6">
        Đăng ký thành viên Locket Dio
      </h1>

      {/* 👉 Hiển thị gói hiện tại nếu có */}
      {userPlan && userPlan.plan_info && (
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-100 to-purple-50 p-6 rounded-2xl shadow-xl mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Ảnh đại diện */}
          <div className="flex-shrink-0">
            <img
              src={userPlan.profile_picture}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-300 shadow-lg"
            />
          </div>

          {/* Thông tin gói */}
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-purple-700 flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span>✨ Gói hiện tại</span>
              <span className="bg-purple-200 text-purple-800 text-sm font-semibold px-2 py-1 rounded-full inline-block mt-2 sm:mt-0">
                {userPlan.plan_info.name}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xl">🙍‍♂️</span>
                <span className="font-medium">Tên:</span>
                <span>{userPlan.display_name}</span>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xl">💎</span>
                <span className="font-medium">Gói:</span>
                <span>{userPlan.plan_info.name}</span>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xl">🟢</span>
                <span className="font-medium">Bắt đầu:</span>
                <span>{userPlan.start_date}</span>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xl">🔚</span>
                <span className="font-medium">Kết thúc:</span>
                <span>{userPlan.end_date || "∞"}</span>
              </div>

              <div className="col-span-1 sm:col-span-2 flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xl">🗂️</span>
                <span className="font-medium">Tối đa upload:</span>
                <span>Không giới hạn ảnh/video</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 👉 Danh sách gói để chọn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-xl shadow-md flex flex-col bg-white text-center ${
              userPlan?.plan_id === plan.id ? "ring-4 ring-purple-300" : ""
            }`}
          >
            <h2 className="text-xl font-semibold text-purple-600">
              {plan.name}
            </h2>
            <p className="text-lg font-bold my-2">{formatPrice(plan.price)}</p>
            <p className="text-sm text-gray-500 mb-3">
              {plan.duration_days > 0
                ? `Hiệu lực: ${plan.duration_days} ngày`
                : "Gói cơ bản"}
            </p>
            <ul className="text-sm text-left text-gray-700 space-y-1 flex-1">
              <li>
                📸 Đăng ảnh/video:{" "}
                {plan.id === "free" ? "Không giới hạn" : "Không giới hạn"}
                {/* {plan.id === "free" ? "10 lượt" : "Không giới hạn"} */}
              </li>
              <li>
                🎨 Tuỳ chỉnh cơ bản:{" "}
                {plan.features.background && plan.features.decorative
                  ? "✅ Có"
                  : "❌"}
              </li>
              <li>
                🛠️ Tuỳ chỉnh nâng cao:{" "}
                {plan.features.custome && plan.features.image_icon
                  ? "✅ Có"
                  : "❌"}
              </li>
              <li>
                📞 Hỗ trợ ưu tiên:{" "}
                {plan.features.priority_support ? "✅ Có" : "❌"}
              </li>
            </ul>
            <button
              className={`mt-4 py-2 px-4 rounded-full text-white ${
                userPlan?.plan_id === plan.id
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
              onClick={() => handleSelectPlan(plan.id)}
              disabled={userPlan?.plan_id === plan.id}
            >
              {userPlan?.plan_id === plan.id
                ? "Đang sử dụng"
                : plan.price === 0
                ? "Bắt đầu miễn phí"
                : "Chọn gói này"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

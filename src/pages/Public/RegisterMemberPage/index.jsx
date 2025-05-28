import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { fetchUserPlan, registerFreePlan } from "../../../utils";
import { showInfo } from "../../../components/Toast";
import { useApp } from "../../../context/AppContext";
import { ChevronDown, Info } from "lucide-react";
// plans.js
const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    duration_days: 0,
    max_uploads: 10,
    storage_limit: 50, // MB
    perks: {
      "Đăng tối đa 15 ảnh/video": true,
      "Tuỳ chỉnh nền và trang trí cơ bản": true,
      "Không hỗ trợ tuỳ chỉnh nâng cao": false,
      "Không hỗ trợ ưu tiên": false,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 19000,
    duration_days: 30,
    max_uploads: 20,
    storage_limit: 500, // MB
    perks: {
      "Không giới hạn đăng ảnh/video": true,
      "Huy hiệu thành viên": true,
      "Tuỳ chỉnh nền, trang trí & icon hình ảnh": true,
      "Hỗ trợ tuỳ chỉnh nâng cao": true,
      "Hỗ trợ ưu tiên qua email": true,
      "Truy cập tính năng mới sớm hơn": true,
    },
  },
  {
    id: "premium",
    name: "Premium",
    price: 49000,
    duration_days: 30,
    max_uploads: 50,
    storage_limit: 2000, // MB
    perks: {
      "Không giới hạn đăng ảnh/video": true,
      "Huy hiệu thành viên": true,
      "Tuỳ chỉnh đầy đủ: nền, trang trí, icon & màu sắc": true,
      "Hỗ trợ tuỳ chỉnh nâng cao": true,
      "Hỗ trợ ưu tiên qua email và chat": true,
      "Phát hành tính năng mới hằng tháng": true,
      "Truy cập tính năng mới sớm hơn": true,
    },
  },
  {
    id: "pro_plus",
    name: "Pro Plus",
    price: 199000,
    duration_days: 365,
    max_uploads: 100,
    storage_limit: 5000, // MB
    perks: {
      "Toàn bộ tính năng Pro": true,
      "Không giới hạn đăng ảnh/video": true,
      "Huy hiệu thành viên": true,
      "Toàn quyền tuỳ chỉnh mọi tính năng": true,
      "Hỗ trợ ưu tiên 24/7": true,
      "Quà tặng và ưu đãi đặc biệt": true,
      "Phát hành tính năng mới hằng tháng": true,
    },
  },
];

const formatPrice = (price) =>
  price === 0 ? "Miễn phí" : `${price.toLocaleString()}đ`;

export default function RegisterMemberPage() {
  const { modal } = useApp();
  const {
    isModalRegMemberOpen,
    setIsModalRegMemberOpen,
    modalData,
    setModalData,
  } = modal;
  const [isExpanded, setIsExpanded] = useState(false);
  // Thêm dòng sau trong component
  const [loading, setLoading] = useState(false);
  const { user, userPlan, setUserPlan, authTokens } = useContext(AuthContext);

  // useEffect(() => {
  //   if (authTokens.localId && authTokens.idToken) {
  //     fetchUserPlan(authTokens.localId, authTokens.idToken).then((data) => {
  //       if (data) {
  //         setUserPlan(data);
  //       }
  //     });
  //   }
  // }, []);

  const handleSelectPlan = async (planId) => {
    if (planId === "free") {
      const confirmed = window.confirm(
        "Bạn có chắc muốn đăng ký gói Free?\nCác gói đã đăng ký trước đó sẽ bị hủy nếu có."
      );
      if (!confirmed) return;

      try {
        setLoading(true);
        await registerFreePlan(user, authTokens.idToken);
        showInfo("Bạn đã đăng ký gói Free thành công!");
        const data = await fetchUserPlan(user.localId, authTokens.idToken);
        if (data) setUserPlan(data);
      } catch (err) {
        console.error("❌ Lỗi đăng ký gói Free:", err);
        showInfo("Đăng ký thất bại. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }

      return;
    }

    const plan = plans.find((p) => p.id === planId);
    setModalData(plan);
    setIsModalRegMemberOpen(true);
  };

  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  const handleRefreshPlan = async () => {
    const now = Date.now();
    const debounceDelay = 20 * 1000; // 10 giây

    if (!user || !authTokens?.idToken) return;

    // 👉 Kiểm tra nếu chưa đủ thời gian giữa 2 lần bấm
    if (now - lastRefreshTime < debounceDelay) {
      showInfo("Vui lòng đợi vài giây trước khi cập nhật lại.");
      return;
    }

    setLoading(true);
    setLastRefreshTime(now); // Cập nhật thời điểm bấm nút

    try {
      const data = await fetchUserPlan(user.localId, authTokens.idToken);
      if (data) {
        setUserPlan(data);
        showInfo("Đã cập nhật gói thành công!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật gói:", err);
      showInfo("Đã xảy ra lỗi khi cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 py-6 px-4">
      <div className="h-16"></div>
      <h1 className="text-3xl font-bold text-center text-base-content">
        Đăng ký thành viên Locket Dio
      </h1>
      <div className="text-sm max-w-md mx-auto">
      {/* Nút toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center gap-1 mx-auto text-blue-600 hover:underline select-none"
      >
        <span className="font-medium flex items-center flex-row">
         <Info className="w-4 mr-1"/> {isExpanded ? "Thu gọn" : "Giới thiệu về gói thành viên"}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-500 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Nội dung trượt */}
      <div
        className={`overflow-hidden transition-all duration-500 mb-4 z-10 relative ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-base-100 border-2 border-dashed rounded-lg p-4 text-justify shadow mt-3">
          <p>
            Gói thành viên <strong>Locket Dio</strong> đem đến trải nghiệm đầy đủ:
            đăng ảnh, video, tùy chỉnh theme, cùng nhiều tiện ích độc quyền.
          </p>
          <p className="mt-2">
            Giá gói được xây dựng tương xứng với tính năng. 100% doanh thu
            được tái đầu tư cho hạ tầng máy chủ, bảo trì và phát triển tính
            năng mới nhằm phục vụ cộng đồng tốt hơn.
          </p>
          <p className="mt-2 italic text-gray-500">
            Cảm ơn bạn đã đồng hành và ủng hộ Locket Dio! 💖
          </p>
        </div>
      </div>
    </div>
      {/* 👉 Hiển thị gói hiện tại nếu có */}
      {userPlan && userPlan.plan_info ? (
        <>
          <div className=" max-w-2xl mx-auto bg-white border border-purple-200 p-6 rounded-3xl shadow-lg mb-4 flex flex-col sm:flex-row items-center sm:items-start gap-6 transition hover:shadow-xl">
            {/* Ảnh đại diện */}
            <div className="flex-shrink-0">
              <img
                src={userPlan.profile_picture || "./prvlocket.png"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-300 shadow-md"
              />
            </div>

            {/* Thông tin gói */}
            <div className="flex-1 space-y-4 text-center sm:text-left">
              {/* Header: Gói + Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-2xl font-bold text-purple-700">
                  ✨ Gói hiện tại
                </h2>
                <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                  {userPlan.plan_info.name}
                </span>
              </div>

              {/* Grid Thông tin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🙍‍♂️</span>
                  <span className="font-medium text-gray-600">Tên:</span>
                  <span className="text-gray-800">{userPlan.display_name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl">💎</span>
                  <span className="font-medium text-gray-600">Gói:</span>
                  <span className="text-gray-800">
                    {userPlan.plan_info.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl">🟢</span>
                  <span className="font-medium text-gray-600">Bắt đầu:</span>
                  <span className="text-gray-800">{userPlan.start_date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl">🔚</span>
                  <span className="font-medium text-gray-600">Kết thúc:</span>
                  <span className="text-gray-800">
                    {userPlan.end_date || "∞"}
                  </span>
                </div>

                <div className="sm:col-span-2 flex items-center gap-2">
                  <span className="text-xl">🗂️</span>
                  <span className="font-medium text-gray-600">
                    Tối đa upload:
                  </span>
                  <span className="text-gray-800">
                    Không giới hạn ảnh/video
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={handleRefreshPlan}
              className={`px-4 py-2 rounded-full text-white transition ${
                loading
                  ? "bg-gray-400 cursor-wait"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "🔄 Cập nhật lại gói"}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* ❌ Không có gói: Thông báo */}
          <div className="max-w-2xl mx-auto text-center bg-yellow-50 border border-yellow-300 text-yellow-700 p-6 rounded-xl shadow-sm mb-4">
            <p className="text-lg font-medium">Bạn chưa đăng ký gói nào.</p>
            <p className="text-sm text-yellow-600 mt-1">
              Hãy chọn một gói bên dưới để bắt đầu trải nghiệm!
            </p>
          </div>
        </>
      )}

      {/* 👉 Danh sách gói để chọn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-6">
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
                : "Gói cơ bản miễn phí"}
            </p>
            <ul className="text-sm text-left text-gray-700 space-y-2 flex-1">
              {Object.entries(plan.perks)
                .filter(([perkName, hasAccess]) => hasAccess) // chỉ lấy perks được phép
                .map(([perkName], index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-purple-500 font-bold">✔️</span>
                    <span>{perkName}</span>
                  </li>
                ))}
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

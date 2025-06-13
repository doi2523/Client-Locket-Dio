import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { showInfo, showSuccess } from "../../../components/Toast";
import { useApp } from "../../../context/AppContext";
import { ChevronDown, Info, RefreshCw } from "lucide-react";
import LoadingRing from "../../../components/UI/Loading/ring";
import { fetchUserPlan, getUserUploadStats, registerFreePlan } from "../../../services";
import PlanBadge from "../../../components/UI/PlanBadge/PlanBadge";

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
      "🖼️ Đăng tối đa 15 ảnh/video": true,
      "🎨 Tuỳ chỉnh nền và trang trí cơ bản": true,
      "📷 Đăng ảnh/video với chất lượng thấp": true,
      "🚫 Không hỗ trợ ưu tiên": false,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 29000,
    duration_days: 60,
    max_uploads: "∞",
    storage_limit: 500, // MB
    perks: {
      "📸 Không giới hạn đăng ảnh/video": true,
      "🔰 Huy hiệu thành viên": true,
      "🎨 Tuỳ chỉnh nền, trang trí & icon hình ảnh": true,
      "🛠️ Hỗ trợ tuỳ chỉnh nâng cao": true,
      "📷 Đăng ảnh/video chất lượng cao": true,
      "📩 Hỗ trợ ưu tiên qua email": true,
      "🚀 Truy cập tính năng mới sớm hơn": true,
    },
  },
  {
    id: "premium",
    name: "Premium",
    price: 49000,
    duration_days: 90,
    max_uploads: "∞",
    storage_limit: 2000, // MB
    perks: {
      "📸 Không giới hạn đăng ảnh/video": true,
      "🔰 Huy hiệu thành viên": true,
      "🎨 Tuỳ chỉnh đầy đủ: nền, trang trí, icon & màu sắc": true,
      "🛠️ Hỗ trợ tuỳ chỉnh nâng cao": true,
      "📷 Đăng ảnh/video chất lượng cao": true,
      "💬 Hỗ trợ ưu tiên qua email và chat": true,
      "🆕 Phát hành tính năng mới hằng tháng": true,
      "🚀 Truy cập tính năng mới sớm hơn": true,
    },
  },
  {
    id: "pro_plus",
    name: "Pro Plus",
    price: 199000,
    duration_days: 365,
    max_uploads: "∞",
    storage_limit: 5000, // MB
    perks: {
      "🌟 Toàn bộ tính năng Pro": true,
      "📸 Không giới hạn đăng ảnh/video": true,
      "🔰 Huy hiệu thành viên": true,
      "📷 Đăng ảnh/video chất lượng cao": true,
      "🎯 Toàn quyền tuỳ chỉnh mọi tính năng": true,
      "📞 Hỗ trợ ưu tiên 24/7": true,
      "🎁 Quà tặng và ưu đãi đặc biệt": true,
      "🆕 Phát hành tính năng mới hằng tháng": true,
    },
  },
];

const formatPrice = (price) =>
  price === 0 ? "Miễn phí" : `${price.toLocaleString()}đ`;

// Optimized UserPlanCard Component with memoization
const UserPlanCard = React.memo(
  ({ userPlan, uploadStats, onRefresh, loading }) => {
    const { post } = useApp();
    const { maxImageSizeMB, maxVideoSizeMB } = post;
    const [timeLeft, setTimeLeft] = useState("");

    // Memoize the time calculation function
    const calculateTimeLeft = useCallback(() => {
      if (!userPlan.end_date) return;

      const endDate = new Date(userPlan.end_date);
      const now = new Date();
      const difference = endDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (days > 0) {
          setTimeLeft(`${days} ngày ${hours} giờ`);
        } else if (hours > 0) {
          setTimeLeft(`${hours} giờ ${minutes} phút`);
        } else {
          setTimeLeft(`${minutes} phút`);
        }
      } else {
        setTimeLeft("Đã hết hạn");
      }
    }, [userPlan.end_date]);

    useEffect(() => {
      if (!userPlan.end_date) return;

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

      return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    // Helper function to format date to dd/mm/yy
    const formatDate = (dateString) => {
      if (!dateString || dateString === "∞") return dateString;

      try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
      } catch (error) {
        return dateString; // Return original if parsing fails
      }
    };
    // Memoize the rendered JSX to prevent unnecessary re-renders
    return useMemo(
      () => (
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-white via-purple-50 to-purple-100 border border-purple-200 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl mb-8">
          {/* Header với Avatar và Badge */}
          <div className="relative bg-gradient-to-r p-4 lg:p-4 text-base-content mx-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="relative">
                  <img
                    src={userPlan.profile_picture || "./prvlocket.png"}
                    alt="Avatar"
                    className="w-16 h-16 lg:w-16 lg:h-16 rounded-full object-cover p-[2px] outline-3 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div>
                  <h1 className="font-semibold text-2xl text-base-content">
                    {userPlan.display_name}
                  </h1>
                  <p className="text-base-content text-xs lg:text-sm font-semibold">
                    ✨ Gói hiện tại
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PlanBadge />
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className={`p-2 rounded-full transition-all text-base-content duration-200 ${
                    loading
                      ? "bg-primary/30 cursor-wait"
                      : "bg-primary/30 hover:bg-primary/70 backdrop-blur-sm border border-white/30"
                  }`}
                  title="Cập nhật gói"
                >
                  <RefreshCw
                    className={`w-4 h-4 text-base-content ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Nội dung chính */}
          <div className="p-4 lg:p-6 space-y-4">
            {/* Thông tin thời gian */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500 text-base lg:text-lg">
                    🟢
                  </span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Bắt đầu
                  </span>
                </div>
                <p className="font-bold text-gray-800 text-sm lg:text-base">
                  {formatDate(userPlan.start_date)}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-500 text-base lg:text-lg">🔚</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Kết thúc
                  </span>
                </div>
                <p className="font-bold text-gray-800 text-sm lg:text-base">
                  {formatDate(userPlan.end_date) || "∞"}
                </p>
              </div>
            </div>

            {/* Thống kê upload và giới hạn */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Thống kê upload */}
              <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-purple-100">
                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-base lg:text-lg">📊</span>
                  <span className="text-sm lg:text-base">
                    Thống kê tải lên
                  </span>{" "}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="bg-blue-50 rounded-xl p-2 lg:p-3 mb-2">
                      <span className="text-blue-500 text-xl lg:text-2xl">
                        🖼️
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Ảnh đã tải</p>
                    <p className="font-bold text-blue-600 text-sm lg:text-base">
                      {uploadStats?.imageUploaded || 0}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-red-50 rounded-xl p-2 lg:p-3 mb-2">
                      <span className="text-red-500 text-xl lg:text-2xl">
                        🎥
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Video đã tải</p>
                    <p className="font-bold text-red-600 text-sm lg:text-base">
                      {uploadStats?.videoUploaded || 0}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-green-50 rounded-xl p-2 lg:p-3 mb-2">
                      <span className="text-green-500 text-xl lg:text-2xl">
                        💾
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Dung lượng</p>
                    <p className="font-bold text-green-600 text-sm lg:text-base">
                      {uploadStats?.totalStorageUsedMB || 0} MB
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-yellow-50 rounded-xl p-2 lg:p-3 mb-2">
                      <span className="text-yellow-500 text-xl lg:text-2xl">
                        ⚠️
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Bị lỗi</p>
                    <p className="font-bold text-yellow-600 text-sm lg:text-base">
                      {uploadStats?.errorCount || 0}
                    </p>
                  </div>
                </div>
                {/* <span className="text-xs text-gray-500">{uploadStats?.updatedAt}</span> */}
              </div>

              {/* Thông tin giới hạn */}
              <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-purple-100">
                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-base lg:text-lg">📁</span>
                  <span className="text-sm lg:text-base">Giới hạn tải lên</span>
                </h4>
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base lg:text-lg">🖼️</span>
                      <span className="text-xs lg:text-sm font-medium text-gray-600">
                        Ảnh tối đa
                      </span>
                    </div>
                    <span className="text-xs lg:text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                      {maxImageSizeMB
                        ? `${maxImageSizeMB} MB`
                        : "Không giới hạn"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base lg:text-lg">🎥</span>
                      <span className="text-xs lg:text-sm font-medium text-gray-600">
                        Video tối đa
                      </span>
                    </div>
                    <span className="text-xs lg:text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                      {maxVideoSizeMB
                        ? `${maxVideoSizeMB} MB`
                        : "Không giới hạn"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status bar với countdown */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 lg:p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium text-xs lg:text-sm">
                    Đang hoạt động
                  </span>
                </div>
                <span className="text-green-600 text-xs lg:text-sm font-medium">
                  {userPlan.end_date
                    ? timeLeft === "Đã hết hạn"
                      ? timeLeft
                      : `Còn ${timeLeft}`
                    : "Vĩnh viễn"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      [userPlan, maxImageSizeMB, maxVideoSizeMB, timeLeft, onRefresh, loading]
    );
  }
);

UserPlanCard.displayName = "UserPlanCard";

export default function RegisterMemberPage() {
  const { modal } = useApp();
  const {
    isModalRegMemberOpen,
    setIsModalRegMemberOpen,
    modalData,
    setModalData,
  } = modal;
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, userPlan, setUserPlan, authTokens, uploadStats, setUploadStats } =
    useContext(AuthContext);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  // Memoize the select plan handler
  const handleSelectPlan = useCallback(
    async (planId) => {
      if (!user || !authTokens?.idToken) {
        showInfo("Vui lòng đăng nhập trước khi đăng ký gói.");
        return;
      }

      if (planId === "free") {
        const confirmed = window.confirm(
          "Bạn có chắc muốn đăng ký gói Free?\nCác gói đã đăng ký trước đó sẽ bị hủy nếu có."
        );
        if (!confirmed) return;

        try {
          setLoading(true);
          await registerFreePlan(user, authTokens?.idToken);
          const data = await fetchUserPlan();
          if (data) setUserPlan(data);
          showInfo("Bạn đã đăng ký gói Free thành công!");
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
    },
    [user, authTokens, setUserPlan, setModalData, setIsModalRegMemberOpen]
  );

  // Memoize the refresh handler with debouncing
  const handleRefreshPlan = useCallback(async () => {
    const now = Date.now();
    const debounceDelay = 20 * 1000; // 20 giây

    if (!user || !authTokens?.idToken) return;

    if (now - lastRefreshTime < debounceDelay) {
      showInfo("Vui lòng đợi vài giây trước khi cập nhật lại.");
      return;
    }

    setLoading(true);
    setLastRefreshTime(now);
    try {
      const [userPlanData, uploadStatsData] = await Promise.all([
        fetchUserPlan(),
        getUserUploadStats(authTokens?.localId)
      ]);
    
      if (userPlanData) {
        setUserPlan(userPlanData);
        showSuccess("Làm mới thông tin thành công!");
      }
    
      setUploadStats(uploadStatsData);
      
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật gói hoặc thống kê:", err);
      showInfo("⚠️ Đã xảy ra lỗi khi cập nhật thông tin người dùng.");
    } finally {
      setLoading(false);
    }    
  }, [user, authTokens, lastRefreshTime, setUserPlan]);

  // Check if user has a valid plan (prevent duplicate rendering)
  const hasValidPlan = useMemo(() => {
    return (
      userPlan &&
      userPlan.plan_info &&
      Object.keys(userPlan.plan_info).length > 0
    );
  }, [userPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Đăng ký thành viên Locket Dio
          </h1>

          {/* Introduction Section */}
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-2 mx-auto text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4 text-sm sm:text-base"
            >
              <Info className="w-4 h-4" />
              <span className="font-medium">
                {isExpanded ? "Thu gọn" : "Giới thiệu về gói thành viên"}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl p-4 sm:p-6 text-left shadow-lg">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Gói thành viên{" "}
                  <strong className="text-purple-600">Locket Dio</strong> đem
                  đến trải nghiệm đầy đủ: đăng ảnh, video, tùy chỉnh theme, cùng
                  nhiều tiện ích độc quyền.
                </p>
                <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                  Giá gói được xây dựng tương xứng với tính năng. 100% doanh thu
                  được tái đầu tư cho hạ tầng máy chủ, bảo trì và phát triển
                  tính năng mới nhằm phục vụ cộng đồng tốt hơn.
                </p>
                <p className="mt-3 text-sm text-purple-600 font-medium">
                  Cảm ơn bạn đã đồng hành và ủng hộ Locket Dio! 💖
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Current Plan Display - Only render once */}
          {hasValidPlan ? (
            <UserPlanCard
              userPlan={userPlan}
              uploadStats={uploadStats}
              onRefresh={handleRefreshPlan}
              loading={loading}
            />
          ) : (
            <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-lg font-semibold text-yellow-800 mb-2">
                Bạn chưa đăng ký gói nào
              </p>
              <p className="text-sm text-yellow-700">
                Hãy chọn một gói bên dưới để bắt đầu trải nghiệm!
              </p>
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                  userPlan?.plan_id === plan.id
                    ? "ring-4 ring-purple-400 shadow-purple-200"
                    : "hover:transform hover:scale-105"
                }`}
              >
                {/* Popular Badge for Pro */}
                {plan.id === "pro" && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Phổ biến
                  </div>
                )}

                {/* Best Value Badge for Premium */}
                {plan.id === "premium" && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Đáng giá nhất
                  </div>
                )}

                <div className="p-4 sm:p-6">
                  {/* Plan Header */}
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                      {plan.name}
                    </h2>
                    <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                      {formatPrice(plan.price)}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {plan.duration_days > 0
                        ? `Hiệu lực: ${plan.duration_days} ngày`
                        : "Gói cơ bản miễn phí"}
                    </p>
                  </div>

                  {/* Plan Features */}
                  <div className="space-y-2 mb-6 min-h-[200px] sm:min-h-[240px]">
                    {Object.entries(plan.perks)
                      .filter(([, hasAccess]) => hasAccess)
                      .map(([perkName], index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-xs sm:text-sm"
                        >
                          <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">
                            ✓
                          </span>
                          <span className="text-gray-700 leading-relaxed">
                            {perkName}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                      userPlan?.plan_id === plan.id
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : plan.price === 0
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                    }`}
                    onClick={() => handleSelectPlan(plan.id)}
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
      </div>
    </div>
  );
}

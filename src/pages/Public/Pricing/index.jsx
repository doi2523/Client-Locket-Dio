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
import {
  fetchUserPlan,
  getStats,
  getUserUploadStats,
  registerFreePlan,
} from "../../../services";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils";
import { UserPlanCard } from "./UserPlanCard";
import PlanListSection from "./PlanListSection";

export default function PricingPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const {
    user,
    userPlan,
    setUserPlan,
    authTokens,
    uploadStats,
    setUploadStats,
  } = useContext(AuthContext);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  // Memoize the refresh handler with debouncing
  const handleRefreshPlan = useCallback(async () => {
    const now = Date.now();

    setLoading(true);
    setLastRefreshTime(now);
    try {
      const [userPlanData, uploadStatsData] = await Promise.all([
        fetchUserPlan(),
        getStats(),
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

  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  useEffect(() => {
    fetch(API_URL.GET_DIO_PLANS)
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
        filterPlans(data, tab);
      });
  }, []);

  useEffect(() => {
    filterPlans(plans, tab);
  }, [tab]);

  const filterPlans = (allPlans, type) => {
    if (type === "yearly") {
      setFilteredPlans(allPlans.filter((p) => p.billing_cycle === "yearly"));
    } else {
      setFilteredPlans(
        allPlans.filter((p) => p.billing_cycle !== "yearly" || p.id === "trial")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
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
          <PlanListSection
            tab={tab}
            setTab={setTab}
            filteredPlans={filteredPlans}
            userPlan={userPlan}
          />
        </div>
      </div>
    </div>
  );
}

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { GetListInfoPlans } from "@/services";
import { UserPlanCard } from "./UserPlanCard";
import PlanListSection from "./PlanListSection";
import MemberPlanIntro from "./MemberPlanIntro";
import PlanEmptyNotice from "./PlanEmptyNotice";
import { useAuthStore } from "@/stores";
import { SonnerInfo, SonnerSuccess } from "@/components/ui/SonnerToast";

export default function PricingPage() {
  const { loading, user, userPlan, uploadStats, fetchUserData } = useAuthStore();
  const [loadingplans, setLoadingPlans] = useState(false);
  const [tab, setTab] = useState("all");
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  // Memoize the refresh handler with debouncing
  const handleRefreshPlan = useCallback(async () => {
    const now = Date.now();

    setLastRefreshTime(now);
    try {
      fetchUserData();
      SonnerSuccess("Làm mới thông tin thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật gói hoặc thống kê:", err);
      SonnerInfo("⚠️ Đã xảy ra lỗi khi cập nhật thông tin người dùng.");
    }
  }, [user, lastRefreshTime]);

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
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const data = await GetListInfoPlans();
        setPlans(data);
        filterPlans(data, tab);
        setLoadingPlans(false);
      } catch (err) {
        console.error("❌ Không thể lấy danh sách gói:", err);
      }
    };

    fetchPlans();
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
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Đăng ký thành viên Locket Dio
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Trải nghiệm đầy đủ với nhiều tính năng độc quyền
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="w-full mx-auto space-y-12">
          {/* 2-column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: User Plan */}
            <div className="order-1 lg:order-1">
              {hasValidPlan ? (
                <UserPlanCard
                  userPlan={userPlan}
                  uploadStats={uploadStats}
                  onRefresh={handleRefreshPlan}
                  loading={loading}
                />
              ) : (
                <PlanEmptyNotice />
              )}
            </div>

            {/* Right: Membership Info */}
            <div className="order-2 lg:order-2">
              <MemberPlanIntro />
            </div>
          </div>

          {/* Plans Grid Section */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>

            <PlanListSection
              tab={tab}
              setTab={setTab}
              filteredPlans={filteredPlans}
              userPlan={userPlan}
              isLoading={loadingplans}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

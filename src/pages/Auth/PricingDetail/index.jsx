import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LoadingPageMain from "@/components/pages/LoadPageMain";
import * as services from "@/services";
import NoticePricing from "./NoticePricing";
import PlanDetailCard from "./PlanDetail";
import { SonnerWarning } from "@/components/ui/SonnerToast";
import { useAuthStore } from "@/stores";

export default function PlanDetailPage() {
  const { user } = useAuthStore();
  const { planId } = useParams();
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponStatus, setCouponStatus] = useState(null);

  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const result = await services.GetInfoPlanWithId(planId);;
        setPlanData(result);
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanData();
  }, [planId]);

  const handleBack = () => navigate(-1);

  const handleCreateOrder = async () => {
    try {
      if (coupon) {
        const data = await services.CheckCoupon(coupon, planData.id);
        if (!data.valid) {
          SonnerWarning("Thông báo từ Locket Dio", data.message);
          setCoupon("");
          setDiscountAmount("");
          setCouponStatus(null);
          return; // dừng tạo order
        }
        setDiscountAmount(data.discount_amount || 0);
        setCouponStatus(`✅ ${data.message}`);
      }

      setLoadingCreate(true);
      const response = await services.CreateNewOrder(
        planData.id,
        planData.price,
        coupon
      );

      if (!response?.orderId) {
        throw new Error("Tạo đơn hàng thất bại");
      }

      navigate(`/pay?orderId=${response.orderId}`);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert(error.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon) {
      setCouponStatus("❌ Vui lòng nhập mã giảm giá.");
      return;
    }

    try {
      const data = await services.CheckCoupon(coupon, planData.id);

      if (data.valid) {
        setDiscountAmount(data.discount_amount || 0);
        setCouponStatus(`✅ ${data.message}`);
      } else {
        setCoupon("");
        setDiscountAmount(0);
        setCouponStatus(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Coupon error:", error);
      setDiscountAmount(0);
      setCouponStatus("❌ Không thể kiểm tra mã giảm giá. Vui lòng thử lại.");
    }
  };

  if (loading) return <LoadingPageMain isLoading={true} />;
  if (!planData)
    return (
      <div className="min-h-screen flex justify-center items-center text-center text-lg text-red-600">
        Không tìm thấy gói
      </div>
    );
  const finalPrice = Math.max(planData.price - discountAmount, 0);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header Section */}
      <div
        className="w-full py-6"
        style={{
          background:
            planData.ui?.gradient ||
            "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
          color: planData.ui?.highlight_color || "#FFFFFF",
        }}
      >
        <div className=" mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-white/20 transition-all duration-200"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                {planData.name}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg mt-2 opacity-90">
                {planData.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Plan Details */}
          <div className="space-y-6">
            <PlanDetailCard planData={planData} />
          </div>

          {/* Right Column - Payment Information */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="bg-base-200 rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-6">
                Thông tin thanh toán
              </h3>

              {/* Payment Details */}
              <div className="space-y-4 mb-6">
                {/* Gói đã chọn */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-base-300 rounded-lg p-4 gap-2">
                  <p className="text-base-content/70 font-semibold">
                    Gói đã chọn:
                  </p>
                  <p className="font-semibold text-base-content">
                    {planData.name}
                  </p>
                </div>

                {/* Số tiền */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-base-300 rounded-lg p-4 gap-2">
                  <p className="text-base-content/70 font-semibold">Số tiền:</p>
                  <p className="font-semibold text-green-600 text-lg">
                    {planData.price.toLocaleString()}đ
                  </p>
                </div>

                <hr className="border-base-300" />

                {/* Tóm tắt thanh toán */}
                <div className="bg-base-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-base-content/70 font-medium">
                      Tạm tính
                    </p>
                    <p className="font-medium text-base-content">
                      {planData.price.toLocaleString()}đ
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-base-content/70 font-medium">
                      Giảm giá
                    </p>
                    <p className="text-red-500 font-medium">
                      - {discountAmount.toLocaleString()}đ
                    </p>
                  </div>

                  <hr className="border-base-300" />

                  <div className="flex justify-between">
                    <p className="font-semibold">Tổng thanh toán</p>
                    <p className="font-bold text-green-600 text-lg">
                      {(planData.price - discountAmount).toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <label
                  className="block text-base-content font-medium mb-2"
                  htmlFor="coupon"
                >
                  Mã giảm giá
                </label>
                <div className="flex flex-row gap-2">
                  <input
                    id="coupon"
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="input input-bordered flex-1 px-4 py-2.5 rounded-xl text-base focus:ring-2 focus:ring-indigo-500"
                    placeholder="Nhập mã giảm giá..."
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="btn btn-secondary rounded-xl hover:bg-indigo-600 transition-colors whitespace-nowrap"
                  >
                    Áp dụng
                  </button>
                </div>
                {couponStatus && (
                  <p
                    className={`mt-2 text-sm ${
                      couponStatus.includes("hợp lệ")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {couponStatus}
                  </p>
                )}
              </div>

              {/* Notice */}
              <NoticePricing />

              {!user && (
                <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    Bạn chưa đăng nhập. Hãy đăng nhập để áp dụng mã giảm giá và
                    mua gói.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => {
                    if (!user) return navigate("/login");
                    handleCreateOrder();
                  }}
                  disabled={loadingCreate}
                  className="w-full btn btn-primary text-white text-base sm:text-lg font-semibold rounded-3xl py-5 hover:bg-indigo-600 transition-colors disabled:opacity-50"
                >
                  {loadingCreate
                    ? "Đang xử lý..."
                    : finalPrice === 0
                    ? "🎉 Xác nhận & Đăng ký gói"
                    : `💳 Tiếp tục thanh toán ${finalPrice.toLocaleString()}đ`}
                </button>

                <button
                  onClick={handleBack}
                  className="w-full btn btn-outline rounded-xl hover:bg-gray-100 transition-colors"
                >
                  ← Quay lại danh sách
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

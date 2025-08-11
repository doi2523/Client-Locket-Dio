import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, X, Info } from "lucide-react";
import { AuthContext } from "../../../context/AuthLocket";
import LoadingPage from "../../../components/pages/LoadingPage";
import { API_URL } from "../../../utils";
import * as services from "../../../services";
import FeatureMarquee from "../../../components/ui/Marquee/FeatureMarquee";

const FEATURE_TOOLTIPS = {
  image_upload: "Cho phép tải lên hình ảnh cho bài viết",
  video_upload: "Cho phép tải lên video cho bài viết",
  custom_caption: "Tùy chỉnh văn bản caption theo ý muốn",
  unlimited_posts: "Không giới hạn số lượng bài viết",
  priority_support: "Nhận hỗ trợ nhanh chóng từ đội ngũ CSKH",
  remove_watermark: "Xóa logo hoặc watermark trên nội dung",
  image_gif: "Thêm hiệu ứng GIF vào caption",
  image_icon: "Thêm biểu tượng tùy chỉnh vào caption",
};

export default function PlanDetailPage() {
  const { user, userPlan } = useContext(AuthContext);
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
        const response = await fetch(`${API_URL.GET_DIO_PLANS}/${planId}`);
        const data = await response.json();
        setPlanData(data);
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
      setLoadingCreate(true);
      const response = await services.CreateNewOrder(
        planData.id,
        planData.price,
        coupon
      );
      const data = response;

      if (data?.ExistingOrder) {
        const confirm = window.confirm(
          "Bạn đã có đơn hàng đang chờ thanh toán.\nBấm OK để tiếp tục thanh toán hoặc Cancel để hủy."
        );

        if (!confirm) {
          try {
            await services.CancelToOrder(data.orderId, data.orderCode);
            alert("✅ Đơn hàng đã được hủy.");
          } catch (error) {
            console.error("❌ Lỗi khi hủy đơn hàng:", error);
            alert("❌ Không thể hủy đơn hàng. Vui lòng thử lại.");
          }
          return;
        }
      }

      if (!data?.orderId) {
        throw new Error("Tạo đơn hàng thất bại");
      }

      navigate(`/pay?orderId=${data.orderId}`);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
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
      if (data?.discount_amount > 0) {
        setDiscountAmount(data.discount_amount);
        setCouponStatus("✅ Mã giảm giá hợp lệ!");
      } else {
        setDiscountAmount(0);
        setCouponStatus("❌ Mã giảm giá không hợp lệ.");
      }
    } catch (error) {
      console.error("Coupon error:", error);
      setDiscountAmount(0);
      setCouponStatus("❌ Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    }
  };

  if (loading) return <LoadingPage isLoading={true} />;
  if (!planData)
    return (
      <div className="min-h-screen flex justify-center items-center text-center text-lg text-red-600">
        Không tìm thấy gói
      </div>
    );

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
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-800"
                  >
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
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <h4 className="font-semibold text-yellow-800">Lưu ý:</h4>
                </div>
                <p className="text-sm text-yellow-700">
                  1. Nhấn <strong>"Tiếp tục thanh toán"</strong> để hoàn tất.
                  Gói sẽ được kích hoạt trong vòng <strong>5–10 phút</strong>{" "}
                  sau khi thanh toán. Liên hệ hỗ trợ qua{" "}
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
                  2. Mã giảm giá chỉ có hiệu lực cho một lần sử dụng.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleCreateOrder}
                  disabled={loadingCreate}
                  className="w-full btn btn-primary text-white text-base sm:text-lg font-semibold rounded-3xl py-5 hover:bg-indigo-600 transition-colors disabled:opacity-50"
                >
                  {loadingCreate
                    ? "Đang xử lý..."
                    : `💳 Tiếp tục thanh toán ${(
                        planData.price - discountAmount
                      ).toLocaleString()}đ`}
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

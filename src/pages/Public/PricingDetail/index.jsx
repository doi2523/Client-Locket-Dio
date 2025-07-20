import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Copy, ArrowLeft, Check, X } from "lucide-react";
import { AuthContext } from "../../../context/AuthLocket";
import LoadingPage from "../../../components/pages/LoadingPage";
import { API_URL } from "../../../utils";
import api from "../../../lib/axios";
import axios from "axios";

const FEATURE_LABELS = {
  image_upload: "Cho phép đăng ảnh",
  video_upload: "Cho phép đăng video",
  custom_caption: "Tùy chỉnh caption",
  unlimited_posts: "Không giới hạn bài viết",
  priority_support: "Hỗ trợ ưu tiên",
  remove_watermark: "Xoá watermark",
  image_gif: "Caption Gif",
  image_icon: "Caption Icon",
};
// Giữ nguyên phần import và khai báo constants như ban đầu...

const renderFeatureFlags = (flags) => {
  const maxUploads = flags.max_uploads;

  return (
    <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box mb-4">
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-sm sm:text-base font-semibold text-base-content">
        Chi tiết tính năng của gói
      </div>
      <div className="collapse-content">
        <div className="grid sm:grid-cols-2 gap-4">
          {typeof maxUploads === "object" && (
            <>
              <div className="flex items-center gap-3 p-3 rounded-xl border bg-blue-50 border-blue-200">
                <span className="text-blue-600 font-semibold">
                  🖼️ {maxUploads.image}MB
                </span>
                <span className="text-blue-800 text-sm">
                  Dung lượng ảnh / bài
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border bg-blue-50 border-blue-200">
                <span className="text-blue-600 font-semibold">
                  📹 {maxUploads.video}MB
                </span>
                <span className="text-blue-800 text-sm">
                  Dung lượng video / bài
                </span>
              </div>
            </>
          )}

          {Object.entries(flags).map(([key, value]) => {
            if (key === "max_uploads") return null;

            const isActive = !!value;
            return (
              <div
                key={key}
                className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                  isActive
                    ? "bg-green-50 border-green-200"
                    : "bg-base-300 border-gray-200"
                }`}
              >
                {isActive ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-gray-400" />
                )}
                <span
                  className={`text-sm ${
                    isActive
                      ? "text-green-800 font-medium"
                      : "text-gray-400 line-through"
                  }`}
                >
                  {FEATURE_LABELS[key] || key}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function PlanDetailPage() {
  const { user, userPlan } = useContext(AuthContext);
  const { planId } = useParams();
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState("");
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const [loadingcreate, setLoadingCreate] = useState(false);
  const [showExistingOrderModal, setShowExistingOrderModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);

  const handleCreateOrder = async () => {
    try {
      setLoadingCreate(true);

      // Gửi API tạo đơn hàng (axios-style)
      const response = await api.post("/api/orders", {
        planId: planData.id,
        price: planData.price,
      });

      const data = response.data;

      if (data?.ExistingOrder) {
        const confirm = window.confirm(
          "Bạn đã có đơn hàng đang chờ thanh toán.\nBấm OK để tiếp tục thanh toán hoặc Cancel để huỷ."
        );

        if (!confirm) {
          // Gọi API huỷ đơn hàng
          try {
            await api.post("/api/orders/cancel", {
              ExistingOrder: data.ExistingOrder,
              orderCode: data.orderCode, // nếu cần cho PayOS
              orderId: data.orderId,
            });

            alert("✅ Đơn hàng đã được huỷ.");
          } catch (error) {
            console.error("❌ Lỗi khi huỷ đơn hàng:", error);
            alert("❌ Không thể huỷ đơn hàng. Vui lòng thử lại.");
          }

          return; // Dừng flow tiếp theo
        }
      }

      // Kiểm tra nếu response có lỗi
      if (!data?.orderId) {
        throw new Error("Tạo đơn hàng thất bại");
      }

      // Điều hướng sang trang thanh toán
      navigate(`/pay?orderId=${data.orderId}`);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoadingCreate(false);
    }
  };

  if (loading) return <LoadingPage isLoading={true} />;
  if (!planData)
    return (
      <div className="min-h-screen flex justify-center items-center text-center text-lg text-error">
        Không tìm thấy gói
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header Gradient */}
      <div
        className="h-16"
        style={{ background: planData.ui?.gradient || "#6366F1" }}
      ></div>

      {/* Header Content */}
      <div
        className="w-full py-6 text-white"
        style={{ background: planData.ui?.gradient || "#6366F1" }}
      >
        <div className="mx-auto px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-white/20 transition-all duration-200 cursor-pointer"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5 text-base" />
            </button>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                {planData.name}
              </h1>
              <p className="text-sm sm:text-base mt-1">
                {planData.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="mx-auto grid lg:grid-cols-4 gap-6 p-6">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin gói */}
          <div className="bg-base-200 rounded-2xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-base-content">
                Thông tin gói
              </h2>
              {planData.recommended && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                  Đề xuất
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-base-content/70">Giá</p>
                <p className="text-2xl font-semibold text-green-600">
                  {planData.price === 0
                    ? "Miễn phí"
                    : `${planData.price.toLocaleString()}đ`}
                </p>
              </div>
              <div>
                <p className="text-base-content/70">Thời hạn</p>
                <p className="text-lg font-medium text-blue-600">
                  {planData.duration_days} ngày
                </p>
              </div>
              <div>
                <p className="text-base-content/70">Dung lượng</p>
                <p className="text-lg text-primary">
                  {planData.storage_limit_mb === -1
                    ? "Không giới hạn"
                    : `${planData.storage_limit_mb} MB`}
                </p>
              </div>
              <div>
                <p className="text-base-content/70">Số lượng ảnh/video</p>
                <p className="text-lg text-primary">
                  {planData.max_uploads === -1
                    ? "Không giới hạn"
                    : planData.max_uploads}
                </p>
              </div>
            </div>
          </div>

          {/* Tính năng nổi bật */}
          <div className="bg-base-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-base-content mb-4">
              Tính năng nổi bật
            </h3>
            <ul className="space-y-2">
              {planData.features?.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-accent">
                  <Check className="text-green-500 w-5 h-5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Tính năng hỗ trợ */}
          <div className="bg-base-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-base-content mb-4">
              Tính năng hỗ trợ
            </h3>
            {renderFeatureFlags(planData.feature_flags)}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-2">
          <div className="bg-base-200 rounded-2xl shadow-md p-6 sticky top-8">
            <h3 className="text-xl font-bold text-base-content mb-4">
              Thông tin thanh toán
            </h3>

            <div className="flex justify-center mb-6">
              <button
                onClick={handleCreateOrder}
                disabled={loadingcreate}
                className="btn btn-primary btn-lg text-white text-base font-semibold"
              >
                {loadingcreate ? "Đang xử lý..." : "💳 Tiếp tục thanh toán"}
              </button>
            </div>

            <div className="space-y-3 text-base">
              <div className="flex justify-between items-center bg-base-300 rounded-lg p-4">
                <p className="text-base-content/80">
                  Gói đã chọn:{" "}
                  <span className="font-semibold text-base-content">
                    {planData.name}
                  </span>
                </p>
              </div>
              <div className="flex justify-between items-center bg-base-300 rounded-lg p-4">
                <p className="text-base-content/80">
                  Số tiền:{" "}
                  <span className="font-semibold text-green-600 text-lg">
                    {planData.price.toLocaleString()}đ
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Lưu ý:</h4>
              <p className="text-sm text-yellow-700">
                Nhấn nút <strong>“Tiếp tục thanh toán”</strong> để hoàn tất. Sau
                khi thanh toán, hệ thống sẽ tự động kích hoạt gói trong vòng{" "}
                <strong>5–10 phút</strong>. Nếu có vấn đề, liên hệ CSKH qua{" "}
                <a
                  className="text-blue-600 underline"
                  href="https://zalo.me/0329254203"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Zalo hỗ trợ
                </a>
                .
              </p>
            </div>

            <div className="mt-6">
              <button className="btn btn-outline w-full" onClick={handleBack}>
                ← Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

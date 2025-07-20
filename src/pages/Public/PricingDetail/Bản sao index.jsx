import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Copy, ArrowLeft, Check, X } from "lucide-react";
import { AuthContext } from "../../../context/AuthLocket";
import LoadingPage from "../../../components/pages/LoadingPage";
import { API_URL } from "../../../utils";

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
const renderFeatureFlags = (flags) => {
  const maxUploads = flags.max_uploads;

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {typeof maxUploads === "object" && (
        <>
          <div className="flex items-center gap-3 p-3 rounded-xl border bg-blue-50 border-blue-200">
            <span className="text-blue-600 font-semibold">
              🖼️ {maxUploads.image}MB
            </span>
            <span className="text-blue-800">Dung lượng ảnh / bài đăng</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border bg-blue-50 border-blue-200">
            <span className="text-blue-600 font-semibold">
              📹 {maxUploads.video}MB
            </span>
            <span className="text-blue-800">Dung lượng video / bài đăng</span>
          </div>
        </>
      )}

      {Object.entries(flags).map(([key, value]) => {
        if (key === "max_uploads") return null; // đã hiển thị riêng ở trên

        const isActive = !!value;
        return (
          <div
            key={key}
            className={`flex items-center gap-3 p-3 rounded-xl border ${
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
              className={
                isActive
                  ? "text-green-800 font-medium"
                  : "text-gray-400 line-through"
              }
            >
              {FEATURE_LABELS[key] || key}
            </span>
          </div>
        );
      })}
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

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  if (loading) return <LoadingPage isLoading={true} />;
  if (!planData)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Không tìm thấy gói
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100">
      <div
        className="h-15"
        style={{ background: planData.ui?.gradient || "#6366F1" }}
      ></div>
      {/* Header */}
      <div
        className="w-full py-6 text-white"
        style={{ background: planData.ui?.gradient || "#6366F1" }}
      >
        <div className="mx-auto px-4">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="btn btn-ghost text-white">
              <ArrowLeft />
            </button>
            <div>
              <h1 className="text-4xl font-bold">{planData.name}</h1>
              <p className="text-sm mt-1">{planData.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto grid lg:grid-cols-4 gap-6 px-4 py-8">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Box */}
          <div className="bg-base-200 rounded-2xl p-6 shadow">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-base-content">Giá</p>
                <p className="text-2xl font-semibold text-green-600">
                  {planData.price === 0
                    ? "Miễn phí"
                    : `${planData.price.toLocaleString()}đ`}
                </p>
              </div>
              <div>
                <p className="text-base-content">Thời hạn</p>
                <p className="text-lg font-medium text-blue-600">
                  {planData.duration_days} ngày
                </p>
              </div>
              <div>
                <p className="text-base-content">Dung lượng</p>
                <p className="text-lg text-primary">
                  {planData.storage_limit_mb === -1
                    ? "Không giới hạn"
                    : `${planData.storage_limit_mb} MB`}
                </p>
              </div>
              <div>
                <p className="text-base-content">Số lượng ảnh/video</p>
                <p className="text-lg text-primary">
                  {planData.max_uploads === -1
                    ? "Không giới hạn"
                    : planData.max_uploads}
                </p>
              </div>
            </div>
          </div>

          {/* Tính năng nổi bật */}
          <div className="bg-base-200 rounded-2xl p-6 shadow">
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

          {/* Feature flags */}
          <div className="bg-base-200 rounded-2xl p-6 shadow">
            <h3 className="text-xl font-bold text-base-content mb-4">
              Tính năng hỗ trợ
            </h3>
            {renderFeatureFlags(planData.feature_flags)}
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2">
          <div className="bg-base-200 rounded-2xl shadow-lg p-6 sticky top-8">
            <h3 className="text-xl font-bold text-base-content mb-4">
              Thông tin thanh toán
            </h3>

            <div className="flex justify-center mb-6">
              <img
                src="../images/vcb_qr.jpg"
                alt="QR chuyển khoản"
                className="rounded-xl shadow-md w-48 h-auto"
              />
            </div>

            <div className="space-y-3 text-base">
              {/* Chủ tài khoản */}
              <div className="flex justify-between items-center bg-base-300 rounded-lg p-4">
                <p className="text-base-content/80">
                  Chủ tài khoản:{" "}
                  <span className="font-semibold text-base-content">
                    DAO VAN DOI
                  </span>
                </p>
              </div>

              {/* Ngân hàng */}
              <div className="flex justify-between items-center bg-base-300 rounded-lg p-4">
                <p className="text-base-content/80">
                  Ngân hàng:{" "}
                  <span className="font-semibold text-base-content">
                    Vietcombank
                  </span>
                </p>
              </div>

              {/* Số tài khoản */}
              <div className="flex justify-between items-center bg-base-300 rounded-lg p-4">
                <p className="text-base-content/80">
                  Số tài khoản:{" "}
                  <span className="font-semibold text-blue-600">
                    1051852055
                  </span>
                </p>
                <button
                  onClick={() => handleCopy("1051852055", "account")}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <Copy className="w-4 h-4 text-base-content" />
                </button>
              </div>
              {copySuccess === "account" && (
                <p className="text-sm text-green-600 ml-1">Đã sao chép!</p>
              )}

              {/* Số tiền */}
              <div className="flex justify-between items-center bg-base-300 rounded-lg p-4">
                <p className="text-base-content/80">
                  Số tiền:{" "}
                  <span className="font-semibold text-green-600 text-lg">
                    {planData.price.toLocaleString()}đ
                  </span>
                </p>
                <button
                  onClick={() => handleCopy(`${planData.price}`, "amount")}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <Copy className="w-4 h-4 text-base-content" />
                </button>
              </div>
              {copySuccess === "amount" && (
                <p className="text-sm text-green-600 ml-1">Đã sao chép!</p>
              )}

              {/* Nội dung CK */}
              <div className="flex justify-between items-center bg-base-300 rounded-lg p-4">
                <p className="text-base-content/80 break-all">
                  Nội dung CK:{" "}
                  <span className="font-semibold text-red-600">
                    {userPlan?.customer_code}
                  </span>
                </p>
                <button
                  onClick={() =>
                    handleCopy(`${userPlan?.customer_code || ""}`, "content")
                  }
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <Copy className="w-4 h-4 text-base-content" />
                </button>
              </div>
              {copySuccess === "content" && (
                <p className="text-sm text-green-600 ml-1">Đã sao chép!</p>
              )}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Lưu ý quan trọng:
              </h4>
              <p className="text-sm text-yellow-700">
                Vui lòng <strong>ghi đúng nội dung chuyển khoản</strong>. Hệ
                thống sẽ tự động nâng cấp <strong>PLAN</strong> trong vòng{" "}
                <strong>5–10 phút</strong>. Nếu quá thời gian vẫn chưa được xử
                lý, vui lòng liên hệ Zalo CSKH:{" "}
                <a
                  className="text-blue-600 underline"
                  href="https://zalo.me/0329254203"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ấn vào đây
                </a>
                .
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button className="btn btn-primary w-full">
                Tôi đã chuyển khoản
              </button>
              <button className="btn btn-outline w-full" onClick={handleBack}>
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthLocket";
import LoadingPage from "../../../components/pages/LoadingPage";
import { Copy, XCircle } from "lucide-react";
import VietQRImage from "./QrCodeImage";
import * as services from "../../../services";
import { showSuccess } from "../../../components/Toast";

export default function PayPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");

  const [plan, SetOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRecheck, setLoadingRecheck] = useState(false);
  const [copied, setCopied] = useState(false);

  const transferContent = `${user?.uid || "unknown"} - ${plan?.id}`;

  useEffect(() => {
    if (!orderId) return;
    const fetchPlan = async () => {
      try {
        const data = await services.GetInfoOrder(orderId);
        SetOrder(data);
      } catch (error) {
        console.error("Lỗi khi lấy gói:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [orderId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transferContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const recheckOrder = async () => {
    setLoadingRecheck(true);
    try {
      const data = await services.GetInfoOrder(orderId);

      if (data?.status === "PENDING") {
        showWarning("⏳ Đơn hàng chưa được thanh toán.");
      } else if (data?.status === "PAID") {
        showSuccess("✅ Đơn hàng đã thanh toán thành công!");
      } else if (data?.status === "CANCELLED") {
        showWarning("❌ Đơn hàng đã bị huỷ.");
      } else {
        showWarning("⚠️ Trạng thái đơn hàng không xác định.");
      }
      
      SetOrder(data);
    } catch (error) {
      console.error("Lỗi khi kiểm tra lại đơn hàng:", error);
    } finally {
      setLoadingRecheck(false);
    }
  };
  const handleCancelOrder = async ({ orderId, orderCode, onSuccess }) => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn huỷ giao dịch không?"
    );
    if (!confirmCancel) return;

    try {
      await services.CancelToOrder(orderId, orderCode);

      alert("✅ Giao dịch đã được huỷ.");
      if (onSuccess) onSuccess(); // callback nếu có
    } catch (error) {
      console.error("❌ Lỗi khi huỷ giao dịch:", error);
      alert("❌ Không thể huỷ giao dịch. Vui lòng thử lại.");
    }
  };

  if (loading) return <LoadingPage isLoading={true} />;

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-600">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Không tìm thấy gói thanh toán
          </h2>
          <button
            onClick={() => navigate("/pricing")}
            className="btn btn-primary mt-4"
          >
            Quay lại trang gói
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 px-6 py-6 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-base-100 shadow-2xl rounded-xl p-6">
        {/* Bên trái: QR + thông tin cơ bản */}
        <div className="space-y-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-base-content text-center">
            Quét mã QR để thanh toán
          </h2>
          <VietQRImage
            description={plan.info_order.description}
            amount={plan.info_order.amount}
          />

          <div className="grid grid-cols-2 gap-4 text-center text-sm w-full max-w-xs">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-lg font-bold text-green-600">
                {plan.price.toLocaleString()}đ
              </div>
              <div className="text-secondary">Giá gói</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-600">
                {plan.duration_days} ngày
              </div>
              <div className="text-secondary">Thời hạn</div>
            </div>
          </div>

          <div className="text-xs text-left text-base-content space-y-1 mt-2">
            <p>
              • Hệ thống sẽ xử lý trong <strong>5-10 phút</strong>.
            </p>
            <p>
              • Cần hỗ trợ?{" "}
              <a
                href="https://zalo.me/0329254203"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Zalo CSKH
              </a>
            </p>
          </div>
        </div>

        {/* Bên phải: Thông tin chuyển khoản */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-center text-base-content">
              Thông tin chuyển khoản
            </h2>

            <div className="space-y-5 text-base-content text-sm">
              {/* Ngân hàng */}
              <div className="flex items-center">
                <img
                  src="https://api.vietqr.io/img/MB.png"
                  alt="logo"
                  className="h-8 w-auto"
                />
                <div>
                  <p className="text-xs text-gray-500">Ngân hàng</p>
                  <p className="text-sm font-medium">
                    Ngân hàng TMCP Quân đội (MB Bank)
                  </p>
                </div>
              </div>

              {/* Chủ tài khoản */}
              <div>
                <p className="text-xs text-gray-500">Chủ tài khoản</p>
                <p className="text-sm font-medium text-primary">
                  {plan.bank_info.accountName}
                </p>
              </div>

              {/* Số tài khoản */}
              <div>
                <p className="text-xs text-gray-500">Số tài khoản</p>
                <div className="flex items-center justify-between px-3 py-2 bg-base-200 rounded-md">
                  <span className="font-semibold text-primary">
                    {plan.bank_info.accountNumber}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        plan.bank_info.accountNumber
                      );
                      setCopied("stk");
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="text-sm text-primary"
                  >
                    <Copy className="inline w-4 h-4 mr-1" /> Sao chép
                  </button>
                </div>
                {copied === "stk" && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Đã sao chép số tài khoản
                  </p>
                )}
              </div>

              {/* Số tiền */}
              <div>
                <p className="text-xs text-gray-500">Số tiền</p>
                <div className="flex items-center justify-between px-3 py-2 bg-base-200 rounded-md">
                  <span className="font-semibold text-primary">
                    {plan.price.toLocaleString()} VND
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(plan.price.toString());
                      setCopied("price");
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="text-sm text-primary"
                  >
                    <Copy className="inline w-4 h-4 mr-1" /> Sao chép
                  </button>
                </div>
                {copied === "price" && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Đã sao chép số tiền
                  </p>
                )}
              </div>

              {/* Nội dung */}
              <div>
                <p className="text-xs text-gray-500">Nội dung</p>
                <div className="flex items-center justify-between px-3 py-2 bg-base-200 rounded-md">
                  <span className="font-semibold text-primary">
                    {plan.info_order.description}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        plan.info_order.description
                      );
                      setCopied("content");
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="text-sm text-primary"
                  >
                    <Copy className="inline w-4 h-4 mr-1" /> Sao chép
                  </button>
                </div>
                {copied === "content" && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Đã sao chép nội dung
                  </p>
                )}
              </div>

              {/* Lưu ý */}
              <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 p-3 rounded-md text-xs">
                <strong>Lưu ý:</strong> Nhập chính xác <strong>số tiền</strong>{" "}
                và <strong>nội dung</strong> khi chuyển khoản để hệ thống tự
                động xử lý.
              </div>
            </div>
          </div>

          {/* Nút điều hướng */}
          {/* Nút điều hướng */}
          <div className="flex gap-4 pt-4">
            {plan.status !== "PAID" ? (
              <>
                <button
                  onClick={() =>
                    handleCancelOrder({
                      orderId: plan?.id,
                      orderCode: plan?.info_order.orderCode,
                      onSuccess: () => navigate(-1),
                    })
                  }
                  className="btn btn-outline flex-1 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Huỷ giao dịch</span>
                </button>
                <button
                  disabled={loadingRecheck}
                  onClick={recheckOrder}
                  className="btn btn-primary flex-1"
                >
                  {loadingRecheck ? "Đang kiểm tra..." : "Kiểm tra thanh toán"}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/pricing")}
                className="btn btn-success w-full"
              >
                🎉 Đơn hàng đã thanh toán - Xem gói của bạn
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

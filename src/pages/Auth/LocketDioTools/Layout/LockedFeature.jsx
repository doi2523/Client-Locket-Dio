import { Copy } from "lucide-react";
import { SonnerSuccess } from "@/components/ui/SonnerToast";
import { MYBANK_CONFIG } from "@/config";
import { useMemo } from "react";

const LockedFeature = ({
  toolName = "Tính năng",
  price = 5000,
  note = "CT",
  codeUser = "",
  description,
}) => {
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      SonnerSuccess("Đã copy vào clipboard");
    } catch {
      SonnerSuccess("Không thể copy, vui lòng copy thủ công");
    }
  };

  const amountText = useMemo(
    () => Number(price).toLocaleString("vi-VN"),
    [price]
  );

  const urlQr = useMemo(() => {
    const addInfo = encodeURIComponent(`${codeUser} ${note}`);
    return `https://img.vietqr.io/image/${MYBANK_CONFIG.bankCode}-${MYBANK_CONFIG.accountNumber}-compact.png?amount=${price}&addInfo=${addInfo}`;
  }, [price, codeUser, note]);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      <div className="text-6xl">🔒</div>

      <h3 className="text-xl font-semibold">Tính năng bị khóa</h3>

      <p className="text-sm opacity-70 max-w-md">
        Bạn không có quyền truy cập vào <b>{toolName}</b>.{" "}
        {description ||
          "Để mở khóa, vui lòng quét mã QR hoặc chuyển khoản theo thông tin bên dưới."}
      </p>

      {/* QR */}
      <img
        src={urlQr}
        alt="QR Thanh toán"
        className="w-48 h-48 rounded-lg shadow-md"
      />

      {/* Bank info */}
      <div className="bg-base-200 rounded-lg p-3 text-sm leading-relaxed w-80 space-y-2 text-left">
        <p>
          <b>Ngân hàng:</b> {MYBANK_CONFIG.bankName}
        </p>

        <div className="flex items-center justify-between">
          <p>
            <b>Số tài khoản:</b> {MYBANK_CONFIG.accountNumber}
          </p>
          <button
            onClick={() => handleCopy(MYBANK_CONFIG.accountNumber)}
            className="p-1 hover:bg-base-300 rounded"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <p>
          <b>Chủ tài khoản:</b> {MYBANK_CONFIG.accountName}
        </p>

        <div className="flex items-center justify-between">
          <p>
            <b>Nội dung:</b> {codeUser} {note}
          </p>
          <button
            onClick={() => handleCopy(`${codeUser} ${note}`)}
            className="p-1 hover:bg-base-300 rounded"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <p>
          <b>Số tiền:</b> {amountText} VND
        </p>
      </div>

      <p className="text-sm opacity-70 max-w-md">
        <span className="block">• Vui lòng nhập đúng nội dung yêu cầu.</span>
        <span className="block">• Gói sẽ được kích hoạt sau 1–2 phút.</span>
        <span className="block">• Hỗ trợ qua trang liên hệ.</span>
      </p>
    </div>
  );
};

export default LockedFeature;

import { useState } from "react";
import LoadingRing from "@/components/ui/Loading/ring";
import { Link } from "react-router-dom";
import {
  SonnerError,
  SonnerSuccess,
  SonnerWarning,
} from "@/components/ui/SonnerToast";
import { forgotPassword, ValidateEmailAddress } from "@/services";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      SonnerWarning("Email không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      const res = await ValidateEmailAddress(email);

      if (res?.result?.status === 601) {
        SonnerWarning("Tài khoản với email này không tồn tại!");
        return;
      }

      await forgotPassword(email);

      SonnerSuccess(
        "Thông báo từ Locket Dio",
        "Link đặt lại mật khẩu đã được gửi đến email của bạn!",
      );

      setEmail("");
    } catch (error) {
      console.log(error);
      SonnerError("Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[84vh] px-6">
      <div className="w-full max-w-md p-6 shadow-lg rounded-xl bg-opacity-50 backdrop-blur-3xl bg-base-100 border border-base-300 text-base-content">
        <h1 className="text-3xl font-bold text-center mb-2">Quên mật khẩu</h1>
        <p className="text-center text-sm text-base-content/80 mb-6">
          Nhập địa chỉ email của bạn để nhận link đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg input input-ghost border-base-content"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn btn-primary py-2 text-lg font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <LoadingRing size={20} stroke={3} speed={2} color="white" />
                Đang gửi...
              </>
            ) : (
              "Gửi"
            )}
          </button>

          <div className="text-center mt-3 text-xs text-base-content/70">
            Nếu bạn không thấy email, vui lòng kiểm tra trong mục Thư rác (Spam)
            hoặc Thư quảng cáo.
          </div>

          <div className="text-center mt-4">
            <Link
              to={"/login"}
              className="text-sm text-blue-500 hover:underline transition"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

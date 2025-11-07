import { useState, useEffect } from "react";
import { showToast } from "@/components/Toast";
import * as DioService from "@/services/LocketDioServices";
import LoadingRing from "@/components/ui/Loading/ring";
import { Link } from "react-router-dom";
import { SonnerError, SonnerSuccess, SonnerWarning } from "@/components/ui/SonnerToast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // thời gian chờ tính bằng giây

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cooldown > 0) {
      showToast("info", `Vui lòng chờ ${cooldown}s trước khi gửi lại.`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      SonnerWarning("error", "Email không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      await DioService.forgotPassword(email);
      SonnerSuccess(
        "Thông báo từ Locket Dio",
        "Link đặt lại mật khẩu đã được gửi đến email của bạn!"
      );
      setEmail("");
      setCooldown(180); // Bắt đầu đếm ngược 3 phút
    } catch (error) {
      SonnerError("Có lỗi xảy ra, vui lòng thử lại sau!",error);
      setCooldown(180); // Cũng bắt cooldown để tránh spam ngay cả khi lỗi
    } finally {
      setLoading(false);
    }
  };

  // Hàm format thời gian mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
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
            disabled={loading || cooldown > 0}
            className={`w-full btn btn-primary py-2 text-lg font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
              loading || cooldown > 0 ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <LoadingRing size={20} stroke={3} speed={2} color="white" />
                Đang gửi...
              </>
            ) : cooldown > 0 ? (
              `Gửi lại sau ${formatTime(cooldown)}`
            ) : (
              "Gửi"
            )}
          </button>

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

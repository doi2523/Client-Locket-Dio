import { useState, useContext } from "react";
import { showToast } from "../../../components/Toast";
import * as locketService from "../../../services/locketService";
import { AuthContext } from "../../../context/AuthLocket";
import * as utils from "../../../utils";
import LoadingRing from "../../../components/UI/Loading/ring";
import StatusServer from "../../../components/UI/StatusServer";
import { useApp } from "../../../context/AppContext";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { useloading } = useApp();
  const { isStatusServer, isLoginLoading, setIsLoginLoading } = useloading;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    try {
      const res = await locketService.login(email, password);
      if (!res) throw new Error("Lỗi: Server không trả về dữ liệu!");
      // Lưu token & localId ngay sau khi login
      utils.setAuthCookies(res.data.idToken, res.data.localId);
      if (!res) throw new Error("Không thể lấy thông tin người dùng!");

      // Lưu user vào localStorage và cập nhật state
      utils.saveUser(res.data);
      setUser(res.data);
      showToast("success", "Đăng nhập thành công!");
    } catch (error) {
      if (error.status) {
        // 🔥 Xử lý lỗi từ server trả về
        const { status, message, code } = error;

        switch (status) {
          case 400:
            showToast("error", "Tài khoản hoặc mật khẩu không đúng!");
            break;
          case 401:
            showToast("error", "Tài khoản hoặc mật khẩu không đúng!");
            break;
          case 403:
            showToast("error", "Bạn không có quyền truy cập.");
            window.location.href = "/login";
            break;
          case 500:
            showToast("error", "Lỗi hệ thống, vui lòng thử lại sau!");
            break;
          default:
            showToast("error", message || "Đăng nhập thất bại!");
        }
      } else {
        // 🔥 Lỗi ngoài server (mạng, không phản hồi,...)
        showToast(
          "error",
          error.message || "Lỗi kết nối! Vui lòng kiểm tra lại mạng."
        );
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-base-200 px-6">
        <div className="w-full max-w-md p-7 shadow-lg rounded-xl bg-opacity-50 backdrop-blur-3xl bg-base-100 border-base-300 text-base-content">
          <h1 className="text-3xl font-bold text-center">Đăng Nhập Locket</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg input input-ghost border-base-content"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <legend className="fieldset-legend">Mật khẩu</legend>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg input input-ghost border-base-content"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label
                htmlFor="rememberMe"
                className="cursor-pointer select-none text-sm"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            <button
              type="submit"
              className={`
                w-full btn btn-primary py-2 text-lg font-semibold rounded-lg transition flex items-center justify-center gap-2
                ${
                  isStatusServer !== true
                    ? "bg-blue-400 cursor-not-allowed opacity-80"
                    : ""
                }
              `}
              disabled={isStatusServer !== true || isLoginLoading}
            >
              {isLoginLoading ? (
                <>
                  <LoadingRing size={20} stroke={3} speed={2} color="white" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng Nhập"
              )}
            </button>
            <span className="text-xs">Vui lòng chờ Server khởi động.</span>
            <StatusServer />
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

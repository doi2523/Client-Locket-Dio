import { useState, useContext, useEffect } from "react";
import * as DioService from "@/services/LocketDioServices";
import { AuthContext } from "@/context/AuthLocket";
import * as utils from "@/utils";
import LoadingRing from "@/components/ui/Loading/ring";
import StatusServer from "@/components/ui/StatusServer";
import { useApp } from "@/context/AppContext";
import Turnstile from "react-turnstile";
import { Link } from "react-router-dom";
import {
  SonnerError,
  SonnerInfo,
  SonnerSuccess,
} from "@/components/ui/SonnerToast";
import { CONFIG } from "@/config";
import RotatingCircleText from "./RotatingCircleText";

const Login = () => {
  const { setUser, setAuthTokens } = useContext(AuthContext);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    const stored = localStorage.getItem("rememberMe");
    return stored === null ? true : stored === "true";
  });

  const { useloading } = useApp();
  const { isStatusServer, isLoginLoading, setIsLoginLoading } = useloading;

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
  }, [rememberMe]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (CONFIG.keys.turnstileKey && !captchaToken) {
      SonnerError("Vui lòng xác minh bạn không phải robot");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      SonnerError("Email không hợp lệ!");
      return;
    }

    setIsLoginLoading(true);
    try {
      const res = await DioService.login(email, password, captchaToken);
      if (!res) throw new Error("Lỗi: Server không trả về dữ liệu!");

      const { idToken, localId } = res.data;

      // ⚡️ Lưu refreshToken theo rememberMe
      // Khi login thành công:
      utils.saveToken({ idToken, localId }, rememberMe);

      // ⚡️ Lưu user data toàn bộ (gồm thông tin cá nhân)
      utils.saveUser(res.data);
      setAuthTokens(utils.getToken());
      setUser(res.data);

      SonnerSuccess(
        "Đăng nhập thành công!",
        `Xin chào ${res.data?.displayName || "người dùng"}!`
      );
    } catch (error) {
      if (error.status) {
        const { status, message } = error;
        switch (status) {
          case 400:
            SonnerError("Tài khoản hoặc mật khẩu không đúng!");
            break;
          case 401:
            SonnerError("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại!");
            break;
          case 429:
            SonnerError(
              "Bạn nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút!"
            );
            setEmail("");
            setPassword("");
            break;
          case 403:
            SonnerError("Bạn không có quyền truy cập.");
            setEmail("");
            setPassword("");
            window.location.href = "/login";
            break;
          case 500:
            SonnerError("Lỗi hệ thống, vui lòng thử lại sau!");
            break;
          default:
            SonnerError(message || "Đăng nhập thất bại!");
            setEmail("");
            setPassword("");
        }
      } else {
        SonnerError(
          "Lỗi kết nối!",
          error.message || "Vui lòng kiểm tra lại mạng."
        );
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex items-center justify-center h-[84vh] bg-base-200 px-6">
        <div className="relative w-full max-w-md p-6 shadow-lg overflow-hidden rounded-xl bg-opacity-50 backdrop-blur-3xl bg-base-100 border-base-300 text-base-content">
          <RotatingCircleText />
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 pr-12 rounded-lg input input-ghost border-base-content"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 z-10 right-3 transform -translate-y-1/2 text-base-content opacity-70 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.639 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  disabled
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

              {/* ✅ Thêm link Quên mật khẩu */}
              <Link
                to={"/forgot-password"}
                className="text-sm text-blue-500 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className={`
    w-full btn btn-primary py-2 text-lg font-semibold rounded-lg transition flex items-center justify-center gap-2
    ${
      isStatusServer !== true ||
      isLoginLoading ||
      (CONFIG.keys.turnstileKey && !captchaToken)
        ? "bg-blue-400 cursor-not-allowed opacity-80"
        : ""
    }
  `}
              disabled={
                isStatusServer !== true ||
                isLoginLoading ||
                (CONFIG.keys.turnstileKey && !captchaToken)
              }
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

            {CONFIG.keys.turnstileKey && (
              <Turnstile
                sitekey={CONFIG.keys.turnstileKey}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => {
                  setCaptchaToken(null);
                  SonnerInfo("Turnstile đã hết hạn. Vui lòng xác minh lại.");
                }}
                className="mt-2"
              />
            )}

            <span className="text-xs">Vui lòng chờ Server02 khởi động.</span>
            <StatusServer />
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

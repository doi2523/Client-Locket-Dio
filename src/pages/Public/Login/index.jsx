import { useState, useContext } from "react";
import { showToast } from "../../../components/Toast";
import * as locketService from "../../../services/locketService";
import { AuthContext } from "../../../context/AuthLocket";
import * as utils from "../../../utils";
import LoadingRing from "../../../components/UI/Loading/ring";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await locketService.login(email, password);
      if (!res) throw new Error("Lỗi: Server không trả về dữ liệu!");
      // Lưu token & localId ngay sau khi login
      utils.setAuthCookies(res.user.idToken, res.user.localId, parseInt(res.user.expiresIn, 10));
      showToast("success", "Đăng nhập thành công!");

      // Lấy token sau khi lưu
      const idToken = utils.getAuthCookies().idToken;
      const localId = utils.getAuthCookies().localId;
      
      // Lấy thông tin người dùng
      const userData = await locketService.getInfo(idToken, localId);
      if (!userData) throw new Error("Không thể lấy thông tin người dùng!");

      // Lưu user vào localStorage và cập nhật state
      utils.saveUser(userData);
      setUser(userData);
    } catch (error) {
      showToast("error", error.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md mx-7 p-7 space-y-6 shadow-lg rounded-xl bg-opacity-50 backdrop-blur-3xl bg-base-100 border-base-300 text-base-content">
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
          <button
            type="submit"
            className="w-full btn btn-primary py-2 text-lg font-semibold rounded-lg transition flex items-center justify-center gap-2"
            disabled={loading}
            style={loading ? { cursor: "not-allowed" } : {}}
          >
            {loading ? (
              <>
                <LoadingRing size={20} stroke={3} speed={2} color="white"/>
                Đang đăng nhập...
              </>
            ) : (
              "Đăng Nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import LoadingRing from "../../../components/UI/Loading/ring";
import * as locketService from "../../../services/locketService";
import * as utils from "../../../utils";
import axios from "axios";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userinfo, setUserinfo] = useState({});

  // Convert timestamp thành ngày giờ đọc được
  const formatDate = (timestamp) => {
    if (!timestamp) return "Không có dữ liệu";
    return new Date(parseInt(timestamp)).toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Không có dữ liệu";

    const date = new Date(parseInt(timestamp));
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false, // 24-hour format
      timeZone: "Asia/Ho_Chi_Minh",
    };

    return date.toLocaleString("vi-VN", options);
  };
  const formatDateTimeV2 = (timestamp) => {
    if (!timestamp) return "Không có dữ liệu";

    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false, // 24-hour format
      timeZone: "Asia/Ho_Chi_Minh",
    };

    return date.toLocaleString("vi-VN", options);
  };
  useEffect(() => {
    const fetchLatestMoment = async () => {
      try {
        // console.log("start get");
        const idToken = utils.getAuthCookies().idToken;
        // const response = await locketService.getLatestMoment(idToken);
        // console.log(response);
        // return response.data;
      } catch (error) {
        console.error(
          "❌ Lỗi khi gọi API latest moment:",
          error.response?.data.success || error.message
        );
        return null;
      }
    };

    fetchLatestMoment();
  }, []); // ✅ Dependency array rỗng => chỉ chạy khi component mount
  const { idToken, localId } = utils.getAuthCookies();
  const updateProfile = async () => {
    try {
      const response = await axios.post("http://localhost:5004/locket/changeProfileInfo", {
        badge: "locket_gold",
        idToken,
        celebrity: true,
        // additionalData: {
        //   username: "Dio",
        //   bio: "Developer",
        // },
      });
      console.log("✅ Cập nhật thành công:", response.data);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật profile:", error.message);
    }
  };
  
  // updateProfile();
  

  return (
    <div className="flex flex-col items-center min-h-screen w-full px-6 py-5">
      <div className="h-16"></div>
      <h1 className="text-3xl font-bold pb-6">
        Chào mừng, "
        <span className="">
          {user?.firstName} {user?.lastName}
        </span>
        " đến với tài khoản của bạn!
      </h1>

      {/* Thông tin cơ bản */}
      <div className="flex flex-row items-center bg-base-100 border-base-300 text-base-content p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="avatar relative w-24 h-24  disable-select">
          <div className=" rounded-full shadow-md outline-4 outline-amber-400 flex justify-items-center">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingRing size={40} stroke={2} color="blue" />
              </div>
            )}
            <img
              src={user?.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className={`w-24 h-24 transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
        <div className="flex flex-col pl-5 text-center items-start space-y-1">
          <h2 className="text-2xl font-semibold">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="font-semibold">{user?.email || "Không có email"}</p>
          <a
            href={`https://locket.cam/${user?.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link underline font-semibold"
          >
            https://locket.cam/{user?.username}
          </a>
        </div>
      </div>

      {/* Thông tin tài khoản chi tiết */}
      <div className="mt-6 bg-base-100 border-base-300 text-base-content p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-semibold pb-2">Thông tin tài khoản:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-1 rounded-md p-3 card-body">
          <InfoRow label="UID" value={user?.uid} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Username" value={user?.username} />
          <InfoRow label="Tên hiển thị" value={user?.displayName} />
          <InfoRow label="Số điện thoại" value={user?.phoneNumber} />
          <InfoRow
            label="Đăng nhập lần cuối"
            value={formatDateTime(user?.lastLoginAt)}
          />
          <InfoRow
            label="Ngày tạo tài khoản"
            value={formatDateTimeV2(user?.createdAt)}
          />
          <InfoRow
            label="Mật khẩu cập nhật lần cuối"
            value={formatDate(user?.lastRefreshAt)}
          />
          <InfoRow
            label="Xác thực tùy chỉnh"
            value={user?.customAuth ? "Có" : "Không"}
          />
        </div>
      </div>
    </div>
  );
}

// Component hiển thị từng dòng thông tin
const InfoRow = ({ label, value }) => (
  <div className="">
    <span className="font-semibold">{label}:</span>{" "}
    <span className="font-extrabold">{value || "Không có dữ liệu"}</span>
  </div>
);

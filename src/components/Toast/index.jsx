import { ToastContainer, toast, Bounce } from "react-toastify";
import "./styles.css"; // Import file CSS tùy chỉnh
import "react-toastify/dist/ReactToastify.css";

// Hàm hiển thị toast: đóng toast cũ trước khi hiện toast mới
export const showToast = (type = "default", message) => {
  //toast.dismiss(); // Đóng tất cả các toast đang hiển thị
  toast(message, { type });
};
export const showSuccess = (msg) => showToast("success", msg);
export const showError = (msg) => showToast("error", msg);
export const showInfo = (msg) => showToast("info", msg);

// Component ToastProvider để hiển thị ToastContainer
const ToastProvider = () => (
  <ToastContainer
    position="top-right" // Hiển thị toast ở góc trên bên phải
    autoClose={2500} // Tự động đóng sau 3 giây
    hideProgressBar={false} // Hiển thị thanh chạy
    newestOnTop={false} // Không xếp toast mới lên trên cùng
    closeOnClick // Đóng toast khi click
    limit={2} // Chỉ hiển thị một toast tại một thời điểm
    theme="light" // Giao diện sáng
    transition={Bounce} // Hiệu ứng xuất hiện dạng bật nảy
    style={{
      fontSize: "14px", // Giảm kích thước chữ
      width: "90%", // Toast rộng 90% màn hình trên mobile
      maxWidth: "320px", // Giới hạn tối đa chiều rộng
    }}
  />
);

export default ToastProvider;

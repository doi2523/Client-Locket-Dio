import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";

export default function ReviewFeature() {
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      nextBtnText: "Tiếp",
      prevBtnText: "Quay lại",
      doneBtnText: "Xong",
      onDestroyed: () => {
        localStorage.setItem("streak-tour", "true");
      },
      steps: [
        {
          element: '[data-tour="introduce-streak"]',
          popover: {
            title: "Giới thiệu công cụ",
            description: `
              <p>Khôi phục chuỗi Locket với vô hạn số lần.</p>
            `,
            side: "bottom",
          },
        },
        {
          element: '[data-tour="current-streak"]',
          popover: {
            title: "Chuỗi hiện tại",
            description: `
              <p>Đây là <b>chuỗi streak hiện tại</b> của bạn.</p>
              <p>Hiển thị bài đăng Locket cuối cùng vào ngày đó.</p>
            `,
            side: "bottom",
          },
        },
        {
          element: '[data-tour="past-streak"]',
          popover: {
            title: "Chuỗi quá khứ",
            description: `
              <p>Đây là <b>chuỗi streak trước đây</b> của bạn.</p>
              <p>Đừng hỏi vì sao nó là quá khứ vì bạn đã làm mất nó.</p>
            `,
            side: "bottom",
          },
        },
        {
          element: '[data-tour="current-day"]',
          popover: {
            title: "Ngày hiện tại",
            description: `
              <p>Đây là <b>ngày hiện tại</b>.</p>
              <p>Nếu số ngày của chuỗi hiện tại trùng với giá trị này thì
              <b>không cần làm gì thêm</b>.</p>
            `,
            side: "bottom",
          },
        },
        {
          element: '[data-tour="past-day"]',
          popover: {
            title: "Ngày quá khứ",
            description: `
              <p>Đây là <b>ngày hôm qua</b>.</p>
              <p>Thường đây là giá trị nên chọn để <b>khôi phục chuỗi</b>.</p>
            `,
            side: "bottom",
          },
        },
        {
          element: '[data-tour="day-value"]',
          popover: {
            title: "Giá trị đã chọn",
            description: `
              <p>Đây là ngày dùng để <b>khôi phục chuỗi</b>.</p>
              <p>Định dạng: <code>yyyymmdd</code></p>
              <p>Ví dụ: 17/03/2026 → <code>20260317</code></p>
            `,
            side: "bottom",
          },
        },
        {
          element: '[data-tour="note-streak"]',
          popover: {
            title: "Điều kiện và hướng dẫn",
            description: `
              <p>Khu vực này không phải để trưng đâu nó sẽ giúp ích cho bạn đấy.</p>
            `,
            side: "bottom",
          },
        },
        {
          element: '[data-tour="restore-btn"]',
          popover: {
            title: "Khôi phục",
            description: `
              <p>Nhấn nút này để <b>chuyển sang trang khôi phục chuỗi</b>.</p>
            `,
            side: "bottom",
          },
        },
        {
          popover: {
            title: "",
            description: `
              <img src="https://i.imgur.com/3WpTnyA.gif" style="width:260px;display:block;margin:auto;">
              <p>Xong rồi đấy chúc bạn khôi phục chuỗi thành công nha.</p>
            `,
            side: "over",
          },
        },
      ],
    });

    driverObj.drive();
  };

  // tự chạy khi chưa từng xem
  useEffect(() => {
    if (localStorage.getItem("streak-tour") !== "true") {
      startTour();
    }
  }, []);

  return (
    <button className="btn btn-sm btn-secondary" onClick={startTour}>
      Xem hướng dẫn
    </button>
  );
}

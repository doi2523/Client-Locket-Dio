import React from "react";

const Docs = () => {
  return (
    <div className="min-h-screen px-4 flex flex-col items-center py-5">
      <h1 className="text-3xl font-semibold mb-5">
        Hướng Dẫn Sử Dụng Trang Web Locket Dio by Dio
      </h1>

      <div className="max-w-3xl text-left mb-12">
        {/* Giới Thiệu */}
        <h2 className="text-2xl font-semibold mt-4">
          1. Giới Thiệu Về Locket Dio
        </h2>
        <p className="text-sm leading-relaxed">
          Locket Dio là nền tảng WebApp giúp bạn dễ dàng tải lên, lưu trữ và
          chia sẻ ảnh, video với phong cách riêng biệt qua các caption tùy
          chỉnh. Chúng tôi cam kết mang đến cho bạn trải nghiệm quản lý nội dung
          thuận tiện, bảo mật và tối ưu nhất trên web.
        </p>

        {/* Tính Năng Chính */}
        <h2 className="text-2xl font-semibold mt-6">2. Tính Năng Chính</h2>
        <ul className="list-disc ml-5 text-sm">
          <li>Đăng nhập vào hệ thống.</li>
          <li>Tải ảnh và video lên Locket.</li>
          <li>Custome caption theo ý thích.</li>
          <li>Chọn bạn bè có thể xem khi đăng.</li>
          <li>Forums chia sẻ màu caption.</li>
          <li>Quay video hoặc chụp ảnh trực tiếp trên web.</li>
          <li>Tăng chất lượng ảnh/video</li>
        </ul>

        {/* Các Lưu Ý Quan Trọng */}
        <h2 className="text-2xl font-semibold mt-6">3. Các Lưu Ý Quan Trọng</h2>
        <ul className="list-disc ml-5 text-sm">
          <li>
            <b>Kích thước tệp:</b> Đối với ảnh nhỏ hơn 1MB và video có thể có
            kích thước tối đa 10MB.
          </li>
          <li>
            <b>Định dạng hỗ trợ:</b> Ảnh: JPG, JPEG; Video: MP4, MOV.
          </li>
          <li>
            <b>Kích cỡ phương tiện:</b> Sau khi tải lên web phương tiện sẽ tự
            động được cắt vuông. Vì vậy bạn nên cắt vuông trước khi tải lên.
          </li>
          <li>
            <b>Quyền riêng tư:</b> Các tệp tin tải lên sẽ được bảo mật, nhưng
            hãy chắc chắn rằng bạn không chia sẻ thông tin nhạy cảm.
          </li>
        </ul>

        {/* Hướng Dẫn Khi Lỗi Tải Ảnh/Video */}
        <h2 className="text-2xl font-semibold mt-6">
          4. Hướng Dẫn Khi Gặp Lỗi Tải Ảnh/Video
        </h2>
        <p className="text-sm">
          Nếu bạn gặp lỗi khi tải ảnh hoặc video lên trang web, có thể do kích
          thước tệp quá lớn hoặc định dạng không được hỗ trợ.
        </p>
        <p className="text-sm">
          Để giải quyết vấn đề này, bạn có thể thực hiện các bước sau:
        </p>
        <ul className="list-inside text-sm">
          <li>
            <strong>Bước 1:</strong> Kiểm tra kích thước tệp và đảm bảo ảnh
            không vượt quá 1MB và video không quá 10MB.
          </li>
          <li>
            <strong>Bước 2:</strong> Nếu tệp quá lớn, hãy thử nén ảnh hoặc video
            bằng cách gửi chúng qua Zalo, Messenger, hoặc bất kỳ ứng dụng nhắn
            tin nào.
          </li>
          <li>
            <strong>Bước 3:</strong> Sau khi gửi, tải lại ảnh/video đã được lưu
            về từ ứng dụng đó.
          </li>
          <li>
            <strong>Bước 4:</strong> Cuối cùng, thử tải lại ảnh hoặc video lên
            trang web.
          </li>
        </ul>
        <p className="text-sm">
          Đây là cách nhanh chóng và hiệu quả để giảm kích thước tệp mà không
          cần sử dụng công cụ nén bên ngoài.
        </p>
        <p className="text-sm text-secondary">
          Nếu vẫn gặp lỗi, hãy liên hệ nhanh qua 👉🏻
          <a
            href="sms:+84 329254203" // Thay số điện thoại của bạn vào đây
            className="underline font-semibold"
          >
            iMessage
          </a>
        </p>

        {/* Câu Hỏi Thường Gặp (FAQ) */}
        <h2 className="text-2xl font-semibold mt-6">
          5. Câu Hỏi Thường Gặp (FAQ)
        </h2>
        <ul className="list-disc ml-5 text-sm space-y-2">
          <li>
            <b>Có thể xóa ảnh/video đã tải lên không?</b> Có. Bạn có thể xoá
            ảnh/video đã đăng bất kỳ lúc nào từ màn hình chính bằng cách nhấn
            giữ và chọn nút xoá. Tính năng này đang được cải tiến để tối ưu hơn
            trong tương lai.
          </li>
          <li>
            <b>Người sáng lập Locket Dio là ai?</b> Locket Dio được phát triển
            bởi Đào Văn Đôi (Dio), sinh viên năm cuối ngành Công nghệ Thông tin,
            với đam mê tạo ra sản phẩm sáng tạo và hữu ích.
          </li>
          <li>
            <b>Gói thành viên là gì?</b> Gói thành viên là các gói dịch vụ giúp
            người dùng mở khóa thêm nhiều tính năng như đăng nhiều ảnh/video
            hơn, lưu trữ nhiều hơn, và hỗ trợ tùy chỉnh cá nhân hóa tốt hơn.
          </li>
          <li>
            <b>Làm sao để nâng cấp gói thành viên?</b> Hiện tại, bạn có thể liên
            hệ quản trị viên hoặc thông qua mục đăng ký gói trên giao diện
            chính. Thanh toán sẽ hỗ trợ qua các phương thức như Momo, chuyển
            khoản hoặc ví điện tử khác.
          </li>
          <li>
            <b>Trang web hỗ trợ các trình duyệt nào?</b> Locket Dio hỗ trợ tất
            cả các trình duyệt hiện đại như Chrome, Firefox, Safari, Edge và
            trình duyệt di động Android/iOS.
          </li>
          <li>
            <b>Thông tin người dùng có được lưu lại không?</b> Trang web sẽ thu
            thập và lưu trữ một số thông tin cơ bản như email, tên và tên đăng
            nhập (username) để xác thực tài khoản và đảm bảo an toàn cho người
            dùng. Chúng tôi cam kết sử dụng thông tin này một cách nghiêm túc,
            không chia sẻ với bên thứ ba và chỉ dùng để hỗ trợ quản lý tài khoản
            cũng như nâng cao trải nghiệm của bạn. Ảnh và video bạn tải lên được
            bảo mật riêng tư, không bị theo dõi hay phân tích hành vi.
          </li>

          <li>
            <b>Tôi có thể xem lại những ảnh/video đã đăng không?</b> Có. Các bài
            đã đăng được lưu trong mục lịch sử đăng (Recent Posts), bạn có thể
            xem lại và xoá bất kỳ lúc nào.
          </li>
          <li>
            <b>Mã nguồn API?</b> Nếu bạn muốn tìm hiểu hoặc tích hợp API từ
            Locket Dio, hãy liên hệ quản trị viên qua email để được cấp quyền
            hoặc tài liệu hướng dẫn.
          </li>
          <li>
            <b>Trang web có quảng cáo không?</b> Không. Locket Dio hoạt động
            hoàn toàn không có quảng cáo để giữ trải nghiệm người dùng liền mạch và
            sạch sẽ.
          </li>
          <li>
            <b>Tại sao nên ủng hộ gói thành viên?</b> 100% thu nhập từ các gói
            được sử dụng để vận hành máy chủ, bảo trì, và phát triển thêm tính
            năng mới. Việc bạn ủng hộ là động lực to lớn để dự án phát triển bền
            vững.
          </li>
        </ul>

        {/* Cam Đoan Bảo Mật */}
        <h2 className="text-2xl font-semibold mt-6">6. Chính Sách Bảo Mật</h2>
        <p className="text-sm">
          Locket Dio cam kết bảo mật thông tin tài khoản của bạn. Tất cả các tệp
          tin và dữ liệu mà bạn tải lên sẽ được bảo vệ bằng các biện pháp an
          toàn, và tôi không lưu trữ bất kỳ thông tin nhạy cảm nào liên quan đến
          tài khoản của bạn. Tôi luôn nỗ lực để đảm bảo rằng các thông tin cá
          nhân và tài khoản của bạn được bảo vệ một cách an toàn nhất.
        </p>

        {/* Liên Hệ */}
        <h2 className="text-2xl font-semibold mt-6">7. Liên Hệ</h2>
        <p className="text-sm">
          Nếu bạn có bất kỳ câu hỏi hoặc vấn đề gì, vui lòng liên hệ với tôi qua
          email:{" "}
          <a href="mailto:doibncm2003@gmail.com" className="text-blue-500">
            doibncm2003@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Docs;

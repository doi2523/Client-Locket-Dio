import React from 'react';

const Docs = () => {
  return (
    <div className="min-h-screen px-4 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-5">Hướng Dẫn Sử Dụng Trang Web Locket Pro by Dio</h1>
      
      <div className="max-w-3xl text-left mb-12">
        {/* Giới Thiệu */}
        <h2 className="text-2xl font-semibold mt-4">1. Giới Thiệu Về Locket Pro</h2>
        <p className="text-sm">
          Locket Pro là nền tảng cho phép bạn tải lên và chia sẻ ảnh/video một cách dễ dàng. Bạn có thể quản lý các tập tin của mình một cách thuận tiện và an toàn.
        </p>

        {/* Tính Năng Chính */}
        <h2 className="text-2xl font-semibold mt-6">2. Tính Năng Chính</h2>
        <ul className="list-disc ml-5 text-sm">
          <li>Đăng nhập vào hệ thống.</li>
          <li>Tải ảnh và video lên Locket.</li>
          <li>Custome caption theo ý thích.</li>
          <li>Lưu phiên đăng nhập <span className='text-secondary'>(coming soon)</span>.</li>
          <li>Forums chia sẻ màu caption <span className='text-secondary'>(coming soon)</span>.</li>
          <li>Tăng chất lượng ảnh/video <span className='text-secondary'>(coming soon)</span>.</li>
          <li>Quay video hoặc chụp ảnh trực tiếp trên web <span className='text-secondary'>(coming soon)</span>.</li>
        </ul>

        {/* Các Lưu Ý Quan Trọng */}
        <h2 className="text-2xl font-semibold mt-6">3. Các Lưu Ý Quan Trọng</h2>
        <ul className="list-disc ml-5 text-sm">
          <li><b>Kích thước tệp:</b> Đối với ảnh nhỏ hơn 1MB và video có thể có kích thước tối đa 10MB.</li>
          <li><b>Định dạng hỗ trợ:</b> Ảnh: JPG, JPEG, PNG; Video: MP4, MOV.</li>
          <li><b>Kích cỡ phương tiện:</b> Sau khi tải lên web phương tiện sẽ tự động được cắt vuông. Vì vậy bạn nên cắt vuông trước khi tải lên.</li>
          <li><b>Quyền riêng tư:</b> Các tệp tin tải lên sẽ được bảo mật, nhưng hãy chắc chắn rằng bạn không chia sẻ thông tin nhạy cảm.</li>
        </ul>

        {/* Hướng Dẫn Khi Lỗi Tải Ảnh/Video */}
        <h2 className="text-2xl font-semibold mt-6">4. Hướng Dẫn Khi Gặp Lỗi Tải Ảnh/Video</h2>
        <p className="text-sm">
          Nếu bạn gặp lỗi khi tải ảnh hoặc video lên trang web, có thể do kích thước tệp quá lớn hoặc định dạng không được hỗ trợ.
        </p>
        <p className="text-sm">
          Để giải quyết vấn đề này, bạn có thể thực hiện các bước sau:
        </p>
        <ul className="list-inside text-sm">
          <li><strong>Bước 1:</strong> Kiểm tra kích thước tệp và đảm bảo ảnh không vượt quá 1MB và video không quá 10MB.</li>
          <li><strong>Bước 2:</strong> Nếu tệp quá lớn, hãy thử nén ảnh hoặc video bằng cách gửi chúng qua Zalo, Messenger, hoặc bất kỳ ứng dụng nhắn tin nào.</li>
          <li><strong>Bước 3:</strong> Sau khi gửi, tải lại ảnh/video đã được lưu về từ ứng dụng đó.</li>
          <li><strong>Bước 4:</strong> Cuối cùng, thử tải lại ảnh hoặc video lên trang web.</li>
        </ul>
        <p className="text-sm">
          Đây là cách nhanh chóng và hiệu quả để giảm kích thước tệp mà không cần sử dụng công cụ nén bên ngoài.
        </p>
        <p className='text-sm text-secondary'>
          Nếu vẫn gặp lỗi, hãy liên hệ nhanh qua 👉🏻
          <a
            href="sms:+84 329254203" // Thay số điện thoại của bạn vào đây
            className="underline font-semibold"
          >iMessage
          </a>
        </p>
        
        {/* Câu Hỏi Thường Gặp (FAQ) */}
        <h2 className="text-2xl font-semibold mt-6">5. Câu Hỏi Thường Gặp (FAQ)</h2>
        <ul className="list-disc ml-5 text-sm">
          {/* <li><b>Có thể xóa ảnh/video đã tải lên không?</b> Có, bạn có thể xóa bất kỳ tệp nào từ trang quản lý tệp của mình.</li> */}
          <li><b>Trang web hỗ trợ các trình duyệt nào?</b> Trang web hỗ trợ tất cả các trình duyệt hiện đại như Chrome, Firefox, Safari, Edge.</li>
          <li><b>Thông tin người dùng có được lưu lại không?</b> Hoàn toàn không. Tôi cam kết không lưu trữ bất kỳ thông tin cá nhân nào của bạn.</li>
          <li><b>Mã nguồn API?</b> Hãy liên hệ qua email nếu bạn muốn tìm hiểu hoặc tích hợp API từ Locket.</li>
        </ul>

        {/* Cam Đoan Bảo Mật */}
        <h2 className="text-2xl font-semibold mt-6">6. Chính Sách Bảo Mật</h2>
        <p className="text-sm">
          Locket Pro cam kết bảo mật thông tin tài khoản của bạn. Tất cả các tệp tin và dữ liệu mà bạn tải lên sẽ được bảo vệ bằng các biện pháp an toàn, và tôi không lưu trữ bất kỳ thông tin nhạy cảm nào liên quan đến tài khoản của bạn. Tôi luôn nỗ lực để đảm bảo rằng các thông tin cá nhân và tài khoản của bạn được bảo vệ một cách an toàn nhất.
        </p>

        {/* Liên Hệ */}
        <h2 className="text-2xl font-semibold mt-6">7. Liên Hệ</h2>
        <p className="text-sm">Nếu bạn có bất kỳ câu hỏi hoặc vấn đề gì, vui lòng liên hệ với tôi qua email: <a href="mailto:doibncm2003@gmail.com" className="text-blue-500">doibncm2003@gmail.com</a>.</p>
      </div>
    </div>
  );
};

export default Docs;

import React from "react";
import { ScrollText } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Giới thiệu dịch vụ",
      content: [
        "Locket Dio là nền tảng cung cấp các công cụ, tiện ích và dịch vụ hỗ trợ liên quan đến hệ sinh thái Locket, bao gồm nhưng không giới hạn:",
        [
          "Đăng tải và quản lý ảnh/video/moments",
          "Các tiện ích mở rộng và công cụ hỗ trợ người dùng",
          "Dịch vụ thành viên trả phí và tính năng nâng cao",
          "Các tính năng thử nghiệm, beta hoặc preview",
        ],
      ],
    },
    {
      title: "2. Tài khoản người dùng",
      content: [
        "Khi đăng ký tài khoản tại Locket Dio, bạn đồng ý rằng:",
        [
          "Thông tin cung cấp là chính xác và đầy đủ",
          "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập",
          "Mọi hoạt động phát sinh từ tài khoản của bạn được xem là do bạn thực hiện",
          "Bạn phải thông báo ngay nếu phát hiện truy cập trái phép",
        ],
        "Người dùng tự chịu trách nhiệm đối với việc bảo vệ tài khoản, thông tin đăng nhập và các thiết bị liên quan. Chúng tôi không chịu trách nhiệm cho tổn thất phát sinh từ việc người dùng để lộ, chia sẻ hoặc bảo mật không đầy đủ thông tin truy cập của mình.",
      ],
    },
    {
      title: "3. Nội dung người dùng",
      content: [
        "Người dùng chịu hoàn toàn trách nhiệm đối với nội dung đăng tải lên hệ thống.",
        [
          "Bạn sở hữu hoặc có quyền hợp pháp với nội dung tải lên",
          "Nội dung không vi phạm pháp luật hoặc quyền bên thứ ba",
          "Không chứa mã độc hoặc nội dung gây hại",
        ],
      ],
    },
    {
      title: "4. Hành vi bị nghiêm cấm",
      content: [
        [
          "Sử dụng dịch vụ cho mục đích bất hợp pháp",
          "Can thiệp, phá hoại hoặc làm gián đoạn hệ thống",
          "Khai thác lỗi, bypass bảo mật hoặc lạm dụng API",
          "Spam liên tục, auto click hoặc lạm dụng tính năng vượt quá mục đích sử dụng thông thường",
          "Sử dụng bot, script, macro hoặc công cụ tự động hóa trái phép",
          "Đăng tải nội dung độc hại, phản cảm hoặc lừa đảo",
          "Mạo danh cá nhân/tổ chức khác",
        ],
      ],
    },
    {
      title: "5. Gói thành viên & Thanh toán",
      content: [
        "Một số tính năng yêu cầu đăng ký gói thành viên trả phí.",
        [
          "Thanh toán đầy đủ theo mức giá hiển thị",
          "Quyền lợi chỉ áp dụng trong thời hạn hiệu lực",
          "Các khoản thanh toán mặc định không hoàn lại nếu không có quy định khác",
        ],
      ],
    },
    {
      title: "6. Tính năng Beta / Preview",
      content: [
        [
          "Có thể chưa hoàn thiện hoặc phát sinh lỗi",
          "Có thể thay đổi hoặc bị gỡ bỏ bất kỳ lúc nào",
          "Không đảm bảo hoạt động ổn định như tính năng chính thức",
        ],
      ],
    },
    {
      title: "7. Quyền sở hữu trí tuệ",
      content: [
        "Toàn bộ thương hiệu, giao diện, mã nguồn, thiết kế và tài sản trí tuệ liên quan đến Locket Dio thuộc quyền sở hữu của chúng tôi.",
      ],
    },
    {
      title: "8. Giới hạn trách nhiệm",
      content: [
        [
          "Mất dữ liệu hoặc gián đoạn dịch vụ",
          "Thiệt hại phát sinh từ lỗi hệ thống/bảo trì",
          "Hành vi của người dùng khác hoặc bên thứ ba",
        ],
      ],
    },
    {
      title: "9. Chấm dứt hoặc hạn chế truy cập",
      content: [
        "Chúng tôi (Locket Dio) có quyền khóa, giới hạn hoặc chấm dứt quyền truy cập của người dùng đối với dịch vụ trong trường hợp phát hiện vi phạm Điều Khoản Sử Dụng hoặc hành vi gây ảnh hưởng tiêu cực đến hệ thống mà không cần báo trước.",
        "Ngoài ra, các hành vi vi phạm nghiêm trọng hoặc lạm dụng liên quan đến hệ sinh thái bên thứ ba có thể dẫn đến việc tài khoản của bạn bị xử lý bởi chủ sở hữu nền tảng tương ứng, bao gồm nhưng không giới hạn ở Locket Widget.",
      ],
    },
    {
      title: "10. Dịch vụ bên thứ ba",
      content: [
        "Một số tính năng có thể phụ thuộc vào dịch vụ hoặc nền tảng bên thứ ba. Chúng tôi không chịu trách nhiệm đối với sự gián đoạn, thay đổi hoặc hành vi từ các bên thứ ba đó.",
      ],
    },
    {
      title: "11. Cập nhật điều khoản",
      content: [
        "Điều khoản có thể được cập nhật bất kỳ lúc nào. Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận phiên bản mới nhất.",
      ],
    },
    {
      title: "12. Thay đổi dịch vụ",
      content: [
        "Chúng tôi có quyền sửa đổi, giới hạn hoặc ngừng cung cấp bất kỳ tính năng, gói dịch vụ hoặc nội dung nào vào bất kỳ thời điểm nào mà không cần báo trước.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 px-4 sm:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ScrollText className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Điều Khoản Sử Dụng
          </h1>

          <p className="text-base-content/60 mt-3 text-sm sm:text-base">
            Cập nhật lần cuối: 15/04/2026
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <section
              key={idx}
              className="group rounded-3xl border border-base-300/70 bg-base-200/30 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary/20"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-base-content">
                {section.title}
              </h2>

              <div className="space-y-2 text-base-content/75 leading-8">
                {section.content.map((item, i) =>
                  Array.isArray(item) ? (
                    <ul key={i} className="list-disc pl-6 marker:text-primary">
                      {item.map((li, j) => (
                        <li key={j}>{li}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i}>{item}</p>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Footer Notice */}
        <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 px-6 py-5 text-center">
          <p className="text-sm sm:text-base text-base-content/70 leading-7">
            Bằng việc sử dụng <span className="font-semibold">Locket Dio</span>,
            bạn xác nhận rằng mình đã đọc, hiểu và đồng ý với toàn bộ Điều Khoản
            Sử Dụng này.
          </p>
        </div>
      </div>
    </div>
  );
}

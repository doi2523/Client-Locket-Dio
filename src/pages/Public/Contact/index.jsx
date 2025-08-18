import React from "react";
import { Mail, MapPin } from "lucide-react";
import MailForm from "@/components/ui/SupportForms/MailForm";

export default function Contact() {
  const communityLinks = [
    {
      name: "Discord",
      icon: (
        <img
          src="https://img.icons8.com/?size=100&id=D2NqKl85S8Ye&format=png"
          alt="Discord"
          className="w-8 h-8"
        />
      ),
      url: "https://discord.com/invite/47buy9nMGc",
    },
    {
      name: "Telegram",
      icon: (
        <img
          src="https://img.icons8.com/?size=100&id=oWiuH0jFiU0R&format=png"
          alt="Telegram"
          className="w-8 h-8"
        />
      ),
      url: "https://t.me/ddevdio",
    },
    {
      name: "Messenger",
      icon: (
        <img
          src="https://cdn-icons-png.flaticon.com/128/5968/5968771.png"
          alt="Messenger"
          className="w-8 h-8"
        />
      ),
      url: "https://m.me/cm/AbYPtgRiGe2fInEf",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold text-base-content drop-shadow-sm">
            Liên hệ & Hỗ trợ
          </h1>
          <p className="mt-3 text-base-content/70 text-lg">
            Kết nối với <span className="font-semibold">Đào Văn Đôi (Dio)</span>{" "}
            - Tác giả <span className="font-semibold">Locket Dio</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="bg-base-100 w-full flex flex-col items-center justify-start p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 animate-slideUp">
            <img
              src="https://cdn.locket-dio.com/v1/images/avt/avtdio.webp"
              alt="Đào Văn Đôi"
              className="w-28 h-28 rounded-full object-cover border-4 border-base-300 mb-4 shadow-md hover:scale-105 transition duration-300"
            />
            <h2 className="text-xl font-bold">Đào Văn Đôi</h2>
            <p className="mt-1 text-sm text-base-content/70">
              Full-stack Developer
            </p>
          </div>

          {/* Contact Info & Social */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Contact */}
            <div className="bg-base-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 animate-slideUp delay-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail size={18} /> Liên hệ chính
              </h3>
              <a
                href="mailto:doibncm2003@gmail.com"
                className="btn btn-outline w-full justify-start gap-3 hover:scale-[1.02] transition"
              >
                <Mail size={18} /> doibncm2003@gmail.com
              </a>
            </div>

            {/* Community Links */}
            <div className="bg-base-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 animate-slideUp delay-200">
              <h3 className="text-lg font-semibold mb-4">Liên kết cộng đồng</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 text-center">
                {communityLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-3 rounded-lg bg-base-200 hover:bg-base-300 transition transform hover:-translate-y-1 hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    {link.icon}
                    <span className="text-xs mt-2">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-base-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 animate-slideUp delay-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin size={18} /> Thông tin hỗ trợ
              </h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Thời gian hỗ trợ: 8h-20h</li>
                <li>• Phản hồi: 2-8 giờ</li>
                <li>• Ngôn ngữ: Tiếng Việt</li>
              </ul>
            </div>
          </div>
        </div>
        <MailForm />

        {/* Footer */}
        <div className="text-center mt-10 text-sm text-base-content/60 animate-fadeIn">
          © 2025 Locket Dio. Made with ❤️ by Đào Văn Đôi
        </div>
      </div>
    </div>
  );
}

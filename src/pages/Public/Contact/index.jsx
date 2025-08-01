import React from "react";
import {
  FaGithub,
  FaFacebook,
  FaLinkedin,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";

export default function Contact() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-3xl p-4 text-center">
        {/* SEO Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Liên hệ với <span className="text-purple-600">Đào Văn Đôi (Dio)</span>
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Tác giả dự án <strong>Locket Dio</strong> – Sáng tạo, đơn giản và hiện
          đại.
        </p>

        {/* Avatar */}
        <div className="mb-6">
          <img
            src="./images/avtdio.jpg"
            alt="Ảnh đại diện Đào Văn Đôi"
            className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-purple-300 shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Thông tin cá nhân */}
        <div className="mb-8 space-y-1">
          <h2 className="text-xl font-semibold text-gray-800">
            Đào Văn Đôi (Dio)
          </h2>
          <p className="text-gray-600 text-sm">
            Frontend & Backend Developer | Người sáng lập Locket Dio
          </p>
        </div>

        {/* Các nút liên hệ */}
        <div className="space-y-3 text-sm">
          <a
            href="mailto:doibncm2003@gmail.com"
            className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg shadow transition font-medium"
          >
            <FaEnvelope /> Gửi email
          </a>

          <a
            href="https://github.com/doi2523"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg shadow transition font-medium"
          >
            <FaGithub /> GitHub
          </a>

          <a
            href="https://locket-dio.space"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg shadow transition font-medium"
          >
            <FaGlobe /> Website Locket Dio
          </a>
        </div>
        <div className="mt-3 text-xs mb-2">hoặc các nền tảng khác</div>
        {/* Mạng xã hội bổ sung */}
        <div className="flex justify-center flex-wrap gap-4">
          <a
            href="https://www.facebook.com/daovandoi2003"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
            title="Facebook"
          >
            <img
              src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png"
              alt="Facebook"
              className="w-8 h-8"
            />
          </a>

          <a
            href="https://www.instagram.com/_am.dio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
            title="Instagram"
          >
            <img
              src="https://img.icons8.com/?size=100&id=BrU2BBoRXiWq&format=png"
              alt="Instagram"
              className="w-8 h-8"
            />
          </a>

          <a
            href="https://discord.com/invite/47buy9nMGc"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
            title="Discord"
          >
            <img
              src="https://img.icons8.com/?size=100&id=D2NqKl85S8Ye&format=png"
              alt="Discord"
              className="w-8 h-8"
            />
          </a>

          <a
            href="https://t.me/dio2523"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
            title="Telegram"
          >
            <img
              src="https://img.icons8.com/?size=100&id=oWiuH0jFiU0R&format=png"
              alt="Telegram"
              className="w-8 h-8"
            />
          </a>

          <a
            href="https://zalo.me/0329254203"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
            title="Zalo"
          >
            <img
              src="https://img.icons8.com/?size=100&id=0m71tmRjlxEe&format=png"
              alt="Zalo"
              className="w-8 h-8"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

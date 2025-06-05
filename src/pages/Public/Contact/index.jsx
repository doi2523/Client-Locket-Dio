import React from "react";

export default function Contact() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 pt-16 flex items-center justify-center">
      <div className="h-16"></div>
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 text-center">
        {/* SEO Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Liên hệ với Đào Văn Đôi (Dio)</h1>
        <p className="text-gray-500 text-sm mb-6">Tác giả dự án Locket Dio - Sáng tạo, đơn giản và hiện đại.</p>

        {/* Avatar */}
        <div className="mb-6">
          <img
            src="./images/avtdio.jpg"
            alt="Ảnh đại diện Đào Văn Đôi"
            className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-purple-200 shadow hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Thông tin cá nhân */}
        <div className="mb-8 space-y-1">
          <h2 className="text-xl font-semibold text-gray-800">Đào Văn Đôi (Dio)</h2>
          <p className="text-gray-600 text-sm">Frontend Developer | Người sáng lập Locket Dio</p>
        </div>

        {/* Các nút liên hệ */}
        <div className="space-y-3">
          <a
            href="mailto:doibncm2003@gmail.com"
            className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg shadow transition font-medium"
          >
            📧 Gửi email
          </a>

          <a
            href="https://github.com/doi2523"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg shadow transition font-medium"
          >
            💻 Xem GitHub
          </a>

          <a
            href="https://locket-dio.space"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg shadow transition font-medium"
          >
            🌐 Truy cập Website Locket Dio
          </a>
        </div>
      </div>
    </section>
  );
}

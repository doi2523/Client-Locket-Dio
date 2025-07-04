import React, { useState, useEffect } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import NotificationPrompt from "../../../components/UI/NotificationPrompt";
import { Download, UserPlus } from "lucide-react";

const Home = () => {
  const [loaded, setLoaded] = useState(false);

  const steps = [
    {
      number: "01",
      icon: "🔐",
      title: "Đăng nhập",
      description: "Đăng nhập bằng tài khoản để sử dụng Locket Camera.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "02",
      icon: "📸",
      title: "Chụp hoặc quay",
      description: "Mở camera ngay trên trình duyệt và ghi lại khoảnh khắc.",
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "03",
      icon: "✍️",
      title: "Thêm caption",
      description: "Viết caption độc đáo hoặc chọn từ caption có sẵn.",
      color: "from-pink-500 to-rose-500",
    },
    {
      number: "04",
      icon: "🚀",
      title: "Chia sẻ ngay",
      description: "Gửi đến bạn bè hoặc lưu lại làm kỷ niệm.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="flex flex-col py-5 items-center justify-center min-h-screen w-full text-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="h-16" />
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-0 gap-x-12 items-start">
          {/* LEFT */}
          <div className="flex flex-col justify-center gap-4 md:gap-6 text-left md:pr-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight relative h-[55px] md:h-[65px] lg:h-[70px]">
              <span className="absolute word-rotate whitespace-nowrap text-white">
                <span>Trải nghiệm</span>
                <span>Khám phá</span>
                <span>Sáng tạo</span>
                <span>Chia sẻ</span>
              </span>
            </h1>
            <h2 className="text-5xl no-select md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
              <span className="bg-clip-text font-lovehouse no-select">
                Locket Camera
              </span>
            </h2>

            <p className="text-white/90 text-base md:text-lg max-w-xl leading-relaxed">
              Trải nghiệm "Locket Camera" ngay trên trình duyệt! Ghi lại khoảnh
              khắc, thêm caption cực chất và chia sẻ tức thì chỉ với vài thao
              tác đơn giản. Hoặc thêm ứng dụng vào màn hình chính của bạn.
            </p>

            <p className="text-white text-base md:text-lg font-medium animate-fade-in delay-200">
              Bạn cần đăng nhập để sử dụng chức năng trên trang này!
            </p>

            <div className="flex flex-wrap gap-3 mt-2 animate-fade-in delay-400">
              <Link
                to={"/login"}
                className="px-8 py-3 bg-white text-blue-600 font-semibold text-base md:text-lg rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Login now
              </Link>
              <Link
                //href="/download" // tuỳ link download bạn xử lý
                className="px-8 py-3 bg-blue-600 text-white font-semibold text-base md:text-lg rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
              >
                Add to Screen
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center animate-fade-in-up animation-delay-500 md:pl-6 no-select">
            <div className="relative transform hover:scale-105 transition-transform duration-500 pt-5">
              <img
                src="/2.png"
                alt="Locket Dio WebApp Preview"
                onLoad={() => setLoaded(true)}
                className={`
            w-full max-w-sm lg:max-w-sm xl:max-w-md h-auto object-contain drop-shadow-2xl
            transition-opacity duration-500 ease-in-out float-up-down 
            ${loaded ? "opacity-100" : "opacity-0"}
          `}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="w-full py-5 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá những tính năng tuyệt vời giúp bạn tạo ra và chia sẻ
              khoảnh khắc đáng nhớ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Chụp & Quay video */}
            <div className="group relative p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📸</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Chụp & Quay video
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Ghi lại khoảnh khắc trực tiếp ngay trên trình duyệt một cách
                  dễ dàng và nhanh chóng, không cần cài đặt ứng dụng phức tạp.
                </p>
              </div>
            </div>

            {/* Feature 2 - Caption sáng tạo */}
            <div className="group relative p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Caption sáng tạo
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Thêm caption cá nhân hóa đầy cảm xúc và phong cách độc đáo.
                  Tạo dấu ấn riêng biệt với mỗi khoảnh khắc đáng nhớ của bạn.
                </p>
              </div>
            </div>

            {/* Feature 3 - Chia sẻ dễ dàng */}
            <div className="group relative p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📤</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Chia sẻ dễ dàng
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Chia sẻ khoảnh khắc tức thì với bạn bè chỉ bằng một cú click
                  đơn giản, không cần tải về hay qua nhiều bước phức tạp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-5 px-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 text-white">
            <div className="inline-block px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-white/20 shadow-sm mb-6">
              <span className="text-sm font-medium text-gray-600">
                Hướng dẫn sử dụng
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Cách sử dụng đơn giản
            </h2>
            <p className="text-lg max-w-2xl mx-auto">
              Chỉ với 4 bước đơn giản, bạn có thể tạo và chia sẻ những khoảnh
              khắc tuyệt vời
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Connection line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0"></div>
                )}

                {/* Step Card */}
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-white/20">
                  {/* Number Badge */}
                  <div
                    className={`absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-lg">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Hover effect overlay */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700">
              <span>Bắt đầu ngay</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-15 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Thống kê về Locket Camera
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                number: "13.5K+",
                label: "Người dùng hoạt động",
                color: "from-blue-400 to-cyan-400",
              },
              {
                number: "20K+",
                label: "Ảnh & Video đã tạo",
                color: "from-purple-400 to-pink-400",
              },
              {
                number: "20GB+",
                label: "Dung lượng sử dụng mỗi ngày",
                color: "from-green-400 to-emerald-400",
              },
              {
                number: "4.3/5★",
                label: "Đánh giá trung bình",
                color: "from-yellow-400 to-orange-400",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}
                >
                  {stat.number}
                </div>
                <p className="text-white/80 text-sm md:text-base font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Bắt đầu hành trình sáng tạo
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Tải xuống Locket Dio ngay hôm nay và khám phá thế giới photography &
            videography đầy màu sắc!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              disabled
              className="px-8 opacity-50 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Tải xuống miễn phí
            </button>
            <a
              href="https://discord.gg/47buy9nMGc"
              target="_blank"
              className="px-8 py-4 bg-white/20 text-white font-bold rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <UserPlus className="w-5 h-5" />
              Tham gia Discord
            </a>
          </div>

          <div className="mt-8 text-white/60 text-sm">
            Dễ sử dụng • Không quảng cáo • Bảo mật thông tin
          </div>
        </div>
      </section>

      {/* 👉 Component xin thông báo */}
      <NotificationPrompt />
    </div>
  );
};

export default Home;

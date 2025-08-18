import { lazy, Suspense, useState } from "react";
import { Download, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import "./styles.css";
const NotificationPrompt = lazy(() => import("@/components/ui/NotificationPrompt"));
const FeatureCardMarquee = lazy(() => import("@/components/ui/Marquee/FeatureCardMarquee"));
const StepsSection = lazy(() => import("./StepsSection"));

const Home = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col py-5 items-center justify-center min-h-screen w-full text-center bg-gradient-to-r from-blue-400 to-purple-500">
      <section className="w-full max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-0 gap-x-12 items-start">
          {/* LEFT */}
          <div className="flex flex-col justify-center gap-4 md:gap-6 text-left md:pr-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight relative h-[55px] md:h-[65px] lg:h-[70px]">
              <span className="absolute word-rotate  whitespace-nowrap text-white">
                <span>Trải nghiệm</span>
                <span>Khám phá</span>
                <span>Sáng tạo</span>
                <span>Chia sẻ</span>
              </span>
            </h1>
            <h2 className="text-5xl inline-block no-select md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight -mb-3">
              <span className="wave-effect inline-block no-select">
                {"Locket Camera".split("").map((char, i) => (
                  <span
                    key={i}
                    className="gradient-text-v2"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            </h2>

            <p className="text-white/90 text-base md:text-lg leading-relaxed">
              Trải nghiệm "Locket Camera" ngay trên trình duyệt! Ghi lại khoảnh
              khắc, thêm caption cực chất và chia sẻ tức thì chỉ với vài thao
              tác đơn giản. Hoặc thêm ứng dụng vào màn hình chính của bạn.
            </p>

            <p className="text-white text-base md:text-lg font-medium animate-fade-in delay-200">
              Bạn cần đăng nhập để sử dụng chức năng trên trang này!
            </p>
            <p className="text-white/60 text-sm italic">
              Locket Dio là một dự án cá nhân hoạt động độc lập. Mọi hoạt động
              trên trang không liên kết với bất kỳ bên thứ ba nào, trừ khi có
              thông báo từ Dio.
            </p>

            <div className="flex flex-wrap gap-3 mt-2 animate-fade-in delay-400">
              <Link
                to={"/login"}
                className="px-8 py-3 bg-white text-blue-600 font-semibold text-base md:text-lg rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Login now
              </Link>
              <Link
                to={"/download"} // tuỳ link download bạn xử lý
                className="px-8 py-3 rotate-[3deg] gradient-effect text-white font-semibold text-base md:text-lg rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
              >
                Add to Screen
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center animate-fade-in-up animation-delay-500 md:pl-6 no-select">
            <div className="relative transform hover:scale-105 transition-transform duration-500 pt-6.5">
              <img
                src="https://cdn.locket-dio.com/v1/images/double-phone-view-locketdio.webp"
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
      </section>

      <section className="w-full py-5">
        <div className="mx-auto drop-shadow-lg">
          <div className="text-center py-5">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Khám phá những tính năng tuyệt vời giúp bạn tạo ra và chia sẻ
              khoảnh khắc đáng nhớ.
            </p>
          </div>
          <Suspense fallback={null}>
            <FeatureCardMarquee />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={null}>
        <StepsSection />{" "}
      </Suspense>

      {/* Stats Section */}
      <section className="pb-10 px-4">
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
            Cài đặt hoặc thêm Locket Dio vào màn hình chính ngay hôm nay và khám
            phá thế giới photography & videography đầy màu sắc!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={"/download"}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Cài đặt miễn phí
            </Link>
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

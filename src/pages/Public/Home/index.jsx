import "./styles.css";
import { lazy, Suspense, useState } from "react";
import { Download, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { COMMUNITY_CONFIG } from "@/config";
const StatsSection = lazy(() => import("./StatsSection"));
const NotificationPrompt = lazy(() =>
  import("@/components/ui/NotificationPrompt")
);
const FeatureCardMarquee = lazy(() => import("./FeatureCardMarquee"));
const StepsSection = lazy(() => import("./StepsSection"));

const Home = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full text-center bg-grid bg-base-100">
      <section className="w-full max-w-screen-2xl mx-auto px-4 pt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-y-0 gap-x-12 items-center min-h-[84vh]">
          {/* LEFT */}
          <div className="flex flex-col justify-center gap-4 md:gap-6 text-left md:pr-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-base-content leading-tight tracking-tight relative h-[55px] md:h-[65px] lg:h-[70px]">
              <span className="absolute word-rotate whitespace-nowrap text-base-content">
                <span>Trải nghiệm</span>
                <span>Khám phá</span>
                <span>Sáng tạo</span>
                <span>Chia sẻ</span>
              </span>
            </h1>

            <h2 className="text-5xl inline-block no-select md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight -mb-3">
              <span className="no-select font-purrfect text-base-content">
                Locket Camera
              </span>
            </h2>

            <p className="text-base-content/90 text-base md:text-lg leading-relaxed">
              Ghi lại khoảnh khắc, thêm caption cực chất và chia sẻ ngay tức thì
              – tất cả chỉ với vài thao tác đơn giản trên <b>Locket Camera</b>.
              Bạn có thể dùng trực tiếp trên trình duyệt hoặc thêm ứng dụng vào
              màn hình chính để tiện lợi hơn.
            </p>

            <p className="text-base-content/80 text-sm italic">
              “Locket Dio” là dự án cá nhân, hoạt động độc lập. Không liên kết
              với bên thứ ba nào trừ khi có thông báo chính thức từ Dio.
            </p>

            <p className="text-base-content/90 text-sm font-semibold space-y-1">
              <span className="block">
                ❗ Mọi giao dịch mua bán “quyền sử dụng” hay “truy cập web”
                không do Dio ủy quyền đều là <b>gian lận</b>.
              </span>
              <span className="block">
                • Nếu bạn phải trả phí để truy cập trang web này thì thì đó là
                dấu hiệu của scam (lừa đảo).
              </span>
              <span className="block">
                • Nếu phát hiện ai đó đang kinh doanh website này, vui lòng báo
                cáo với{" "}
                <Link to={"/contact"} className="underline">
                  Quản trị viên
                </Link>
                .
              </span>
            </p>

            <div className="flex flex-wrap gap-3 mt-2 animate-fade-in delay-400">
              <Link
                to={"/login"}
                className="
                  px-5 py-3
                  rounded-full
                  font-semibold
                  text-base-content
                  bg-base-100/20
                  border border-base-content/10
                  backdrop-blur-[2px]
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-md
                  hover:bg-base-100
                  active:scale-95
                "
              >
                Đăng nhập ngay
              </Link>

              <Link
                to={"/download"}
                className="px-4 py-3 rotate-[1deg] gradient-effect text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
              >
                Thêm vào màn hình
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-center h-full w-full md:pl-6 no-select -mb-10">
            <div className="relative transform hover:scale-105 transition-transform duration-500">
              <img
                src="https://cdn.locket-dio.com/v1/images/double-phone-view-locketdio.webp"
                alt="Locket Dio WebApp Preview"
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`
            md:w-[380px] lg:w-[400px] h-auto object-contain 
            drop-shadow-2xl transition-opacity duration-500 ease-in-out float-up-down
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
            <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg md:text-xl text-base-content/80 mb-8 max-w-2xl mx-auto">
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
      <Suspense fallback={null}>
        <StatsSection />
      </Suspense>

      {/* CTA Section */}
      <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-content mb-6">
            Bắt đầu hành trình sáng tạo
          </h2>
          <p className="text-lg md:text-xl text-base-content/80 mb-8 max-w-2xl mx-auto">
            Cài đặt hoặc thêm Locket Dio vào màn hình chính ngay hôm nay và khám
            phá thế giới photography & videography đầy màu sắc!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={"/download"}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Cài đặt miễn phí
            </Link>
            <a
              href={COMMUNITY_CONFIG.discord}
              target="_blank"
              className="px-8 py-4 bg-base-100/20 backdrop-blur-[2px] border-base-content/10 border text-base-content font-bold rounded-3xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Tham gia Discord
            </a>
          </div>

          <div className="mt-8 text-base-content/60 text-sm">
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

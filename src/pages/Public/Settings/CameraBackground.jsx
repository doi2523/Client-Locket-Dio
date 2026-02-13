import "swiper/css";
import "swiper/css/effect-coverflow";
import { lazy, Suspense, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { useUIStore } from "@/stores/useUIStore";
import { getAllBackgroundCamera } from "@/services";
const BgLocketDio = lazy(() => import("@/components/Effects/BgLocketDio"));

const CameraBackground = () => {
  const [backgrounds, setBackgroundState] = useState([]);
  const setBackground = useUIStore((s) => s.setBackground);
  const background = useUIStore((s) => s.background);

  const activeIndex = Math.max(
    backgrounds.findIndex((bg) => bg.id === background?.id),
    0,
  );

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const result = await getAllBackgroundCamera();
        // Thêm frame mặc định vào đầu danh sách
        const apiFrames = result || [];
        const defaultFrame = [
          {
            id: 0,
            name: "Không có",
            url: null,
          },
        ];
        setBackgroundState([
          ...defaultFrame,
          ...apiFrames.filter((f) => f.id !== 0),
        ]);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nền:", err);
        // Nếu lỗi API, vẫn hiển thị frame mặc định
        const defaultFrame = [
          {
            id: 0,
            name: "Không có",
            url: null,
          },
          {
            id: 1,
            name: "Sắp ra mắt",
            url: null,
          },
        ];
        setBackgroundState(defaultFrame);
      }
    };

    fetchBackground();
  }, []);

  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    if (swiper && activeIndex >= 0) {
      swiper.slideTo(activeIndex);
    }
  }, [activeIndex, swiper]);

  return (
    <div className="w-full flex justify-center overflow-hidden">
      <div className="h-full max-w-md">
        <h1 className="font-lovehouse text-base-content text-center text-3xl font-semibold">
          Camera Background
        </h1>

        <Swiper
          direction="horizontal"
          modules={[EffectCoverflow]}
          effect={"coverflow"}
          centeredSlides={true}
          onSwiper={setSwiper}
          initialSlide={activeIndex}
          coverflowEffect={{
            rotate: 50,
            stretch: 20,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          slidesPerView={2}
          spaceBetween={20}
          className="w-full mt-4 px-3"
        >
          {backgrounds.map((bg) => {
            const isActive = bg.id === background?.id;

            return (
              <SwiperSlide key={bg.id}>
                <div
                  onClick={() => {
                    if (!isActive) {
                      setBackground(bg);
                    }
                  }}
                  className={`
                    flex flex-col justify-between items-center
                    aspect-[9/16] gap-3 space-y-3 w-full py-1
                    rounded-3xl
                    bg-base-100
                    transition-all duration-300 relative
                    ${
                      isActive
                        ? "outline-2 outline-primary scale-95 opacity-80"
                        : "cursor-not-allowed"
                    }
                  `}
                >
                  {/* <div className=" rounded-3xl overflow-hidden"> */}
                  <Suspense fallback={null}>
                    <BgLocketDio bgSrc={bg.url} />
                  </Suspense>
                  {/* </div> */}
                  {/* ===== TOP BAR ===== */}
                  <div className="w-full z-10 flex flex-row justify-between items-center p-2 relative">
                    <div className="w-6 h-6 bg-base-300 rounded-full" />
                    <div className="absolute mx-auto left-1/2 -translate-x-1/2 w-20 h-6 rounded-2xl bg-base-300" />
                    <div className="flex flex-row gap-1">
                      <div className="w-6 h-6 bg-base-300 rounded-full" />
                      <div className="w-6 h-6 bg-base-300 rounded-full" />
                    </div>
                  </div>

                  {/* ===== MAIN CONTENT ===== */}
                  <div className="w-full z-10 aspect-square bg-base-200 rounded-4xl relative" />

                  {/* ===== ACTION BAR ===== */}
                  <div className="w-full z-10 flex flex-row justify-between items-center px-6 relative">
                    <div className="w-6 h-6 bg-base-300 rounded-full" />
                    <div className="w-9 h-9 rounded-full ring-2 text-primary flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full camera-inner-circle" />
                    </div>
                    <div className="w-6 h-6 bg-base-300 rounded-full" />
                  </div>

                  {/* ===== BOTTOM INFO ===== */}
                  <div className="flex z-10 flex-row gap-1 items-center justify-center p-1 relative">
                    <div className="w-4 h-4 rounded-2xl bg-base-300" />
                    <div className="w-10 h-4 rounded-2xl bg-base-300" />
                  </div>
                  <div className="relative h-[3px] bg-base-300 w-15 rounded-2xl"></div>
                </div>
                {/* ===== THEME NAME ===== */}
                <div
                  className={`pt-2 text-center text-sm font-semibold ${
                    isActive ? "text-primary" : "text-base-content/70"
                  }`}
                >
                  {bg?.name || "Không có"}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default CameraBackground;

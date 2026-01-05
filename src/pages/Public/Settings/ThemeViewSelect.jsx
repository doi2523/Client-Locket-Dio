import { CONFIG } from "@/config";
import { useTheme } from "@/hooks/useTheme";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";

const ThemeSelector = () => {
  const { theme, changeTheme } = useTheme();
  const activeIndex = CONFIG.ui.themes.indexOf(theme);

  return (
    <div className="w-full flex justify-center overflow-hidden">
      <div className="h-full max-w-2xl">
        <h1 className="font-lovehouse text-base-content text-center text-3xl font-semibold">
          Setting Theme
        </h1>

        <Swiper
          direction="horizontal"
          modules={[EffectCoverflow]}
          effect={"coverflow"}
          initialSlide={activeIndex}
          centeredSlides={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 20,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          slidesPerView={3}
          spaceBetween={20}
          className="w-full mt-4 px-3"
        >
          {CONFIG.ui.themes.map((t) => {
            const isActive = theme === t;

            return (
              <SwiperSlide key={t}>
                <div
                  onClick={() => {
                    if (!isActive) changeTheme(t);
                  }}
                  data-theme={t}
                  className={`
                    flex flex-col justify-between items-center
                    aspect-[9/16] gap-3 space-y-3 w-full py-1
                    rounded-3xl
                    bg-base-100
                    transition-all duration-300
                    ${
                      isActive
                        ? "outline-2 outline-primary scale-95 opacity-70 cursor-not-allowed"
                        : "cursor-pointer hover:scale-[0.98]"
                    }
                  `}
                >
                  {/* ===== TOP BAR ===== */}
                  <div className="w-full flex flex-row justify-between items-center p-2 relative">
                    <div className="w-6 h-6 bg-base-300 rounded-full" />
                    <div className="absolute mx-auto left-1/2 -translate-x-1/2 w-20 h-6 rounded-2xl bg-base-300" />
                    <div className="flex flex-row gap-1">
                      <div className="w-6 h-6 bg-base-300 rounded-full" />
                      <div className="w-6 h-6 bg-base-300 rounded-full" />
                    </div>
                  </div>

                  {/* ===== MAIN CONTENT ===== */}
                  <div className="w-full aspect-square bg-base-200 rounded-4xl" />

                  {/* ===== ACTION BAR ===== */}
                  <div className="w-full flex flex-row justify-between items-center px-6">
                    <div className="w-6 h-6 bg-base-300 rounded-full" />
                    <div className="w-10 h-10 rounded-full border-2 border-base-content/50 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-base-content" />
                    </div>
                    <div className="w-6 h-6 bg-base-300 rounded-full" />
                  </div>

                  {/* ===== BOTTOM INFO ===== */}
                  <div className="flex flex-row gap-1 items-center justify-center p-1">
                    <div className="w-4 h-4 rounded-2xl bg-base-300" />
                    <div className="w-10 h-4 rounded-2xl bg-base-300" />
                  </div>
                  <div className="h-[3px] bg-base-300 w-15 rounded-2xl"></div>
                </div>
                {/* ===== THEME NAME ===== */}
                <div
                  className={`mt-2 text-center text-sm font-semibold ${
                    isActive ? "text-primary" : "text-base-content/70"
                  }`}
                >
                  {t}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default ThemeSelector;

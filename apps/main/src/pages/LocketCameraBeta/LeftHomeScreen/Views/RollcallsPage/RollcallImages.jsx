import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { useState } from "react";
import "swiper/css";
import "swiper/css/effect-cards";
import { Loader2, SmilePlus } from "lucide-react";
import { getImageSrc } from "@/utils/replace/replaceUrl";
import { replaceFirebaseWithCDN } from "@/utils/replace/replaceFirebaseWithCDN";

function RollcallImages({ items, onActiveChange }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = items.length;

  if (!total) return null;

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden">
      <Swiper
        effect="cards"
        grabCursor
        modules={[EffectCards]}
        className="w-78 sm:w-78 aspect-[3/4]"
        cardsEffect={{
          rotate: true,
          perSlideOffset: 10,
          perSlideRotate: 1,
          slideShadows: false,
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
          onActiveChange?.(items[swiper.activeIndex]);
        }}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <SwiperSlide key={item.uid}>
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                {/* IMAGE */}
                <LazyImage src={replaceFirebaseWithCDN(item.main_url)} alt="" />

                {/* COUNTER – chỉ slide active */}
                {isActive && (
                  <div className="absolute font-semibold top-2 right-2 bg-base-300/80 backdrop-blur px-3 py-1 rounded-full text-sm">
                    {activeIndex + 1}/{total}
                  </div>
                )}

                {/* OPEN REACTION MODAL */}
                {isActive && (
                  <ReactionButton onClick={() => console.log("open modal")} />
                )}

                {/* LIST EMOJI REACTIONS */}
                {isActive && <ReactionList reactions={item.reactions} />}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default RollcallImages;

function ReactionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        absolute bottom-2 right-2
        bg-base-100/80 backdrop-blur
        p-2 rounded-full
      "
    >
      <SmilePlus className="w-6 h-6" />
    </button>
  );
}

function ReactionList({ reactions = [] }) {
  if (!reactions.length) return null;

  return (
    <div className="absolute bottom-4 left-4 flex">
      {reactions.map((r) => (
        <span
          key={r.uid}
          style={{
            transform: `
              translate(${r.x * 10}px, ${r.y * 10}px)
              rotate(${r.rotation}rad)
              scale(${r.scale})
            `,
          }}
          className="text-2xl select-none"
        >
          {r.reaction}
        </span>
      ))}
    </div>
  );
}

function LazyImage({ src, alt = "", className = "" }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-base-300 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin opacity-70" />
          <span className="text-sm opacity-70">Đang tải…</span>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`
          w-full h-full object-cover
          transition-opacity duration-300
          ${loaded ? "opacity-100" : "opacity-0"}
          ${className}
        `}
      />
    </div>
  );
}

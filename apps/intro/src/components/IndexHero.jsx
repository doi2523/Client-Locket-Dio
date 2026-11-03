import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BestSvg, FriendsSvg, FirstSvg, LocketIconBadge, LocketWordmark } from './IntroSvgs';

const STAMP_WORDS = [
  { label: 'Best', Component: BestSvg, naturalW: 233, rot: -3, offsetX: -4 },
  { label: 'Friends', Component: FriendsSvg, naturalW: 397, rot: 1, offsetX: 0 },
  { label: 'First', Component: FirstSvg, naturalW: 263, rot: -2.5, offsetX: 5 },
];

export function IndexHero({ onIntroComplete }) {
  const [wordCount, setWordCount] = useState(0);
  const [kickId, setKickId] = useState(0);
  const [isStampingForward, setIsStampingForward] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [introKey, setIntroKey] = useState(0);

  // Run the two-stage kinetic intro animation sequence
  const startIntroSequence = () => {
    setWordCount(0);
    setKickId(0);
    setIsStampingForward(false);
    setHeroRevealed(false);

    // Stage 1: Word stamps pop in one by one with spring physics & smooth layout re-centering
    const t1 = setTimeout(() => {
      setWordCount(1);
    }, 350);

    const t2 = setTimeout(() => {
      setWordCount(2);
      setKickId(1);
    }, 850);

    const t3 = setTimeout(() => {
      setWordCount(3);
      setKickId(2);
    }, 1350);

    // Stage 1.5: Punch forward & collapse down with motion blur
    const t4 = setTimeout(() => {
      setIsStampingForward(true);
    }, 1900);

    // Stage 2: Hero Card & Open Web Button emerge in center
    const t5 = setTimeout(() => {
      setHeroRevealed(true);
      if (onIntroComplete) onIntroComplete();
    }, 2450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  };

  useEffect(() => {
    return startIntroSequence();
  }, [introKey]);

  // Re-trigger intro animation
  const replayIntro = () => {
    setIntroKey((prev) => prev + 1);
  };

  return (
    <div className="relative w-full h-full h-[100dvh] overflow-hidden flex items-center justify-center bg-[#FFE091] text-[#1A1200] select-none">
      {/* Warm Ambient Glow at Top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[50dvh] bg-gradient-to-b from-[#FFB800]/40 via-[#FFE091]/60 to-transparent"
        aria-hidden="true"
      />

      {/* ======================================================== */}
      {/* HEADER: CHỈ HIỆN KHI INTRO ĐÃ KẾT THÚC (heroRevealed)    */}
      {/* Bên trái: icon + Locket x Dio. Bên phải: Replay Intro     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {heroRevealed && (
          <motion.header
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{
              paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))',
              paddingLeft: 'max(1.25rem, env(safe-area-inset-left, 1.25rem))',
              paddingRight: 'max(1.25rem, env(safe-area-inset-right, 1.25rem))',
            }}
            className="fixed top-0 inset-x-0 z-50 flex items-center justify-between pointer-events-auto"
          >
            {/* Bên trái: Icon + Locket x Dio */}
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 overflow-hidden flex-shrink-0">
                <LocketIconBadge className="w-full h-full" />
              </div>
              <span className="font-black text-xl sm:text-2xl text-[#1A1200] tracking-tight">
                Locket x Dio
              </span>
            </div>

            {/* Bên phải: Replay Intro */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={replayIntro}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black/10 hover:bg-black/15 text-[#1A1200] font-bold text-sm sm:text-base backdrop-blur-md transition-all cursor-pointer shadow-sm border border-black/5"
              title="Chạy lại hiệu ứng intro mở màn"
            >
              <span>↺</span>
              <span>Replay Intro</span>
            </motion.button>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* TẦNG 1: Kinetic Typography Stamp "Best Friends First"   */}
      {/* Căn giữa tuyệt đối với 100dvh trên Safari                */}
      {/* ======================================================== */}
      <AnimatePresence>
        {!heroRevealed && (
          <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none px-4">
            <motion.div
              layout
              animate={
                isStampingForward
                  ? {
                      scale: [1, 1.25, 0.08],
                      opacity: [1, 1, 0],
                      filter: ['blur(0px)', 'blur(0px)', 'blur(18px)'],
                    }
                  : { scale: 1, opacity: 1, filter: 'blur(0px)' }
              }
              transition={
                isStampingForward
                  ? {
                      duration: 0.55,
                      times: [0, 0.35, 1],
                      ease: ['easeOut', [0.55, 0, 1, 0.55]],
                    }
                  : {
                      layout: { type: 'spring', stiffness: 220, damping: 18 },
                      duration: 0.2,
                    }
              }
              className="relative flex flex-col items-center justify-center gap-2.5 sm:gap-4 w-[min(88vw,560px)] will-change-transform"
            >
              {STAMP_WORDS.slice(0, wordCount).map((word, idx) => {
                const isPrevious = idx < wordCount - 1;
                const widthPercent = (word.naturalW / 397) * 100;

                return (
                  <motion.div
                    key={word.label}
                    layout
                    transition={{
                      layout: { type: 'spring', stiffness: 220, damping: 18 },
                    }}
                    style={{ width: `${widthPercent}%` }}
                    className="flex justify-center"
                  >
                    {/* Middle layer: entry rotation & spring drop */}
                    <motion.div
                      initial={{
                        scale: 0,
                        opacity: 0,
                        rotate: word.rot + 14 * (idx % 2 === 0 ? -1 : 1),
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        rotate: word.rot,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 240,
                        damping: 14,
                        opacity: { duration: 0.12 },
                      }}
                      style={{ x: `${word.offsetX}%` }}
                      className="w-full text-white drop-shadow-[0_10px_32px_rgba(0,0,0,0.22)]"
                    >
                      {/* Inner layer: recoil bounce kick when next words land */}
                      <motion.div
                        key={`kick-${kickId}-${word.label}`}
                        animate={
                          isPrevious
                            ? {
                                y: [0, -10, 0],
                                rotate: [0, 2 * (idx % 2 === 0 ? -1 : 1), 0],
                              }
                            : {}
                        }
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      >
                        <word.Component className="block w-full h-auto" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* TẦNG 2: Stickers Visual, Tiêu đề, Logo tên & Nút Open Web */}
      {/* Căn chính giữa khung nhìn Safari (100dvh)                */}
      {/* ======================================================== */}
      <div
        className={`relative z-20 flex flex-col items-center justify-center w-full h-full h-[100dvh] transition-opacity duration-500 ${
          heroRevealed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          '--phone-vw': 'min(86vw, 360px)',
          '--phone-svh': 'min(42svh, 380px)',
          '--stack-top': 'max(4.5rem, calc(env(safe-area-inset-top, 0px) + 3.5rem))',
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={heroRevealed ? { scale: 1, opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 0.35, ease: 'easeOut' },
          }}
          className="relative will-change-transform flex flex-col items-center justify-center w-full max-w-lg px-4"
        >
          {/* Stickers Layer wrapping Center Icon */}
          <div className="relative w-[min(var(--phone-vw),var(--phone-svh))] aspect-[1400/1200] sm:aspect-[1400/1250] flex items-center justify-center">
            {/* Left Sticker: bff.webp */}
            <div
              className="absolute pointer-events-none select-none"
              style={{
                left: '13%',
                top: '52%',
                transform: 'translate(-50%, calc(-50% + 6px))',
              }}
            >
              <div style={{ opacity: 1, transform: 'none' }}>
                <motion.div
                  animate={{ y: [0, 7, 0] }}
                  transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
                >
                  <div style={{ willChange: 'transform, opacity', opacity: 1, transform: 'none' }}>
                    <div
                      style={{
                        width: 'calc(min(var(--phone-vw), var(--phone-svh)) * 0.165)',
                        transform: 'rotate(-5deg)',
                      }}
                    >
                      <img
                        src="/assets/index/stickers/bff.webp"
                        alt=""
                        draggable={false}
                        loading="eager"
                        decoding="async"
                        className="h-auto w-full max-w-none select-none"
                        style={{
                          filter:
                            'drop-shadow(rgba(0, 0, 0, 0.05) 0px 6px 12px) drop-shadow(rgba(0, 0, 0, 0.03) 0px 40px 26px)',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Sticker: heart-flat.webp */}
            <div
              className="absolute pointer-events-none select-none"
              style={{
                left: '85%',
                top: '39%',
                transform: 'translate(-50%, calc(-50% + 0px))',
              }}
            >
              <div style={{ opacity: 1, transform: 'none' }}>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
                >
                  <div style={{ willChange: 'transform, opacity', opacity: 1, transform: 'none' }}>
                    <div
                      style={{
                        width: 'calc(min(var(--phone-vw), var(--phone-svh)) * 0.122)',
                        transform: 'none',
                      }}
                    >
                      <img
                        src="/assets/index/stickers/heart-flat.webp"
                        alt=""
                        draggable={false}
                        loading="eager"
                        decoding="async"
                        className="h-auto w-full max-w-none select-none"
                        style={{
                          filter:
                            'drop-shadow(rgba(0, 0, 0, 0.05) 0px 6px 12px) drop-shadow(rgba(0, 0, 0, 0.03) 0px 40px 26px)',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Central Animated Floating App Icon */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Outer Golden Glow */}
              <div className="absolute inset-0 rounded-[32px] bg-[#FFB000]/40 blur-2xl scale-110" />

              {/* Main App Icon Tile */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(255,176,0,0.5)] border-2 border-white/60">
                <LocketIconBadge className="w-full h-full" />
              </div>

              {/* Floating 3D Heart Sticker Badge */}
              <motion.img
                src="/assets/index/stickers/heart-3d.webp"
                alt=""
                animate={{ rotate: [-8, 8, -8], scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-3 -right-3 w-12 h-12 drop-shadow-xl"
              />
            </motion.div>
          </div>

          {/* Bên dưới: Tiêu đề, Logo tên, rồi nút */}
          <div className="flex flex-col items-center gap-2.5 sm:gap-3 text-center mt-3 sm:mt-4 z-10">
            {/* Logo & Tên */}
            <div className="flex items-center justify-center">
              <LocketWordmark className="h-8 sm:h-9.5 w-auto" />
            </div>

            {/* Tiêu đề */}
            <p className="text-base sm:text-lg font-bold text-[#1A1200]/70 max-w-sm px-4 leading-snug">
              Live pics from your best friends, right on your screen
            </p>

            {/* Nút Open Web */}
            <div className="mt-2.5 sm:mt-3">
              <motion.a
                href="https://locket-dio.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="flex items-center gap-3 py-3.5 px-8 rounded-full bg-[#1A1200] hover:bg-black text-white font-extrabold text-lg sm:text-xl shadow-[0_12px_36px_rgba(26,18,0,0.35)] transition-all cursor-pointer group"
              >
                <span>Open Web</span>
                <span className="text-xl group-hover:translate-x-1.5 transition-transform">→</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* FOOTER DISCLAIMER: Dưới cùng căn giữa                    */}
      {/* ======================================================== */}
      <AnimatePresence>
        {heroRevealed && (
          <motion.footer
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
            style={{
              paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
            }}
            className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-center pointer-events-none px-4 select-none"
          >
            <p className="text-[11px] sm:text-xs font-medium text-[#1A1200]/45 text-center tracking-wide leading-relaxed">
              Unofficial community web client • Not affiliated with or endorsed by Locket Camera, Inc.
            </p>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}

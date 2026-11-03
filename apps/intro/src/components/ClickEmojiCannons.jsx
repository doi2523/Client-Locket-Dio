import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJIS = ['❤️', '💛', '✨', '🔥', '🥹', '🥳', '🥰', '💐', '🎉', '🧡', '⭐️', '🫶'];

export function ClickEmojiCannons() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      // Don't trigger if clicked on an input or button specifically intended for text
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const count = 3 + Math.floor(Math.random() * 3);
      const newItems = [];
      const now = Date.now();

      for (let i = 0; i < count; i++) {
        const id = `${now}-${i}-${Math.random()}`;
        const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        const spreadX = (Math.random() - 0.5) * 80;
        const spreadY = -80 - Math.random() * 120;
        const rotate = (Math.random() - 0.5) * 40;
        const duration = 0.9 + Math.random() * 0.4;

        newItems.push({
          id,
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          targetX: spreadX,
          targetY: spreadY,
          rotate,
          duration,
          emoji,
        });
      }

      setParticles((prev) => [...prev.slice(-30), ...newItems]);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleComplete = (id) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{
              x: p.x,
              y: p.y,
              scale: 0.4,
              opacity: 1,
              rotate: 0,
              filter: 'blur(0px)',
            }}
            animate={{
              x: p.x + p.targetX,
              y: p.y + p.targetY,
              scale: [0.4, 1.2, 1],
              opacity: [1, 1, 0],
              rotate: p.rotate,
              filter: ['blur(0px)', 'blur(0px)', 'blur(6px)'],
            }}
            transition={{
              duration: p.duration,
              ease: 'easeOut',
            }}
            onAnimationComplete={() => handleComplete(p.id)}
            className="absolute text-2xl select-none will-change-transform"
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

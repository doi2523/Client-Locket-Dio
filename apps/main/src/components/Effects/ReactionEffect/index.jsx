import { useEffect, useRef, useCallback, useState } from "react";
import ReactDOM from "react-dom";

const rand = (min, max) => Math.random() * (max - min) + min;

function createParticle({ emojis, direction, size, speed, stageW, stageH }) {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  const x = rand(0, stageW - size);

  const y =
    direction === "down"
      ? rand(-stageH * 0.6, -size)
      : rand(stageH + size, stageH * 1.6);

  return {
    id: Math.random().toString(36).slice(2),
    emoji,
    x,
    y,
    rotate: rand(-35, 35),
    speed: speed * rand(0.55, 1.3),
    opacity: rand(0.65, 1),
    t: rand(0, 100),
    direction,
    size,
    stageW,
    stageH,
  };
}

function tickParticle(p) {
  const t = p.t + 1;

  const y = p.y + (p.direction === "down" ? p.speed : -p.speed);

  const x = p.x;

  const dead =
    p.direction === "down" ? y > p.stageH + p.size * 2 : y < -p.size * 2;

  return [
    {
      ...p,
      x,
      y,
      t,
      rotate: p.rotate + 0.15,
    },
    dead,
  ];
}

export default function ReactionEffect({
  emojis = ["🌸", "❄️", "🍃", "⭐", "🎉"],
  direction = "down",
  count = 10,
  speed = 10,
  size = 70,
  delay = 0,
  running = true,
  style,
  className,
}) {
  const stageRef = useRef(null);

  const particlesRef = useRef([]);

  const rafRef = useRef(null);

  const delayRef = useRef(null);

  const createdCountRef = useRef(0);

  const runningRef = useRef(running);

  const [, forceRender] = useState(0);

  runningRef.current = running;

  const loop = useCallback(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;

    // spawn đúng số lượng
    if (runningRef.current && createdCountRef.current < count) {
      particlesRef.current = [
        ...particlesRef.current,
        createParticle({
          emojis,
          direction,
          size,
          speed,
          stageW,
          stageH,
        }),
      ];

      createdCountRef.current += 1;
    }

    // update particles
    const next = [];

    for (const p of particlesRef.current) {
      const [updated, dead] = tickParticle(p);

      if (!dead) next.push(updated);
    }

    particlesRef.current = next;

    // render
    forceRender((n) => n + 1);

    // nếu hết sạch emoji thì stop hoàn toàn
    if (createdCountRef.current >= count && particlesRef.current.length === 0) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [count, direction, emojis, size, speed]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    clearTimeout(delayRef.current);

    particlesRef.current = [];

    createdCountRef.current = 0;

    if (!running) return;

    runningRef.current = true;

    delayRef.current = setTimeout(() => {
      rafRef.current = requestAnimationFrame(loop);
    }, delay);

    return () => {
      cancelAnimationFrame(rafRef.current);

      clearTimeout(delayRef.current);
    };
  }, [running, delay, loop]);

  return ReactDOM.createPortal(
    <div
      ref={stageRef}
      className={`pointer-events-none fixed top-0 left-0 w-full h-full z-[99] ${className || ""}`}
      aria-hidden="true"
      style={style}
    >
      {particlesRef.current.map((p) => (
        <span
          key={p.id}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            fontSize: p.size,
            lineHeight: 1,
            opacity: p.opacity,
            transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg)`,
            userSelect: "none",
            pointerEvents: "none",
            willChange: "transform",
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>,
    document.body,
  );
}

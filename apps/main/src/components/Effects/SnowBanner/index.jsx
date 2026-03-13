import { useEffect, useRef } from "react";

/* ===== CONFIG ===== */
const WIDTH = 4000;
const HEIGHT = 140;
const COUNT_RATIO = 2;
const COUNT = Math.floor((WIDTH / 100) * COUNT_RATIO);

const GRAVITY = 10;
const SNOW_COLOR = "#B6C2CF"; // màu tuyết

/* ===== Utils ===== */
const rand = (a, b) => Math.random() * (b - a) + a;
const deg2rad = (d) => (d * Math.PI) / 180;

/* ===== SVG snowflake ===== */
function createSnowImage(color) {
  const svg = `
    <svg width="14" height="14" viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.97 10.82L1 9.22L5.05 7L1 4.8L1.97 3.2L6.03 5.4V1H7.97V5.4L12.03 3.2L13 4.8L8.95 7L13 9.22L12.03 10.82L7.97 8.6V13H6.03V8.6L1.97 10.82Z"
        fill="${color}"
      />
    </svg>
  `;
  const img = new Image();
  img.src = "data:image/svg+xml;base64," + btoa(svg);
  return img;
}

/* ===== Snow particle ===== */
function createFlake(i) {
  const vx = rand(-18, 36);
  return {
    index: i,
    opacity: rand(0.3, 1),
    size: rand(15, 21),
    posX: (i * WIDTH) / COUNT,
    posY: rand(-600, -20),
    velocityX: vx,
    velocityY: rand(24, 64),
    rotation: rand(0, 360),
    rotationSpeed: rand(25, 35) * (vx < 0 ? 1 : -1),
  };
}

export default function Snowfall() {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.width = WIDTH / 2 + "px";
    canvas.style.height = HEIGHT / 2 + "px";

    const snowImage = createSnowImage(SNOW_COLOR);
    const flakes = Array.from({ length: COUNT }, (_, i) => createFlake(i));

    const update = (dt) => {
      for (const f of flakes) {
        f.posX += f.velocityX * dt;
        f.posY += f.velocityY * dt;
        f.velocityY += GRAVITY * dt;
        f.rotation += f.rotationSpeed * dt;

        if (f.posY > HEIGHT + f.size) {
          f.posY = rand(-600, -20);
          f.posX = (f.index * WIDTH) / COUNT;
          f.velocityY = rand(24, 64);
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      for (const f of flakes) {
        const fadeStart = HEIGHT * 0.4;
        const fadeEnd = HEIGHT * 1.05;

        let fade = 1;
        if (f.posY > fadeStart) {
          fade = 1 - (f.posY - fadeStart) / (fadeEnd - fadeStart);
        }

        ctx.save();
        ctx.globalAlpha = f.opacity * Math.max(0, fade);
        ctx.translate(f.posX, f.posY);
        ctx.rotate(deg2rad(f.rotation));
        ctx.drawImage(snowImage, -f.size / 2, -f.size / 2, f.size, f.size);
        ctx.restore();
      }
    };

    const loop = (time) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;
      update(dt);
      draw();
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full pointer-events-none z-[999]">
      <canvas ref={canvasRef} />
    </div>
  );
}

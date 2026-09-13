import React, { useState, useEffect } from "react";

const SnowEffect = ({ snowflakeCount = 50, containerHeight = 200 }) => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Tạo tất cả bông tuyết với vị trí bắt đầu phía trên khung
    const initialSnowflakes = Array.from({ length: snowflakeCount }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      left: Math.random() * 100,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 2,
      drift: (Math.random() - 0.5) * 30,
      startY: -(Math.random() * 50 + 10)
    }));
    setSnowflakes(initialSnowflakes);
  }, [snowflakeCount]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            left: `${flake.left}%`,
            top: `${flake.startY}px`,
            opacity: 0.8,
            filter: 'blur(1px)',
            animation: `fall ${flake.duration}s linear ${flake.delay}s infinite`,
            '--drift': `${flake.drift}px`,
            '--fall-distance': `${containerHeight + Math.abs(flake.startY) + 20}px`
          }}
        />
      ))}
    </div>
  );
};

export default SnowEffect;

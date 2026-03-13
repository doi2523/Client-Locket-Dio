import React from "react";
import { ring } from "ldrs";

ring.register();

const LoadingRing = ({ size = 40, stroke = 5, bgOpacity = 0, speed = 2, color = "black" }) => {
  return (
    <l-ring
      size={size}
      stroke={stroke}
      bg-opacity={bgOpacity}
      speed={speed}
      color={color}
    ></l-ring>
  );
};

export default LoadingRing;

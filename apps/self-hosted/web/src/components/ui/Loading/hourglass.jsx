import React from "react";
import { hourglass } from 'ldrs'

hourglass.register()

const Hourglass = ({ size = 40, stroke = 5, bgOpacity = 0, speed = 2, color = "black" }) => {
  return (
    <l-hourglass
      size={size}
      stroke={stroke}
      bg-opacity={bgOpacity}
      speed={speed}
      color={color}
    ></l-hourglass>
  );
};

export default Hourglass;
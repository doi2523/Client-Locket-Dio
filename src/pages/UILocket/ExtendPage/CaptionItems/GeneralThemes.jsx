import React, { useEffect, useState } from "react";
import { PiClockFill } from "react-icons/pi";

export default function GeneralThemes({ title, captionThemes, onSelect }) {
  const [time, setTime] = useState(() => new Date());
  const [locationText, setLocationText] = useState("Vị trí");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // cập nhật mỗi giây

    return () => clearInterval(interval); // clear khi unmount
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const handleClick = () => {
    alert("Chức năng này sẽ sớm có mặt");
  };
  
  
  return (
    <div onClick={() => handleClick()}>
      {title && (
        <h2 className="text-md font-semibold text-primary mb-2">{title}</h2>
      )}
      <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start">
        <button
          // key={preset.id}
          // onClick={() => onSelect(preset)}
          className="flex flex-col whitespace-nowrap bg-black/60 backdrop-blur-3xl items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
          // style={{
          //   background: `linear-gradient(to bottom, ${
          //     preset.top || preset.color_top
          //   }, ${preset.color_bot || preset.color_bottom})`,
          //   color: preset.color_text || preset.text_color,
          // }}
        >
          <span className="text-base flex flex-row items-center text-white">
            <img
              src="./images/music_icon_Normal@3x.png"
              alt=""
              className="w-6 h-6 mr-2"
            />
            Đang phát
          </span>
        </button>
        <button
          // key={preset.id}
          // onClick={() => onSelect(preset)}
          className="flex flex-col whitespace-nowrap bg-black/60 backdrop-blur-3xl items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
        >
          <span className="text-base flex flex-row items-center text-white">
            <img src="./images/star.png" alt="" className="w-5 h-5 mr-2" />
            Review
          </span>
        </button>
        <button className="flex flex-col whitespace-nowrap bg-black/60 backdrop-blur-3xl items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center">
          <span className="text-base flex flex-row items-center text-white">
            <PiClockFill className="w-6 h-6 mr-2 rotate-270" />
            {formattedTime}
          </span>
        </button>
        <button
//   onClick={handleGetLocation}
  className="flex flex-col whitespace-nowrap bg-black/60 backdrop-blur-3xl items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
>
  <span className="text-base flex flex-row items-center text-white">
    <img
      src="./images/location_icon_Normal@3x.png"
      alt=""
      className="w-6 h-6 mr-1"
    />
    Vị trí
  </span>
</button>

        <button
          // key={preset.id}
          // onClick={() => onSelect(preset)}
          className="flex flex-col whitespace-nowrap bg-black/60 backdrop-blur-3xl items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
        >
          <span className="text-base flex flex-row items-center text-white">
            <img
              src="./images/sun_max_indicator_Normal@3x.png"
              alt=""
              className="w-6 h-6 mr-1"
            />
            Thời tiết
          </span>
        </button>
      </div>
    </div>
  );
}

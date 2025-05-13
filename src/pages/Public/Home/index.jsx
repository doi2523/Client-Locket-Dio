import React, { useState, useEffect } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import AnimatedButton from "../../../components/3dButton";
import PushNotificationButton from "../../../components/PushNotificationButton";

const words = [
  "Welcome to Locket Pro! 🚀",
  "Xây dựng theo ý bạn! ✨",
  "Tính năng chất chơi! 🔥",
  "Khám phá & trải nghiệm! 🌍",
];

const Home = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col py-6 items-center justify-center min-h-screen w-full text-center bg-gradient-to-r from-blue-400 to-purple-500">
      <h1 className="text-3xl md:text-6xl font-extrabold text-white drop-shadow-lg">
        <span
          key={index}
          className="typing-container block w-full text-left pl-5 md:pl-10"
        >
          {words[index]}
        </span>
      </h1>
      <p className="text-white mt-4 text-base md:text-lg max-w-2xl font-medium animate-fade-in delay-200">
        Bạn cần đăng nhập để có thể sử dụng chức năng trên trang này!
      </p>
      <Link to={"/login"}
        className="mt-6 px-6 md:px-8 py-3 bg-white text-blue-600 text-sm md:text-base font-semibold rounded-lg shadow-lg 
        hover:bg-gray-100 transition-transform transform hover:scale-110 animate-fade-in delay-400"
      >
        Login now
      </Link>
      {/* <PushNotificationButton/> */}
      {/* <div className="loader">
          <p>loading</p>
          <div className="words text-4xl text-base-300 font-lovehouse">
            <span className="word">buttons</span>
            <span className="word">forms</span>
            <span className="word">switches</span>
            <span className="word">cards</span>
            <span className="word">buttons</span>
          </div>
        </div> */}
    </div>
  );
};

export default Home;

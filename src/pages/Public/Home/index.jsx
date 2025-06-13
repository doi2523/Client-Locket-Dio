import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import { Link } from "react-router-dom";
import { API_URL, urlBase64ToUint8Array } from "../../../utils";
import { showSuccess } from "../../../components/Toast";

const words = [
  "Welcome to Locket Dio! 🚀",
  "Tuỳ chỉnh theo sở thích! ✨",
  "Tính năng chất chơi! 🔥",
  "Khám phá & trải nghiệm! 🌍",
];

const isRunningAsPWA = () => {
  try {
    // Safari không hỗ trợ window.matchMedia với display-mode
    const isStandalone = window.navigator.standalone === true;
    const isDisplayModeStandalone = window.matchMedia && 
      window.matchMedia("(display-mode: standalone)").matches;
    const isAndroidApp = document.referrer && 
      document.referrer.startsWith("android-app://");
    
    return isStandalone || isDisplayModeStandalone || isAndroidApp;
  } catch (error) {
    console.error("Error checking PWA status:", error);
    return false;
  }
};

const Home = () => {
  const [index, setIndex] = useState(0);
  const [showAsk, setShowAsk] = useState(false);

  // ✅ Hiệu ứng thay đổi text
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Kiểm tra chỉ hiện ask khi ở PWA - Fix Safari
  useEffect(() => {
    const checkAsk = () => {
      try {
        // Kiểm tra hỗ trợ Notification API
        if (!("Notification" in window)) {
          return;
        }

        const isPWA = isRunningAsPWA();
        const hasNotificationPermission = Notification.permission === "default";
        
        if (isPWA && hasNotificationPermission) {
          // Delay để đảm bảo component đã mount hoàn toàn
          const timer = setTimeout(() => {
            setShowAsk(true);
          }, 1000);
          
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error in checkAsk:", error);
      }
    };

    // Sử dụng requestAnimationFrame để đảm bảo DOM đã sẵn sàng
    const frame = requestAnimationFrame(checkAsk);
    return () => cancelAnimationFrame(frame);
  }, []);

  const subscribeUser = async () => {
    setShowAsk(false);
    
    try {
      // Kiểm tra hỗ trợ các API cần thiết
      if (!("Notification" in window)) {
        console.warn("Notification API not supported");
        return;
      }
      
      if (!("serviceWorker" in navigator)) {
        console.warn("Service Worker not supported");
        return;
      }

      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        // Đợi service worker sẵn sàng
        const registration = await navigator.serviceWorker.ready;
        
        // Kiểm tra PushManager
        if (!registration.pushManager) {
          console.warn("Push messaging not supported");
          return;
        }
        
        try {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              "BFINGTTNzXF-mOUKJEraD_RxdoEf51mL1e28NqA6LGL9zWP9lrhIQpdBhdG6_rNlBg5ji4b9y9TXbx8LI86s77w"
            ),
          });
          
          await axios.post(API_URL.REGISTER_PUSH_URL, { subscription });
          showSuccess("Bạn đã đăng ký nhận thông báo thành công!");
        } catch (subscriptionError) {
          console.error("Push subscription error:", subscriptionError);
        }
      }
    } catch (error) {
      console.error("Subscribe user error:", error);
    }
  };

  return (
    <div className="flex flex-col py-6 items-center justify-center h-[93vh] w-full text-center bg-gradient-to-r from-blue-400 to-purple-500">
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
      <Link
        to={"/login"}
        className="mt-6 px-6 md:px-8 py-3 bg-white text-blue-600 text-sm md:text-base font-semibold rounded-lg shadow-lg 
        hover:bg-gray-100 transition-transform transform hover:scale-110 animate-fade-in delay-400"
      >
        Login now
      </Link>

      {/* Ask notification */}
      {showAsk && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-[90%] sm:w-auto p-4 bg-white rounded-xl shadow-xl border border-gray-200 animate-fade-in text-sm text-gray-800 flex items-start gap-3">
          <img
            src="/icon-192x192.png"
            alt="Notification"
            className="w-12 h-12 object-contain"
          />
          <div className="flex-1">
            <p className="font-medium mb-2">
              Bạn có muốn nhận thông báo từ Locket Dio?
            </p>
            <div className="flex gap-2 justify-end mt-3">
              <button
                onClick={subscribeUser}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
              >
                Cho phép
              </button>
              <button
                onClick={() => setShowAsk(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
// src/components/UI/NotificationPrompt.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, urlBase64ToUint8Array } from "@/utils";
import { showSuccess } from "../../Toast";

const isRunningAsPWA = () => {
  try {
    const isStandalone = window.navigator.standalone === true;
    const isDisplayModeStandalone =
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches;
    const isAndroidApp =
      document.referrer && document.referrer.startsWith("android-app://");

    return isStandalone || isDisplayModeStandalone || isAndroidApp;
  } catch (error) {
    console.error("Error checking PWA status:", error);
    return false;
  }
};

const NotificationPrompt = () => {
  const [showAsk, setShowAsk] = useState(false);

  // Kiểm tra điều kiện để hiển thị
  useEffect(() => {
    const checkAsk = () => {
      try {
        if (!("Notification" in window)) return;

        const isPWA = isRunningAsPWA();
        const hasNotificationPermission = Notification.permission === "default";

        if (isPWA && hasNotificationPermission) {
          const timer = setTimeout(() => setShowAsk(true), 1000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error in checkAsk:", error);
      }
    };

    const frame = requestAnimationFrame(checkAsk);
    return () => cancelAnimationFrame(frame);
  }, []);

  const subscribeUser = async () => {
    setShowAsk(false);
    try {
      if (!("Notification" in window)) return;
      if (!("serviceWorker" in navigator)) return;

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;
        if (!registration.pushManager) return;

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BFINGTTNzXF-mOUKJEraD_RxdoEf51mL1e28NqA6LGL9zWP9lrhIQpdBhdG6_rNlBg5ji4b9y9TXbx8LI86s77w"
          ),
        });

        await axios.post(API_URL.REGISTER_PUSH_URL, { subscription });
        showSuccess("Bạn đã đăng ký nhận thông báo thành công!");
      }
    } catch (error) {
      console.error("Subscribe user error:", error);
    }
  };

  if (!showAsk) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-[90%] sm:w-auto p-4 bg-white rounded-xl shadow-xl border border-gray-200 animate-fade-in text-sm text-gray-800 flex items-start gap-3">
      <img
        src="/apple-touch-icon.png"
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
  );
};

export default NotificationPrompt;

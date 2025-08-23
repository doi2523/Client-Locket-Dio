import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, X } from "lucide-react";
import { API_URL } from "@/utils";

const highlightWords = ["Server01", "Telegram"];

function parseMessage(text, highlightWords = []) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
        >
          {part}
        </a>
      );
    }

    let lastIndex = 0;
    const elements = [];

    highlightWords.forEach((word) => {
      const lowerPart = part.toLowerCase();
      const lowerWord = word.toLowerCase();

      let startIndex = 0;
      while (true) {
        const index = lowerPart.indexOf(lowerWord, startIndex);
        if (index === -1) break;

        if (index > lastIndex) {
          elements.push(part.substring(lastIndex, index));
        }
        elements.push(
          <strong
            key={`${i}-${index}`}
            className="text-red-500 font-semibold bg-red-50 px-1 py-0.5 rounded"
          >
            {part.substring(index, index + word.length)}
          </strong>
        );

        lastIndex = index + word.length;
        startIndex = lastIndex;
      }
    });

    if (elements.length === 0) {
      return <React.Fragment key={i}>{part}</React.Fragment>;
    }

    elements.push(part.substring(lastIndex));
    return <React.Fragment key={i}>{elements}</React.Fragment>;
  });
}

const FloatingNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isShaking, setIsShaking] = useState(true);
  const [showNewNotificationAlert, setShowNewNotificationAlert] =
    useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL.NOTIFI_URL}`);
        const data = Array.isArray(res.data.notifications)
          ? res.data.notifications
          : [];

        const formatted = data.map((item) => ({
          ...item,
          time: new Date(item.created_at).toLocaleString(),
        }));

        if (formatted.length > 0) {
          setShowNewNotificationAlert(true);
          setTimeout(() => setShowNewNotificationAlert(false), 3000);
        }

        setNotifications(formatted);
      } catch (err) {
        console.error("Lỗi khi lấy thông báo:", err);
      }
    };

    fetchNotifications();

    const timer = setTimeout(() => setIsShaking(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Lock scroll khi mở modal
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  return (
    <>
      {/* Floating Notification Button */}
      <div className="relative">
        {/* New Notification Alert - Chỉ hiện khi có thông báo mới */}
        {showNewNotificationAlert && (
          <div className="absolute bg-green-500 text-white bottom-full right-0 mb-3 px-4 py-2 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 whitespace-nowrap">
            🔔 Có thông báo mới!
            <div
              className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 
                       border-l-transparent border-r-transparent border-t-emerald-500"
            ></div>
          </div>
        )}

        {/* Main notification button */}
        <button
          aria-label="Mở giao diện thông báo"
          onClick={() => setShowModal(true)}
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-base-300 border border-amber-400 text-base-content shadow-lg cursor-pointer"
        >
          <Bell
            size={24}
            className={`text-base-content ${
              isShaking ? "shake-animation" : ""
            }`}
          />

          {/* Notification badge */}
          {notifications.length > 0 && (
            <span className="absolute no-select -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5 leading-none ring-2 ring-white">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4
                   bg-base-100/10 backdrop-blur-[2px] bg-opacity-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-lg mx-auto bg-base-100 
                     rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Thông báo</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 text-white hover:text-white/90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[50vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="w-16 h-16 bg-base-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-center text-lg">
                    Không có thông báo nào
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-center text-sm mt-1">
                    Các thông báo mới sẽ xuất hiện tại đây
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {notifications.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${
                        index === 0 ? "bg-base-300" : ""
                      }`}
                    >
                      {/* Title */}
                      {item.title && (
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-base-content text-base leading-snug">
                            {item.title}
                          </h3>
                          {index === 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                              Mới nhất
                            </span>
                          )}
                        </div>
                      )}

                      {/* Message */}
                      <div className="text-base-content text-sm leading-relaxed whitespace-pre-line mb-3">
                        {parseMessage(item.message, highlightWords)}
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingNotification;

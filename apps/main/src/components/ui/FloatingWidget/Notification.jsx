import React, { useEffect, useState } from "react";
import "./styles.css";
import { Bell, X } from "lucide-react";
import { TbPinned } from "react-icons/tb";
import { getNotifications } from "@/services";

const highlightWords = ["Server01", "Telegram", "Discord", "Messenger"];

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
  const [animate, setAnimate] = useState(false);
  const [isShaking, setIsShaking] = useState(true);
  const [showNewNotificationAlert, setShowNewNotificationAlert] =
    useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        const data = Array.isArray(res.data.notifications)
          ? res.data.notifications
          : [];

        const formatted = data.map((item) => ({
          ...item,
          time: new Date(item.created_at).toLocaleString(),
          createdAt: new Date(item.created_at).getTime(),
        }));

        // Sắp xếp:
        // - pinned trước
        // - cùng pinned thì sort theo createdAt DESC (mới nhất trước)
        formatted.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.createdAt - a.createdAt;
        });

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

  // Mở modal với animation
  const openModal = () => {
    setShowModal(true);
    setTimeout(() => setAnimate(true), 10);
  };

  const closeModal = () => {
    setAnimate(false);
    setTimeout(() => setShowModal(false), 300);
  };

  return (
    <>
      {/* Floating Notification Button */}
      <div className="relative">
        {/* New Notification Alert */}
        {showNewNotificationAlert && (
          <div className="absolute bg-green-500 text-white bottom-full right-0 mb-3 px-4 py-2 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 whitespace-nowrap">
            🔔 Có thông báo mới!
            <div
              className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 
                       border-l-transparent border-r-transparent border-t-emerald-500"
            ></div>
          </div>
        )}

        <button
          aria-label="Mở giao diện thông báo"
          onClick={openModal}
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-base-300 border text-base-content shadow-sm cursor-pointer"
        >
          <Bell
            size={24}
            className={`text-base-content ${
              isShaking ? "shake-animation" : ""
            }`}
          />
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
          className={`fixed inset-0 z-[60] shadow-md flex items-center justify-center p-4 
            bg-base-100/10 backdrop-blur-sm transition-opacity duration-300 
            ${animate ? "opacity-100" : "opacity-0"}`}
          onClick={closeModal}
        >
          <div
            className={`relative w-full max-w-lg bg-base-100 rounded-3xl shadow-2xl overflow-hidden 
              transform transition-all duration-300 
              ${
                animate ? "scale-100 translate-y-0" : "scale-90 translate-y-4"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-base-300 px-6 py-4 flex items-center justify-between text-base-content">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-base-100/70 rounded-full">
                  <Bell className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">
                  Thông báo
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full bg-base-100/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[50vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="w-16 h-16 bg-base-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-base-content/70" />
                  </div>
                  <p className="text-base-content/80 text-center text-lg">
                    Không có thông báo nào
                  </p>
                  <p className="text-base-content/80 text-center text-sm mt-1">
                    Các thông báo mới sẽ xuất hiện tại đây
                  </p>
                </div>
              ) : (
                <div className="bg-base-100">
                  {notifications.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-6 bg-base-200 transition-colors duration-200 rounded-2xl m-2 shadow 
      ${index === 0 && !item.pinned ? "bg-base-300" : ""}`}
                    >
                      {item.title && (
                        <div className="relative flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-base-content text-base leading-snug">
                            {item.title}
                          </h3>

                          {/* Nếu item là thông báo đầu tiên KHÔNG GHIM → gắn "Mới nhất" */}
                          {index === 0 && !item.pinned && (
                            <span className="bg-error text-base-content text-xs font-bold px-2 py-0.5 rounded-full shadow">
                              Mới nhất
                            </span>
                          )}

                          {item.pinned === true && (
                            <TbPinned
                              className="absolute -top-2 -right-2 text-error rotate-30"
                              size={25}
                            />
                          )}
                        </div>
                      )}
                      <div className="text-base-content text-sm leading-relaxed whitespace-pre-line mb-3">
                        {parseMessage(item.message, highlightWords)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-base-content/80">
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

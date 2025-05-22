import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { API_URL } from "../../../utils";

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
          className="text-primary font-semibold underline"
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
          <strong key={`${i}-${index}`} className="text-red-600 font-semibold">
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
  const [showList, setShowList] = useState(false);
  const [isShaking, setIsShaking] = useState(true);
  const [showNewNotificationAlert, setShowNewNotificationAlert] = useState(false);

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
          setTimeout(() => setShowNewNotificationAlert(false), 2000);
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

  const toggleList = () => {
    setShowList(!showList);
  };

  return (
<div className="fixed right-8 bottom-8 z-80 text-base-content">
  {/* Dòng thông báo mới xuất hiện trong 2s */}
  <div
    className={`absolute bottom-14 w-50 right-0 px-4 py-2 bg-green-500 text-white rounded shadow-md text-sm transition-all duration-500 transform ${
      showNewNotificationAlert
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 translate-y-2 pointer-events-none"
    }`}
  >
    Có thông báo mới!
  </div>

  {/* Danh sách thông báo */}
  {notifications.length > 0 && (
    <div
      className={`absolute bottom-14 right-0 w-80 bg-base-100 border shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 ease-out origin-bottom-right ${
        showList ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
      }`}
    >
      <div className="text-sm font-semibold px-4 py-2 border-b bg-base-200">
        Thông báo mới
      </div>
      <ul className="max-h-60 overflow-y-auto divide-y">
        {notifications.map((item) => (
          <li
            key={item.id}
            className="px-4 py-3 text-sm whitespace-pre-line break-words"
          >
            {item.title && (
              <div className="font-semibold mb-1">{item.title}</div>
            )}
            <div>{parseMessage(item.message, highlightWords)}</div>
            <div className="text-xs text-gray-500">{item.time}</div>
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* Nút chuông */}
  <div
    className="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg cursor-pointer"
    onClick={toggleList}
  >
    <Bell size={24} className={isShaking ? "shake-animation" : ""} />
    {notifications.length > 0 && (
      <span className="absolute no-select -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5 leading-none ring-2 ring-white">
        {notifications.length}
      </span>
    )}
  </div>
</div>

  );
};

export default FloatingNotification;

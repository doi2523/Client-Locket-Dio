import { useState } from "react";
import { Home, Settings, Bell, X } from "lucide-react"; // Icon từ lucide-react

const AssistiveButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-100">
      {/* Các tuỳ chọn */}
      <div
        className={`relative flex items-center justify-center transition-all ${
          isOpen ? "w-40 h-40" : "w-0 h-0"
        }`}
      >
        {/* Các icon xung quanh */}
        {isOpen && (
          <>
            <button className="absolute top-0 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700">
              <Home size={20} />
            </button>
            <button className="absolute bottom-0 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700">
              <Settings size={20} />
            </button>
            <button className="absolute left-0 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700">
              <Bell size={20} />
            </button>
            <button className="absolute right-0 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700">
              <X size={20} />
            </button>
          </>
        )}
      </div>

      {/* Nút chính */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
      >
        {isOpen ? <X size={24} /> : "🟦"}
      </button>
    </div>
  );
};

export default AssistiveButton;

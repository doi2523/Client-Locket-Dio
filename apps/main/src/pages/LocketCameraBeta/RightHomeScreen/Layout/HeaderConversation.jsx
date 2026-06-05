import React from "react";
import { ChevronLeft } from "lucide-react";

const HeaderConversation = ({ setIsHomeOpen, setSelectedChat, isConnected }) => {
  return (
    <div className="relative flex items-center shadow-lg justify-between px-4 py-2 text-base-content">
      <button
        onClick={() => {
          setIsHomeOpen(false);
          setSelectedChat(null);
        }}
        className="btn p-1 border-0 rounded-full hover:bg-base-200 transition cursor-pointer z-10"
      >
        <ChevronLeft size={30} />
      </button>
      <SocketStatus isConnected={isConnected} />
    </div>
  );
};

const SocketStatus = ({ isConnected }) => {
  const statusClass = isConnected ? "status-success" : "status-error";

  return (
    <div className="flex items-center gap-2">
      <div className="inline-grid *:[grid-area:1/1]">
        <div className={`status ${statusClass} animate-ping`}></div>
        <div className={`status ${statusClass}`}></div>
      </div>
      <span className={isConnected ? "text-success" : "text-error"}>
        {isConnected ? "Connected to Dio Service" : "Disconnected"}
      </span>
    </div>
  );
};

export default HeaderConversation;

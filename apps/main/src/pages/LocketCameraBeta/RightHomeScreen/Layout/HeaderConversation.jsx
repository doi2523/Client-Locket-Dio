import React from "react";
import { ChevronLeft, RefreshCw } from "lucide-react";

const HeaderConversation = ({
  setIsHomeOpen,
  setSelectedChat,
  isConnected,
  relayStatus,
  sendReconnect,
}) => {
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

      <div className="flex items-center gap-3">
        {relayStatus === "open" && (
          <button
            onClick={sendReconnect}
            className="btn btn-ghost btn-xs rounded-full gap-1 text-warning"
            title="Kết nối lại với relay service, dùng khi kết nối bạn bị đứng"
          >
            <RefreshCw size={14} />
            Reconnect
          </button>
        )}

        <SocketStatus isConnected={isConnected} relayStatus={relayStatus} />
      </div>
    </div>
  );
};

const SocketStatus = ({ isConnected, relayStatus }) => {
  const relayOk = relayStatus === "open";
  const label =
    !isConnected
      ? "Dio service: off"
      : !relayOk
        ? "Relay: " + relayStatus
        : "Connected";

  return (
    <div className="flex items-center gap-1.5">
      <div className="inline-grid *:[grid-area:1/1]">
        <div
          className={`status ${
            isConnected && relayOk ? "status-success" : "status-error"
          } animate-ping`}
        ></div>
        <div
          className={`status ${
            isConnected && relayOk ? "status-success" : "status-error"
          }`}
        ></div>
      </div>
      <span
        className={`text-xs font-semibold ${
          isConnected && relayOk ? "text-success" : "text-error"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default HeaderConversation;

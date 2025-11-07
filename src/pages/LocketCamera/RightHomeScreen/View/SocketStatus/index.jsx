import React from "react";

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

export default SocketStatus;

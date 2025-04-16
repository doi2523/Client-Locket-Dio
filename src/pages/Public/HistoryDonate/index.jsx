import React from "react";

const DonateHistory = () => {
  const donations = [
    { time: "00:17", date: "10/04/2025", name: "HOANG HA VY", amount: 2000, message: "DANG HOANG HA VY CHUYEN TIEN" },
    { time: "00:17", date: "10/04/2025", name: "HOANG HA VY", amount: 2000, message: "DANG HOANG HA VY CHUYEN TIEN" },
    { time: "00:17", date: "10/04/2025", name: "HOANG HA VY", amount: 2000, message: "DANG HOANG HA VY CHUYEN TIEN" },
    { time: "00:17", date: "10/04/2025", name: "HOANG HA VY", amount: 2000, message: "DANG HOANG HA VY CHUYEN TIEN" },
    { time: "00:17", date: "10/04/2025", name: "HOANG HA VY", amount: 2000, message: "DANG HOANG HA VY CHUYEN TIEN" },
    { time: "00:16", date: "10/04/2025", name: "HOANG HA VY", amount: 2000, message: "DANG HOANG HA VY CHUYEN TIEN" },
    { time: "13:05", date: "03/04/2025", name: "DIO", amount: 1000000, message: "I LOVE JAVASCRIPT" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 p-6 rounded-xl bg-base-100 shadow-md border border-base-300">
      <h1 className="text-2xl font-bold mb-4 text-center">Lịch sử đóng góp</h1>
      <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
        {donations.map((donate, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-base-300 shadow-sm bg-base-200"
          >
            <div className="flex justify-between text-sm text-base-content/60 mb-1">
              <span>{donate.time} | {donate.date}</span>
              <span className="font-semibold text-green-600">
                +{donate.amount.toLocaleString()}₫
              </span>
            </div>
            <div className="font-medium text-base-content">{donate.name}</div>
            <div className="text-sm text-base-content/70 italic">{donate.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonateHistory;

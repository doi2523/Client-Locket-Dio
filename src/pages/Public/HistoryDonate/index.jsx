import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../utils";

const DonateHistory = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu donations từ API
    const fetchDonations = async () => {
      try {
        const res = await axios.get(`${API_URL.DONATE_URL}`);
        setDonations(res.data); // Giả sử API trả về danh sách quyên góp trong `data`
      } catch (err) {
        console.error("Lỗi khi fetch donations:", err);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="w-full mb-6 mx-auto p-6 rounded-xl bg-base-100 shadow-md border border-base-300">
      <h1 className="text-2xl font-bold mb-4 text-center">Lịch sử đóng góp</h1>
      <div className="max-h-90 overflow-y-auto space-y-4 pr-1">
        {donations.length === 0 ? (
          <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-base-300 shadow-sm bg-base-200">
              <div className="flex justify-between mb-2">
                <div className="skeleton h-4 w-32"></div>
                <div className="skeleton h-4 w-20"></div>
              </div>
              <div className="skeleton h-4 w-40 mb-2"></div>
              <div className="skeleton h-3 w-full"></div>
            </div>
          ))}
        </div>
        
        ) : (
          donations.map((donate, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-base-300 shadow-sm bg-base-200"
            >
              <div className="flex justify-between text-sm text-base-content/60 mb-1">
                <span className="text-primary">{donate.date}</span>
                <span className="font-semibold text-green-600">
                  +{donate.amount.toLocaleString()}₫
                </span>
              </div>
              <div className="text-md text-base-content/90 text-left">
                {donate.donorname}
              </div>
              <div className="text-sm text-base-content/70 italic text-left">
                {donate.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonateHistory;

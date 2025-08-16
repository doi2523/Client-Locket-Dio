import React, { useEffect, useState } from "react";
import { Heart, Gift, CreditCard, Coffee, UsersRound } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/utils";

const DonatePage = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Số tiền đã chi tiêu
  const spentAmount = 1254000;

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL.DONATE_URL}`);
        setDonations(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Lỗi khi fetch donations:", err);
        setIsLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const totalDonations = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-error animate-pulse" />
            <h1 className="text-3xl md:text-3xl font-bold text-base-content">
              Ủng hộ dự án
            </h1>
            <Heart className="w-6 h-6 text-error animate-pulse" />
          </div>
          <p className="text-secondary text-sm md:text-base max-w-lg mx-auto">
            Mọi đóng góp giúp duy trì và cải thiện website. Cảm ơn sự ủng hộ của
            bạn! Dù chỉ là một số tiền nhỏ nhưng là sự đóng góp lớn đối với mình.
          </p>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Tổng đóng góp",
              value: `${totalDonations.toLocaleString()}₫`,
              icon: <Gift className="w-5 h-5 text-success" />,
            },
            {
              label: "Người ủng hộ",
              value: donations.length,
              icon: <UsersRound className="w-5 h-5 text-primary" />,
            },
            {
              label: "Đã chi tiêu",
              value: `${spentAmount.toLocaleString()}₫`,
              icon: <CreditCard className="w-5 h-5 text-warning" />,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-base-200 rounded-lg p-4 shadow-md border border-base-300 flex items-center gap-3"
            >
              <div className="p-2 bg-base-300 rounded-full">{stat.icon}</div>
              <div>
                <p className="text-secondary text-xs md:text-sm">
                  {stat.label}
                </p>
                <p className="text-lg md:text-xl font-semibold text-base-content">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div> */}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donate Section */}
          <div className="bg-base-100 rounded-2xl p-6 shadow-md border border-base-300">
            <div className="text-center mb-4">
              <div className="flex justify-center items-center gap-2 mb-3 text-lg font-semibold text-base-content">
                <Coffee className="w-5 h-5 text-amber-500" /> Give me a coffee
              </div>
              <img
                src="https://cdn.locket-dio.com/v1/images/qr/momo-locket-dio.png"
                alt="QR Code Donate"
                className="w-52 h-52 mx-auto rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4 space-y-2 text-sm text-base-content">
              <div className="p-3 border border-base-300 rounded">
                NH: <span className="font-semibold">Bản Việt (BVBank)</span>
              </div>
              <div className="p-3 border border-base-300 rounded">
                STK: <span className="font-semibold">99MM25227MC0000247</span>
              </div>
              <div className="p-3 border border-base-300 rounded">
                CTK: <span className="font-semibold">MOMO_DAO VAN DOI</span>
              </div>
            </div>
            <p className="mt-4 text-base-content text-sm text-center">
              Mỗi đóng góp là động lực để mình tiếp tục phát triển website ☕
            </p>
          </div>

          {/* Donation History */}
          <div className="bg-base-100 rounded-2xl p-6 shadow-md border border-base-300">
            <div className="flex items-center gap-2 mb-4 text-base-content font-semibold">
              <Gift className="w-5 h-5 text-purple-600" />
              <span>Lịch sử đóng góp</span>
            </div>
            <div className="max-h-90 overflow-y-auto space-y-3 pr-2">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-base-300 rounded p-3 h-20"
                  ></div>
                ))
              ) : donations.length === 0 ? (
                <div className="text-center text-secondary py-8 text-sm">
                  Chưa có đóng góp nào. Hãy là người đầu tiên ủng hộ!
                </div>
              ) : (
                donations.map((d, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-base-300 rounded hover:shadow transition"
                  >
                    <div className="flex justify-between text-xs md:text-sm text-secondary mb-1">
                      <span>
                        {new Date(d.date).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="text-success font-semibold">
                        +{d.amount.toLocaleString()}₫
                      </span>
                    </div>
                    <div className="font-medium text-base-content">
                      {d.donorname}
                    </div>
                    <div className="text-secondary text-sm italic">
                      {d.message}
                    </div>
                  </div>
                ))
              )}
            </div>
            {donations.length > 0 && (
              <p className="mt-3 text-center text-base-content text-sm font-medium">
                ❤️ Cảm ơn {donations.length} người đã ủng hộ! ❤️
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;

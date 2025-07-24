// components/MemberPlanIntro.jsx
import React from "react";
import {
  Camera,
  Video,
  Palette,
  Star,
  Gem,
  CheckCircle,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";

export default function MemberPlanIntro() {

  const benefits = [
    "Giá cả hợp lý tương xứng với giá trị sử dụng",
    "100% doanh thu dùng để phát triển nền tảng",
    "Cam kết cải thiện trải nghiệm người dùng liên tục",
  ];

  return (
    <div className="bg-white/80 h-full backdrop-blur-md border border-gray-200 rounded-2xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 animated-gradient rounded-full flex items-center justify-center text-white">
          <Gem size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 font-lovehouse -mb-1">
            Locket Dio Member
          </h2>
          <p className="text-sm text-gray-500">
            Trải nghiệm tốt hơn, quyền lợi nhiều hơn
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="mb-5">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
          <table className="min-w-full table-md text-sm text-gray-800 bg-white">
            <thead className="bg-gray-50 text-gray-600 text-center">
              <tr>
                <th className="p-4 text-left">Tính năng</th>
                <th className="p-4">Miễn phí</th>
                <th className="p-4 text-purple-600 font-semibold">
                  Thành viên
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center text-xs">
              <tr>
                <td className="text-left p-4 font-medium">
                  Số lần đăng ảnh/video mỗi ngày
                </td>
                <td>Không giới hạn</td>
                <td className="text-green-600 font-semibold">Không giới hạn</td>
              </tr>
              <tr>
                <td className="text-left p-4 font-medium">
                  Chất lượng video tải lên
                </td>
                <td className="text-gray-400">Thường (SD)</td>
                <td className="text-green-600 font-semibold">HD/Full HD</td>
              </tr>
              <tr>
                <td className="text-left p-4 font-medium">Tuỳ chỉnh theme</td>
                <td className="text-gray-400">Giới hạn</td>
                <td className="text-green-600 font-semibold">Không giới hạn</td>
              </tr>
              <tr>
                <td className="text-left p-4 font-medium">Hỗ trợ ưu tiên</td>
                <td className="text-gray-400">✕</td>
                <td className="text-green-600 font-semibold">✓</td>
              </tr>
              <tr>
                <td className="text-left p-4 font-medium">
                  Truy cập sớm tính năng mới
                </td>
                <td className="text-gray-400">✕</td>
                <td className="text-green-600 font-semibold">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gray-100 rounded-xl p-5 mb-5">
        <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <TrendingUp size={16} />
          Tại sao nên nâng cấp?
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {benefits.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="text-green-500 mt-0.5" size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-100 text-gray-700 rounded-xl p-4 text-center text-base font-semibold flex items-center justify-center gap-2">
        <HeartHandshake size={30} className="text-purple-500" />
        Cảm ơn bạn đã đồng hành cùng Locket Dio
      </div>
    </div>
  );
}

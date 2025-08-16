import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Monitor,
  Menu,
  Share,
  Plus,
  Zap,
  Bell,
  Save,
  AppWindow,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  Chrome,
  Globe,
} from "lucide-react";

const AddToHomeScreenGuide = () => {
  const [activeTab, setActiveTab] = useState("android");

  // Detect user's operating system
  useEffect(() => {
    const detectOS = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Check for iOS
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "ios";
      }

      // Check for Android
      if (/android/i.test(userAgent)) {
        return "android";
      }

      // Default to Android for other mobile devices
      if (/Mobi|Android/i.test(userAgent)) {
        return "android";
      }

      // Desktop - default to Android
      return "android";
    };

    setActiveTab(detectOS());
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-3xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bounce-y shadow-lg flex items-center rounded-2xl justify-center">
              <img src="/apple-touch-icon.png" alt="Locket Dio Icon" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Thêm Locket Camera vào Màn hình Chính
          </h1>
          <p className="text-gray-600 text-lg">
            Truy cập nhanh chóng ứng dụng yêu thích của bạn
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-base-100 rounded-xl p-1 shadow-lg flex">
            <button
              onClick={() => setActiveTab("android")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "android"
                  ? "bg-green-500 text-white shadow-md"
                  : "text-accent hover:bg-gray-50"
              }`}
            >
              <Smartphone className="w-5 h-5" />
              Android
            </button>
            <button
              onClick={() => setActiveTab("ios")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "ios"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-accent hover:bg-gray-50"
              }`}
            >
              <Monitor className="w-5 h-5" />
              iOS
            </button>
          </div>
        </div>

        {/* Android Guide */}
        {activeTab === "android" && (
          <div className="bg-base-100 rounded-2xl shadow-xl p-5 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-base-content">
                Hướng dẫn cho Android
              </h2>
            </div>

            <div className="space-y-6">
              {/* Chrome Browser */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Chrome className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-base-content">
                    Chrome Browser
                  </h3>
                </div>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div className="flex items-center gap-2">
                      <Menu className="w-4 h-4 text-gray-500" />
                      <span className="text-base-content">
                        Nhấn menu hoặc ⋮ ở góc
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-gray-500" />
                      <span className="text-base-content">
                        Chọn "Add to Home screen"
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-base-content">
                        Nhấn "Add" để xác nhận
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other browsers */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">
                    Trình duyệt khác
                  </h4>
                </div>
                <p className="text-green-700 text-sm">
                  Samsung Internet, Firefox: Tìm tùy chọn "Add to Home" hoặc
                  "Install" trong menu
                </p>
              </div>
            </div>
          </div>
        )}

        {/* iOS Guide */}
        {activeTab === "ios" && (
          <div className="bg-base-100 rounded-2xl shadow-xl p-5 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Monitor className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-base-content">
                Hướng dẫn cho iOS
              </h2>
            </div>

            <div className="space-y-6">
              {/* Safari Browser */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-base-content">
                    Safari Browser
                  </h3>
                </div>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div className="flex items-center gap-2">
                      <Share className="w-4 h-4 text-gray-500" />
                      <span className="text-base-content">
                        Nhấn nút Share (chia sẻ)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-gray-500" />
                      <span className="text-base-content">
                        Chọn "Add to Home Screen"
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-base-content">
                        Nhấn "Add" để hoàn tất
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chrome warning */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-orange-800">Lưu ý</h4>
                </div>
                <p className="text-orange-700 text-sm">
                  Chrome trên iOS không hỗ trợ tính năng này. Vui lòng sử dụng
                  Safari.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-5 mb-8">
          <h2 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-purple-600" />
            Lợi ích khi thêm vào màn hình chính
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-base-content mb-1">
                  Truy cập nhanh
                </h3>
                <p className="text-gray-600 text-sm">Mở ngay bằng một chạm</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AppWindow className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-base-content mb-1">
                  Chế độ toàn màn hình
                </h3>
                <p className="text-gray-600 text-sm">Giống như ứng dụng thật</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-base-content mb-1">
                  Thông báo push
                </h3>
                <p className="text-gray-600 text-sm">Nhận thông báo kịp thời</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Save className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-base-content mb-1">
                  Tiết kiệm dung lượng
                </h3>
                <p className="text-gray-600 text-sm">Không cần App Store</p>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-5">
          <h2 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            Gặp vấn đề?
          </h2>
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Không thấy tùy chọn "Add to Home Screen"?
              </h3>
              <p className="text-red-700 text-sm">
                Kiểm tra: Sử dụng đúng trình duyệt • Kết nối internet ổn định •
                Cập nhật trình duyệt
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Không thấy biểu tượng trên màn hình?
              </h3>
              <p className="text-yellow-700 text-sm">
                Kiểm tra các trang màn hình chính khác hoặc tìm kiếm trên google
                "Locket Dio"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">Cần hỗ trợ? Liên hệ: doibncm2003@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default AddToHomeScreenGuide;

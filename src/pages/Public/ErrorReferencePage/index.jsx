import React, { useState, useMemo } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Bug,
  Lightbulb,
  Copy,
  Check,
  X,
  Eye,
} from "lucide-react";

const ErrorReferencePage = () => {
  const [errorData] = useState([
    {
      id: 1,
      errorCode: "500",
      errorName: "Lỗi máy chủ",
      title: "Không thể tải ảnh hoặc video",
      description:
        "Bạn gặp lỗi này khi ứng dụng không kết nối được với máy chủ. Có thể do mất mạng hoặc máy chủ đang gặp sự cố.",
      category: "Kết nối mạng",
      severity: "Cao",
      tags: ["mạng", "máy chủ", "tải lỗi"],
      language: "JavaScript",
      errorImage:
        "https://firebasestorage.googleapis.com/v0/b/webdio-20ca8.appspot.com/o/images%2FLocket%2FIMG_8968.PNG?alt=media&token=652291d1-6483-4aec-ac97-3f325d3cdcb0",
      solution: [
        "Kiểm tra kết nối Internet của bạn.",
        "Thử làm mới trang hoặc đợi vài phút.",
        "Nếu vẫn lỗi, máy chủ có thể đang bảo trì. Vui lòng thử lại sau.",
      ],
      causes: [
        "Mất kết nối Internet",
        "Máy chủ quá tải hoặc gặp sự cố",
        "Cấu hình hệ thống không đúng",
      ],
      preventions: [
        "Đảm bảo kết nối mạng ổn định",
        "Tránh sử dụng ứng dụng vào giờ cao điểm",
      ],
      relatedErrors: ["Lỗi mạng", "Không đọc được dữ liệu"],
      dateAdded: "2024-01-15",
      views: 1250,
      helpful: 89,
    },
    {
      id: 2,
      errorCode: "404",
      errorName: "Không tìm thấy",
      title: "Không tìm thấy nội dung yêu cầu",
      description:
        "Lỗi này xảy ra khi nội dung bạn tìm không tồn tại, có thể do liên kết sai hoặc nội dung đã bị xóa.",
      category: "Đường dẫn lỗi",
      severity: "Trung bình",
      tags: ["liên kết", "404", "không tìm thấy"],
      language: "HTTP",
      errorImage:
        "https://firebasestorage.googleapis.com/v0/b/webdio-20ca8.appspot.com/o/images%2FLocket%2FIMG_8968.PNG?alt=media&token=652291d1-6483-4aec-ac97-3f325d3cdcb0",
      solution: [
        "Kiểm tra lại liên kết bạn vừa nhập.",
        "Quay lại trang trước hoặc thử làm mới trang.",
        "Liên hệ hỗ trợ nếu lỗi vẫn xuất hiện.",
      ],
      causes: ["Liên kết sai", "Nội dung đã bị xóa", "Lỗi truy cập"],
      preventions: [
        "Kiểm tra kỹ liên kết trước khi nhấp",
        "Cập nhật ứng dụng để tránh lỗi cũ",
      ],
      relatedErrors: ["Lỗi 500", "Không được phép truy cập"],
      dateAdded: "2024-01-20",
      views: 980,
      helpful: 75,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [showSolution, setShowSolution] = useState({});
  const [copiedCode, setCopiedCode] = useState("");
  const [modalImage, setModalImage] = useState(null);

  const categories = [...new Set(errorData.map((item) => item.category))];
  const severities = [...new Set(errorData.map((item) => item.severity))];

  const filteredData = useMemo(() => {
    return errorData
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.errorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.errorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          );

        const matchesCategory =
          !selectedCategory || item.category === selectedCategory;
        const matchesSeverity =
          !selectedSeverity || item.severity === selectedSeverity;

        return matchesSearch && matchesCategory && matchesSeverity;
      })
      .sort((a, b) => b.views - a.views);
  }, [errorData, searchTerm, selectedCategory, selectedSeverity]);

  const toggleSolution = (id) => {
    setShowSolution((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (solution, id) => {
    navigator.clipboard.writeText(solution.join("\n"));
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const openImageModal = (imageUrl, errorCode, errorName, description) => {
    setModalImage({ url: imageUrl, errorCode, errorName, description });
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "thấp":
        return "bg-green-100 text-green-800 border-green-200";
      case "trung bình":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cao":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case "thấp":
        return <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />;
      case "trung bình":
        return <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />;
      case "cao":
        return <Bug className="w-4 h-4 md:w-5 md:h-5" />;
      default:
        return <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Tìm và Sửa Lỗi Nhanh Chóng
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Nhập mã lỗi hoặc mô tả để tìm cách khắc phục
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Nhập mã lỗi hoặc mô tả (VD: 500, không tải ảnh)"
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-base sm:text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="w-full sm:w-1/2 px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-base sm:text-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                className="w-full sm:w-1/2 px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-base sm:text-lg"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
              >
                <option value="">Tất cả mức độ</option>
                {severities.map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-500">
              Tìm thấy {filteredData.length} kết quả
            </div>
          </div>
        </div>

        {/* Error Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredData.map((error) => (
            <div
              key={error.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                    <div
                      className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full border ${getSeverityColor(
                        error.severity
                      )}`}
                    >
                      {getSeverityIcon(error.severity)}
                      <span className="text-sm font-medium">
                        {error.severity}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {error.category}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{error.views} lượt xem</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Lightbulb className="w-4 h-4" />
                      {error.helpful}% hữu ích
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-red-600 bg-red-50 px-2 sm:px-3 py-1 rounded-lg border border-red-200">
                      {error.errorCode}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                      {error.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {error.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {error.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-600 text-xs sm:text-sm px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="font-medium text-gray-800 text-sm sm:text-base">
                    Hình ảnh lỗi
                  </span>
                </div>
                <div className="relative">
                  <img
                    src={error.errorImage}
                    alt={`Lỗi ${error.errorCode}: ${error.errorName}`}
                    className="w-full h-40 sm:h-48 object-cover rounded-lg border border-gray-200 cursor-pointer"
                    onClick={() =>
                      openImageModal(
                        error.errorImage,
                        error.errorCode,
                        error.errorName,
                        error.description
                      )
                    }
                  />
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4">
                <button
                  onClick={() => toggleSolution(error.id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base mb-3"
                >
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                  {showSolution[error.id] ? "Ẩn cách sửa" : "Xem cách sửa"}
                </button>

                {showSolution[error.id] && (
                  <div className="space-y-4">
                    <div className="relative">
                      <button
                        onClick={() =>
                          copyToClipboard(error.solution, `solution-${error.id}`)
                        }
                        className="absolute top-2 right-2 p-2 rounded hover:bg-gray-100"
                      >
                        {copiedCode === `solution-${error.id}` ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        )}
                      </button>
                      <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm sm:text-base">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Các bước khắc phục:
                        </h4>
                        <ol className="list-decimal list-inside space-y-2">
                          {error.solution.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                        Nguyên nhân có thể:
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1">
                        {error.causes.map((cause, idx) => (
                          <li key={idx}>{cause}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                        Cách tránh lỗi:
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-1">
                        {error.preventions.map((prevention, idx) => (
                          <li key={idx}>{prevention}</li>
                        ))}
                      </ul>
                    </div>

                    {error.relatedErrors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                          Lỗi tương tự:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {error.relatedErrors.map((relatedError, idx) => (
                            <span
                              key={idx}
                              className="bg-orange-50 text-orange-600 text-xs sm:text-sm px-2 py-1 rounded"
                            >
                              {relatedError}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="px-4 sm:px-6 py-4 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                  <span>
                    Cập nhật: {new Date(error.dateAdded).toLocaleDateString("vi-VN")}
                  </span>
                  <div className="flex gap-4 mt-2 sm:mt-0">
                    <button className="hover:text-blue-600">👍 Hữu ích</button>
                    <button className="hover:text-red-600">👎 Không hữu ích</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl sm:text-6xl mb-4">🤔</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Không tìm thấy lỗi nào
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Vui lòng thử:
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base mx-auto max-w-md">
              <li>Thay đổi từ khóa tìm kiếm (VD: mã lỗi, mô tả ngắn)</li>
              <li>Bỏ bớt bộ lọc danh mục hoặc mức độ</li>
              <li>Liên hệ hỗ trợ nếu cần giúp ngay</li>
            </ul>
          </div>
        )}

        {/* Image Modal */}
        {modalImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 sm:p-6">
            <div className="relative w-full max-w-3xl max-h-[90vh]">
              <button
                onClick={closeImageModal}
                className="absolute -top-8 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                <div className="p-4 sm:p-6 bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg sm:text-xl font-bold text-red-600 bg-red-50 px-2 sm:px-3 py-1 rounded-lg border border-red-200">
                      {modalImage.errorCode}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      {modalImage.errorName}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {modalImage.description}
                  </p>
                </div>

                <div className="p-4 sm:p-6">
                  <img
                    src={modalImage.url}
                    alt={`Lỗi ${modalImage.errorCode}: ${modalImage.errorName}`}
                    className="w-full max-h-[60vh] sm:max-h-[70vh] object-contain mx-auto"
                  />
                </div>

                <div className="p-4 sm:p-6 bg-gray-50 text-center">
                  <button
                    onClick={closeImageModal}
                    className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorReferencePage;
import React, { useState, useMemo } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Code,
  ExternalLink,
  Eye,
  EyeOff,
  Bug,
  Lightbulb,
  Copy,
  Check,
  X,
} from "lucide-react";

const ErrorReferencePage = () => {
  // Dữ liệu mẫu về các lỗi lập trình và cách khắc phục
  const [errorData] = useState([
    {
      id: 1,
      errorCode: "500",
      errorName: "Lỗi máy chủ",
      title: "❌ Lỗi khi tải ảnh hoặc video: Không thể kết nối máy chủ",
      description:
        "Lỗi này thường xảy ra khi ứng dụng không thể liên lạc với máy chủ. Có thể do mất mạng hoặc máy chủ đang bị lỗi.",
      category: "Kết nối mạng",
      severity: "Cao",
      tags: ["mạng", "lỗi server", "không tải được"],
      language: "JavaScript",
      errorImage:
        "https://firebasestorage.googleapis.com/v0/b/webdio-20ca8.appspot.com/o/images%2FLocket%2FIMG_8968.PNG?alt=media&token=652291d1-6483-4aec-ac97-3f325d3cdcb0",
      solution: `
  ✅ Cách xử lý:
  - Kiểm tra lại kết nối Internet.
  - Thử tải lại sau vài phút.
  - Nếu vẫn không được, có thể server đang bảo trì. Hãy thử lại sau.`,
      causes: [
        "Mất kết nối mạng",
        "Máy chủ bị lỗi hoặc quá tải",
        "Lỗi cấu hình từ hệ thống",
      ],
      preventions: [
        "Đảm bảo thiết bị có kết nối Internet ổn định",
        "Thử lại vào lúc khác khi server ổn định hơn",
      ],
      relatedErrors: [
        "Không đọc được dữ liệu",
        "Lỗi mạng",
        "Lỗi truy cập máy chủ (CORS)",
      ],
      dateAdded: "2024-01-15",
      views: 1250,
      helpful: 89,
    },
    {
      id: 2,
      errorCode: "404",
      errorName: "Không tìm thấy dữ liệu",
      title: "❌ Lỗi 404: Không tìm thấy thông tin yêu cầu",
      description:
        "Lỗi này xảy ra khi thông tin bạn yêu cầu không tồn tại trên hệ thống.",
      category: "Đường dẫn hoặc dữ liệu không tồn tại",
      severity: "Trung bình",
      tags: ["đường dẫn", "không tìm thấy", "404"],
      language: "HTTP",
      errorImage:
        "https://firebasestorage.googleapis.com/v0/b/webdio-20ca8.appspot.com/o/images%2FLocket%2FIMG_8968.PNG?alt=media&token=652291d1-6483-4aec-ac97-3f325d3cdcb0",
      solution: `
  ✅ Cách xử lý:
  - Kiểm tra lại đường dẫn bạn đang truy cập (ví dụ: đường link hoặc địa chỉ).
  - Thử tải lại hoặc quay lại trang trước.
  - Nếu bạn nhấp vào liên kết nào đó mà bị lỗi, có thể nội dung đã bị xóa hoặc không còn tồn tại.`,
      causes: [
        "Bạn nhập sai đường dẫn",
        "Dữ liệu hoặc trang đã bị xoá",
        "Liên kết không còn hoạt động",
      ],
      preventions: [
        "Luôn kiểm tra kỹ liên kết trước khi truy cập",
        "Không lưu hoặc chia sẻ liên kết đã cũ",
        "Nếu gặp lỗi thường xuyên, liên hệ hỗ trợ",
      ],
      relatedErrors: ["Không được phép truy cập", "Lỗi hệ thống 500"],
      dateAdded: "2024-01-20",
      views: 980,
      helpful: 75,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showSolution, setShowSolution] = useState({});
  const [copiedCode, setCopiedCode] = useState("");
  const [modalImage, setModalImage] = useState(null);

  // Lấy danh sách unique values
  const categories = [...new Set(errorData.map((item) => item.category))];
  const severities = [...new Set(errorData.map((item) => item.severity))];
  const languages = [...new Set(errorData.map((item) => item.language))];

  // Filter dữ liệu
  const filteredData = useMemo(() => {
    return errorData.filter((item) => {
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
      const matchesLanguage =
        !selectedLanguage || item.language === selectedLanguage;

      return (
        matchesSearch && matchesCategory && matchesSeverity && matchesLanguage
      );
    });
  }, [
    errorData,
    searchTerm,
    selectedCategory,
    selectedSeverity,
    selectedLanguage,
  ]);

  const toggleSolution = (id) => {
    setShowSolution((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const openImageModal = (imageUrl, errorCode, errorName) => {
    setModalImage({ url: imageUrl, errorCode, errorName });
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 ";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "low":
        return <CheckCircle className="w-4 h-4" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4" />;
      case "high":
        return <Bug className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="h-16"></div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            🐛 Tra Cứu Lỗi Khi Sử Dụng
          </h1>
          <p className="text-gray-600 text-lg">
            Tìm kiếm mã lỗi, nguyên nhân và cách khắc phục nhanh chóng
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-base-200 rounded-xl shadow-lg p-6 mb-8 border ">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm lỗi, mã lỗi, ngôn ngữ..."
                className="w-full pl-10 pr-4 py-3 border border-base-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="px-4 py-3 border border-base-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

            {/* Severity Filter */}
            <select
              className="px-4 py-3 border border-base-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="">Tất cả mức độ</option>
              {severities.map((severity) => (
                <option key={severity} value={severity}>
                  {severity === "low"
                    ? "Thấp"
                    : severity === "medium"
                    ? "Trung bình"
                    : "Cao"}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Tìm thấy {filteredData.length} lỗi phù hợp
          </div>
        </div>

        {/* Error Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredData.map((error) => (
            <div
              key={error.id}
              className="bg-base-200 rounded-xl shadow-lg border  overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getSeverityColor(
                        error.severity
                      )}`}
                    >
                      {getSeverityIcon(error.severity)}
                      <span className="text-sm font-medium">
                        {error.severity === "low"
                          ? "Thấp"
                          : error.severity === "medium"
                          ? "Trung bình"
                          : "Cao"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 bg-base-300 px-2 py-1 rounded">
                      {error.category}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{error.views} lượt xem</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Lightbulb className="w-3 h-3" />
                      {error.helpful}% hữu ích
                    </div>
                  </div>
                </div>

                {/* Error Code & Name */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                      {error.errorCode}
                    </span>
                    <h3 className="text-xl font-bold text-base-content flex-1">
                      {error.errorName}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">{error.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {error.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-base-300 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Error Image */}
              <div className="px-6 py-4 bg-base-100 border-base-100">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-base-content">Ví dụ lỗi</span>
                </div>

                <div className="relative group">
                  <img
                    src={error.errorImage}
                    alt={`Error ${error.errorCode}: ${error.errorName}`}
                    className="w-full h-48 object-cover rounded-lg border  cursor-pointer transition-transform duration-200 hover:scale-105"
                  />
                  <div
                    onClick={() =>
                      openImageModal(
                        error.errorImage,
                        error.errorCode,
                        error.errorName
                      )
                    }
                    className="absolute inset-0 bg-black/20 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-base-200 bg-opacity-90 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium text-base-content">
                        Nhấn để phóng to
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solution */}
              <div className="px-6 py-4">
                <button
                  onClick={() => toggleSolution(error.id)}
                  className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium mb-3"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showSolution[error.id] ? "Ẩn" : "Hiện"} cách khắc phục
                </button>

                {showSolution[error.id] && (
                  <div className="space-y-4">
                    <div className="relative">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            error.solution,
                            `solution-${error.id}`
                          )
                        }
                        className="absolute top-2 right-2 p-1 rounded hover:bg-gray-700 z-10"
                      >
                        {copiedCode === `solution-${error.id}` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <pre className="text-gray-500 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{error.solution}</code>
                      </pre>
                    </div>

                    {/* Causes */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        🔍 Nguyên nhân thường gặp:
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {error.causes.map((cause, idx) => (
                          <li key={idx}>{cause}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Preventions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        💡 Cách phòng tránh:
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {error.preventions.map((prevention, idx) => (
                          <li key={idx}>{prevention}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Related Errors */}
                    {error.relatedErrors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          🔗 Lỗi liên quan:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {error.relatedErrors.map((relatedError, idx) => (
                            <span
                              key={idx}
                              className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded"
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

              {/* Footer */}
              <div className="px-6 py-4 bg-base-100">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    Cập nhật:{" "}
                    {new Date(error.dateAdded).toLocaleDateString("vi-VN")}
                  </span>
                  <div className="flex gap-4">
                    <button className="hover:text-green-600">👍 Hữu ích</button>
                    <button className="hover:text-red-600">
                      👎 Không hữu ích
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-base-content text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy lỗi phù hợp
            </h3>
            <p className="text-gray-600">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm lỗi khác
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute -top-10 right-0 text-white hover:text-base-100 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <div className="p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                    {modalImage.errorCode}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {modalImage.errorName}
                  </h3>
                </div>
              </div>

              <div className="p-4">
                <img
                  src={modalImage.url}
                  alt={`Error ${modalImage.errorCode}: ${modalImage.errorName}`}
                  className="max-w-full max-h-96 object-contain mx-auto"
                />
              </div>

              <div className="p-4 bg-gray-50 border-t  text-center">
                <button
                  onClick={closeImageModal}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorReferencePage;

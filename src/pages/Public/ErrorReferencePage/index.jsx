import React, { useState, useMemo, useCallback } from "react";
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
  const [expandedSolutions, setExpandedSolutions] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  // Memoize categories and severities
  const { categories, severities } = useMemo(
    () => ({
      categories: [...new Set(errorData.map((item) => item.category))],
      severities: [...new Set(errorData.map((item) => item.severity))],
    }),
    [errorData]
  );

  // Memoize filtered data
  const filteredData = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return errorData
      .filter((item) => {
        // Optimize search by checking short-circuit conditions first
        if (selectedCategory && item.category !== selectedCategory)
          return false;
        if (selectedSeverity && item.severity !== selectedSeverity)
          return false;

        if (!searchTerm) return true;

        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.errorCode.toLowerCase().includes(searchLower) ||
          item.errorName.toLowerCase().includes(searchLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => b.views - a.views);
  }, [errorData, searchTerm, selectedCategory, selectedSeverity]);

  // Optimize callbacks
  const toggleSolution = useCallback((id) => {
    setExpandedSolutions((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }, []);

  const copyToClipboard = useCallback(async (solution, id) => {
    try {
      await navigator.clipboard.writeText(solution.join("\n"));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const openImageModal = useCallback(
    (imageUrl, errorCode, errorName, description) => {
      setModalImage({ url: imageUrl, errorCode, errorName, description });
    },
    []
  );

  const closeImageModal = useCallback(() => {
    setModalImage(null);
  }, []);

  // Optimize severity config
  const severityConfig = useMemo(
    () => ({
      thấp: { class: "badge-success", icon: CheckCircle },
      "trung bình": { class: "badge-warning", icon: AlertTriangle },
      cao: { class: "badge-error", icon: Bug },
    }),
    []
  );

  const getSeverityData = useCallback(
    (severity) => {
      const config = severityConfig[severity.toLowerCase()];
      return config || { class: "badge", icon: AlertTriangle };
    },
    [severityConfig]
  );

  return (
    <div className="min-h-screen bg-base-200 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Simplified */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Tra Cứu & Sửa Lỗi
          </h1>
          <p className="text-gray-600">
            Nhập mã lỗi hoặc mô tả để tìm cách khắc phục
          </p>
        </header>

        {/* Search & Filter - Optimized */}
        <div className="bg-base rounded-lg shadow p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nhập mã lỗi hoặc mô tả (VD: 500, không tải ảnh)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          <div className="text-sm text-gray-600">
            {filteredData.length} kết quả
          </div>
        </div>

        {/* Error Cards - Optimized */}
        <div className="space-y-4 space-x-4 grid md:grid-cols-2">
          {filteredData.map((error) => {
            const severityData = getSeverityData(error.severity);
            const SeverityIcon = severityData.icon;
            const isExpanded = expandedSolutions.has(error.id);

            const severityClass =
              error.severity === "Cao"
                ? "bg-red-100 text-red-800"
                : error.severity === "Trung bình"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800";

            return (
              <div
                key={error.id}
                className="bg-base-100 rounded-lg shadow-lg p-4"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${severityClass}`}
                    >
                      <SeverityIcon className="w-3 h-3" />
                      {error.severity}
                    </span>
                    <span className="px-2 py-1 bg-base-300 text-base-content rounded-full text-xs">
                      {error.category}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 text-right">
                    <div>{error.views} lượt xem</div>
                    <div className="flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      {error.helpful}%
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-mono">
                      {error.errorCode}
                    </span>
                    <h3 className="text-lg font-semibold text-base-content">
                      {error.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {error.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {error.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Image - Optimized */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm text-base-content">
                      Hình ảnh lỗi
                    </span>
                  </div>
                  <img
                    src={error.errorImage}
                    alt={`Lỗi ${error.errorCode}`}
                    className="w-full h-32 object-cover rounded cursor-pointer border border-gray-200 hover:border-blue-400 transition-colors"
                    onClick={() =>
                      openImageModal(
                        error.errorImage,
                        error.errorCode,
                        error.errorName,
                        error.description
                      )
                    }
                    loading="lazy"
                  />
                </div>

                {/* Solution Toggle */}
                <button
                  onClick={() => toggleSolution(error.id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-3 text-sm font-medium"
                >
                  <Lightbulb className="w-4 h-4" />
                  {isExpanded ? "Ẩn cách sửa" : "Xem cách sửa"}
                </button>

                {/* Solution Details - Optimized */}
                {isExpanded && (
                  <div className="space-y-3 bg-gray-50 p-3 rounded">
                    {/* Solution Steps */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          copyToClipboard(error.solution, error.id)
                        }
                        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-base-content hover:bg-gray-200 rounded"
                      >
                        {copiedId === error.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <h4 className="font-semibold mb-2 text-base-content">
                        Các bước khắc phục:
                      </h4>
                      <ol className="list-decimal list-inside space-y-1 pr-8">
                        {error.solution.map((step, idx) => (
                          <li key={idx} className="text-sm text-base-content">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Causes & Preventions - Grid layout for better space usage */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <h4 className="font-semibold mb-1 text-sm text-base-content">
                          Nguyên nhân:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                          {error.causes.map((cause, idx) => (
                            <li key={idx}>{cause}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1 text-sm text-base-content">
                          Cách tránh:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                          {error.preventions.map((prevention, idx) => (
                            <li key={idx}>{prevention}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Related Errors */}
                    {error.relatedErrors.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-1 text-sm text-base-content">
                          Lỗi tương tự:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {error.relatedErrors.map((rel, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
                            >
                              {rel}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer - Simplified */}
                <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                  <span>
                    {new Date(error.dateAdded).toLocaleDateString("vi-VN")}
                  </span>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 hover:bg-base-300 rounded">
                      👍
                    </button>
                    <button className="px-2 py-1 hover:bg-base-300 rounded">
                      👎
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty State - Simplified */}
          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">🤔</div>
              <h3 className="text-lg font-semibold mb-2">
                Không tìm thấy lỗi nào
              </h3>
              <p className="text-sm">Thử thay đổi từ khóa hoặc bộ lọc</p>
            </div>
          )}
        </div>

        {/* Image Modal - Optimized */}
        {modalImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-2xl max-h-screen-90">
              <button
                onClick={closeImageModal}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="bg-base rounded-lg overflow-hidden">
                <div className="p-3 bg-base-300 border-b">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-mono">
                      {modalImage.errorCode}
                    </span>
                    <h3 className="font-semibold text-base-content">
                      {modalImage.errorName}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <img
                    src={modalImage.url}
                    alt={`${modalImage.errorCode} ${modalImage.errorName}`}
                    className="w-full max-h-96 object-contain mx-auto"
                  />
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

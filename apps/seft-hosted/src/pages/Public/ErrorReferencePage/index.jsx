import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Bug,
  Copy,
  Check,
  Lightbulb,
} from "lucide-react";
import { getListIncidents } from "@/services";

const severityMap = {
  low: {
    label: "Thấp",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  medium: {
    label: "Trung bình",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: AlertTriangle,
  },
  high: {
    label: "Cao",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: Bug,
  },
};

const ErrorReferencePage = () => {
  const [errors, setErrors] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const data = await getListIncidents();
        setErrors(data);
      } catch (err) {
        console.error("❌ Không thể lấy danh sách:", err);
      }
    };

    fetchDatas();
  }, []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return errors.filter(
      (e) =>
        e.title.toLowerCase().includes(s) ||
        e.description.toLowerCase().includes(s) ||
        e.code.toLowerCase().includes(s) ||
        e.name.toLowerCase().includes(s)
    );
  }, [search, errors]);

  const copySolutions = async (item) => {
    await navigator.clipboard.writeText(item.solutions.join("\n"));
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const openImageModal = (images, index) => {
    setSelectedImage(images);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedImage.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedImage.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🔍 Tra cứu lỗi & Khắc phục
          </h1>
          <p className="text-gray-600 text-lg">
            Tìm kiếm và giải quyết lỗi nhanh chóng
          </p>
        </div>

        {/* Search Box */}
        <div className="relative mb-8 max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Nhập mã lỗi, từ khóa hoặc mô tả..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((err) => {
            const sev = severityMap[err.severity] || severityMap.medium;
            const Icon = sev.icon;
            const isOpen = expanded === err.id;

            return (
              <div
                key={err.id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300"
              >
                {/* Header Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border ${sev.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {sev.label}
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
                    {err.category}
                  </span>
                </div>

                {/* Error Code & Title */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-red-500 text-white rounded-md text-xs font-mono font-bold">
                      {err.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {err.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {err.description}
                  </p>
                </div>

                {/* Image Gallery */}
                {err.images && err.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      📷 Hình ảnh minh họa ({err.images.length})
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {err.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() => openImageModal(err.images, idx)}
                          className="flex-shrink-0 w-36 h-full rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-all hover:scale-105"
                        >
                          <img
                            src={imgUrl}
                            alt={`Error ${err.code} - Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Toggle Solutions Button */}
                <button
                  onClick={() => setExpanded(isOpen ? null : err.id)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isOpen
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-200"
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  {isOpen ? "Ẩn hướng dẫn khắc phục" : "Xem hướng dẫn khắc phục"}
                </button>

                {/* Expanded Solutions Panel */}
                {isOpen && (
                  <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 space-y-4">
                    {/* Solutions */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <span className="text-green-500">✅</span>
                          Cách khắc phục
                        </h4>
                        <button
                          onClick={() => copySolutions(err)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="Sao chép hướng dẫn"
                        >
                          {copiedId === err.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                      <ol className="space-y-2">
                        {err.solutions.map((s, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-sm text-gray-700"
                          >
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <span className="flex-1 pt-0.5">{s}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Causes */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-orange-500">⚠️</span>
                        Nguyên nhân
                      </h4>
                      <ul className="space-y-1.5">
                        {err.causes.map((c, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm text-gray-600"
                          >
                            <span className="text-orange-500">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Preventions */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-blue-500">🛡️</span>
                        Cách phòng tránh
                      </h4>
                      <ul className="space-y-1.5">
                        {err.preventions.map((p, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm text-gray-600"
                          >
                            <span className="text-blue-500">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Footer Date */}
                <p className="text-xs text-gray-400 mt-4 text-right">
                  Cập nhật: {new Date(err.added).toLocaleDateString("vi-VN")}
                </p>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-500">
              Thử tìm kiếm với từ khóa khác hoặc mã lỗi khác
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorReferencePage;
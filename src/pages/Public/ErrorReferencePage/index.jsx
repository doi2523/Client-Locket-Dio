import React, { useState, useMemo } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Bug,
  Copy,
  Check,
  X,
  Eye,
  Lightbulb,
} from "lucide-react";

const severityMap = {
  low: {
    label: "Thấp",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  medium: {
    label: "Trung bình",
    color: "bg-yellow-100 text-yellow-700",
    icon: AlertTriangle,
  },
  high: { label: "Cao", color: "bg-red-100 text-red-700", icon: Bug },
};

const ErrorReferencePage = () => {
  const [errors] = useState([
    {
      id: 1,
      code: "500",
      name: "Lỗi máy chủ",
      title: "Không thể tải ảnh hoặc video",
      description:
        "Bạn gặp lỗi này khi ứng dụng không kết nối được với máy chủ. Có thể do mất mạng hoặc máy chủ đang gặp sự cố, gián đoạn quá trình gửi đi.",
      category: "network",
      severity: "medium",
      image: [
        "https://firebasestorage.googleapis.com/v0/b/webdio-20ca8.appspot.com/o/images%2FLocket%2FIMG_8968.PNG?alt=media&token=652291d1-6483-4aec-ac97-3f325d3cdcb0",
        "https://cdn.discordapp.com/attachments/1379014441848541275/1442447570243682394/Screenshot_2025-11-19-13-43-31-61_40deb401b9ffe8e1df2f1cc5ba480b12.jpg?ex=6925777c&is=692425fc&hm=c0537fd9b8c88027d161cbb914b2c63982b681dca0e42beb0e963933c63d6b58&",
      ],
      solutions: [
        "Kiểm tra kết nối Internet của bạn.",
        "Thử làm mới trang hoặc đợi vài phút.",
        "Nếu vẫn lỗi, máy chủ có thể đang bảo trì.",
        "Các bài đăng không hiển thị hình ảnh/video thì nên xoá bỏ bởi chúng sẽ được xoá sau khoảng thời gian.",
      ],
      causes: ["Mất kết nối Internet", "Máy chủ quá tải hoặc gặp sự cố"],
      preventions: [
        "Đảm bảo kết nối mạng ổn định.",
        "Thử lại sau một thời gian.",
      ],
      related: [],
      added: "2025-06-15",
    },
    {
      id: 2,
      code: "null",
      name: "Camera not Active",
      title: "Không thể sử dụng Camera",
      description:
        "Lỗi này xảy ra khi quyền truy cập camera chưa được sự cho phép của trình duyệt.",
      category: "feature",
      severity: "medium",
      image: [
        "https://cdn.discordapp.com/attachments/1379014441848541275/1442446407632949389/IMG_2785.png?ex=69257666&is=692424e6&hm=a7806bc44598c153a4c5da4098198a4b835e20e2e2e3c625b6730221d8368384&",
      ],
      solutions: [
        "Kiểm tra lại quyền truy cập của Camera.",
        "Nếu Android dùng Chrome, iOS dùng Safari để cấp quyền.",
        "PWA trên iOS có thể cần 1–2 ngày để cấp quyền camera hoàn chỉnh.",
      ],
      causes: ["Chưa cấp quyền", "Chế độ PWA iOS"],
      preventions: ["Kiểm tra quyền truy cập", "Cập nhật ứng dụng web"],
      related: [],
      added: "2025-07-20",
    },
  ]);

  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-100 px-5 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Tra cứu lỗi & hướng dẫn khắc phục
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Tìm lỗi theo mã hoặc mô tả
        </p>

        {/* Search Box */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Nhập mã lỗi hoặc từ khóa..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((err) => {
            const sev = severityMap[err.severity] || severityMap.medium;
            const Icon = sev.icon;

            const isOpen = expanded === err.id;

            return (
              <div
                key={err.id}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                {/* Top Badges */}
                <div className="flex gap-2 mb-3">
                  <span
                    className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${sev.color}`}
                  >
                    <Icon className="w-3 h-3" />
                    {sev.label}
                  </span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                    {err.category}
                  </span>
                </div>

                {/* Title */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-mono">
                    {err.code}
                  </span>
                  <h3 className="font-semibold text-gray-900">{err.title}</h3>
                </div>

                <p className="text-gray-600 text-sm mb-3">{err.description}</p>

                {/* Image */}
                <details className="mb-3">
                  <summary className="flex items-center gap-1 mb-1">
                    <span className="text-sm font-medium text-gray-800">
                      Hình ảnh lỗi
                    </span>
                  </summary>
                  <div className="flex flex-row bg-base-300 p-2 gap-2 overflow-x-auto">
                    {err.image.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        className="w-auto h-80 object-contain cursor-pointer rounded-2xl"
                      />
                    ))}
                  </div>
                </details>

                {/* Toggle */}
                <button
                  onClick={() => setExpanded(isOpen ? null : err.id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  {isOpen ? "Ẩn hướng dẫn" : "Xem hướng dẫn"}
                </button>

                {isOpen && (
                  <div className="bg-gray-50 rounded p-3 space-y-3 border">
                    <div className="relative">
                      <button
                        onClick={() => copySolutions(err)}
                        className="absolute top-1 right-1 p-1 hover:bg-gray-200 rounded"
                      >
                        {copiedId === err.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <h4 className="font-semibold mb-1">Cách khắc phục:</h4>
                      <ol className="list-decimal list-inside text-sm space-y-1">
                        {err.solutions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1 text-sm">
                        Nguyên nhân:
                      </h4>
                      <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                        {err.causes.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1 text-sm">
                        Cách tránh lỗi:
                      </h4>
                      <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                        {err.preventions.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-3">
                  {new Date(err.added).toLocaleDateString("vi-VN")}
                </p>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            Không tìm thấy lỗi phù hợp
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorReferencePage;

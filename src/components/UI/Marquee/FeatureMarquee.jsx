import Marquee from "react-fast-marquee";
import { Check, X } from "lucide-react";

const FEATURE_LABELS = {
  image_upload: "Đăng ảnh",
  video_upload: "Đăng video",
  custom_caption: "Tùy chỉnh caption",
  unlimited_posts: "Bài viết không giới hạn",
  priority_support: "Hỗ trợ ưu tiên",
  remove_watermark: "Xóa watermark",
  image_gif: "Caption Gif",
  image_icon: "Caption Icon",
  invite_cleanup_tool: "Công cụ dọn dẹp lời mời",
};

const FEATURE_TOOLTIPS = {
  image_upload: "Cho phép tải lên hình ảnh cho bài viết",
  video_upload: "Cho phép tải lên video cho bài viết",
  custom_caption: "Tùy chỉnh văn bản caption theo ý muốn",
  unlimited_posts: "Không giới hạn số lượng bài viết",
  priority_support: "Nhận hỗ trợ nhanh chóng từ đội ngũ CSKH",
  remove_watermark: "Xóa logo hoặc watermark trên nội dung",
  image_gif: "Thêm hiệu ứng GIF vào caption",
  image_icon: "Thêm biểu tượng tùy chỉnh vào caption",
  invite_cleanup_tool: "Công cụ dọn dẹp lời mời",
};

const FeatureMarquee = ({ flags }) => {
  if (!flags) return null;

  const maxUploads = flags.max_uploads;

  const featureItems = Object.entries(flags)
    .filter(([key]) => key !== "max_uploads")
    .map(([key, value]) => {
      const isActive = !!value;
      return (
        <div
          key={key}
          className={`flex flex-col items-center justify-center px-4 py-2 mx-2 rounded-lg border text-center transition-all min-w-[140px] ${
            isActive
              ? "bg-green-50 border-green-200"
              : "bg-gray-100 border-gray-300"
          }`}
          title={FEATURE_TOOLTIPS[key] || "Không có mô tả"}
        >
          {isActive ? (
            <Check className="w-5 h-5 text-green-600 mb-1" />
          ) : (
            <X className="w-5 h-5 text-gray-400 mb-1" />
          )}
          <span
            className={`text-xs ${
              isActive
                ? "text-green-800 font-medium"
                : "text-gray-400 line-through"
            }`}
          >
            {FEATURE_LABELS[key] || key}
          </span>
        </div>
      );
    });

  // Thêm phần dung lượng upload nếu có
  const uploadLimits = [];
  if (typeof maxUploads === "object") {
    if (maxUploads.image) {
      uploadLimits.push(
        <div
          key="image-limit"
          className="flex flex-col items-center justify-center px-4 py-2 mx-2 rounded-lg border bg-blue-50 border-blue-200 min-w-[140px]"
          title="Dung lượng ảnh tối đa cho mỗi bài viết"
        >
          <span className="text-blue-600 font-semibold">
            🖼️ {maxUploads.image}MB
          </span>
          <span className="text-xs text-blue-800">Ảnh / bài</span>
        </div>
      );
    }
    if (maxUploads.video) {
      uploadLimits.push(
        <div
          key="video-limit"
          className="flex flex-col items-center justify-center px-4 py-2 mx-2 rounded-lg border bg-blue-50 border-blue-200 min-w-[140px]"
          title="Dung lượng video tối đa cho mỗi bài viết"
        >
          <span className="text-blue-600 font-semibold">
            📹 {maxUploads.video}MB
          </span>
          <span className="text-xs text-blue-800">Video / bài</span>
        </div>
      );
    }
  }

  return (
    <div className="relative overflow-hidden py-2">
      <Marquee
        speed={40}
        gradient={true}
        gradientColor={[248, 251, 253]}
        gradientWidth={60}
      >
        {[...uploadLimits, ...featureItems]}
      </Marquee>
    </div>
  );
};

export default FeatureMarquee;

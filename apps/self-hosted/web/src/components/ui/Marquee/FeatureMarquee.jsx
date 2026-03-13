import Marquee from "react-fast-marquee";
import { Check, X } from "lucide-react";

const FEATURE_LABELS = {
  image_upload: "Đăng ảnh",
  video_upload: "Đăng video",
  custom_caption: "Tùy chỉnh caption",
  unlimited_posts: "Bài viết không giới hạn",
  priority_support: "Hỗ trợ ưu tiên",
  remove_watermark: "Xóa watermark",
  caption_gif: "Caption Gif",
  caption_image: "Caption Icon",
  invite_cleanup_tool: "Công cụ dọn dẹp lời mời",
  restore_streak_tool: "Khôi phục chuỗi Locket",
  celebrity_tool: "Theo dõi người nổi tiếng",
  data_export_tool: "Xuất dữ liệu Locket",
  video_record_max_length: "Quay video 15s",
};

const FEATURE_TOOLTIPS = {
  image_upload: "Cho phép tải lên hình ảnh cho bài viết",
  video_upload: "Cho phép tải lên video cho bài viết",
  custom_caption: "Tùy chỉnh caption theo ý muốn",
  unlimited_posts: "Không giới hạn số bài viết",
  priority_support: "Hỗ trợ ưu tiên",
  remove_watermark: "Xóa watermark trên nội dung",
  caption_gif: "Thêm hiệu ứng GIF vào caption",
  caption_image: "Thêm icon vào caption",
  invite_cleanup_tool: "Dọn dẹp lời mời",
  restore_streak_tool: "Khôi phục chuỗi streak",
};

const FeatureMarquee = ({ flags }) => {
  if (!flags) return null;

  const maxUploads = flags.max_uploads;

  // LIST FEATURE ITEMS
  const featureItems = Object.entries(flags)
    .filter(([key]) => key !== "max_uploads")
    .map(([key, value]) => {
      const isActive = !!value;
      return (
        <div
          key={key}
          className={`flex flex-col items-center justify-center px-4 py-2 mx-2 rounded-lg border text-center transition-all min-w-[150px] ${
            isActive
              ? "bg-green-50 border-green-200"
              : "bg-gray-100 border-gray-300"
          }`}
          title={FEATURE_TOOLTIPS[key] || ""}
        >
          {isActive ? (
            <Check className="w-5 h-5 text-green-600 mb-1" />
          ) : (
            <X className="w-5 h-5 text-gray-400 mb-1" />
          )}
          <span
            className={`text-xs ${
              isActive ? "text-green-800 font-medium" : "text-gray-400 line-through"
            }`}
          >
            {FEATURE_LABELS[key] || key}
          </span>
        </div>
      );
    });

  // SPLIT 2 ROWS EVENLY
  const mid = Math.ceil(featureItems.length / 2);
  const row1 = featureItems.slice(0, mid);
  const row2 = featureItems.slice(mid);

  return (
    <div className="relative space-y-3">

      {/* 🔵 Upload Limits */}
      <div className="flex items-start justify-start gap-3">
        {maxUploads?.image && (
          <div className="flex flex-col items-center px-4 py-2 rounded-lg border bg-blue-50 border-blue-200 min-w-[140px]">
            <span className="text-blue-600 font-semibold">🖼️ {maxUploads.image}MB</span>
            <span className="text-md text-blue-800">Ảnh / bài</span>
          </div>
        )}

        {maxUploads?.video && (
          <div className="flex flex-col items-center px-4 py-2 rounded-lg border bg-blue-50 border-blue-200 min-w-[140px]">
            <span className="text-blue-600 font-semibold">📹 {maxUploads.video}MB</span>
            <span className="text-md text-blue-800">Video / bài</span>
          </div>
        )}
      </div>

      <Marquee
        speed={30}
        gradient
        gradientColor={[248, 251, 253]}
        gradientWidth={60}
        className="pt-1"
      >
        {row1}
      </Marquee>

      <Marquee
        speed={30}
        direction="right"
        gradient
        gradientColor={[248, 251, 253]}
        gradientWidth={60}
      >
        {row2}
      </Marquee>
    </div>
  );
};

export default FeatureMarquee;

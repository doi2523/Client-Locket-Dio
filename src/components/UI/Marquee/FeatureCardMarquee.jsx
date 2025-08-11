import Marquee from "react-fast-marquee";

const FEATURES = [
  {
    icon: (
      <img
        src="https://cdn.locket-dio.com/v1/gif/videocam.gif"
        alt="videocam"
        className="w-8 h-8 object-contain"
      />
    ),
    title: "Chụp & Quay video",
    description:
      "Ghi lại khoảnh khắc trực tiếp ngay trên trình duyệt một cách dễ dàng và nhanh chóng, không cần cài đặt ứng dụng phức tạp.",
    gradientFrom: "from-blue-500/10",
    gradientTo: "to-blue-600/10",
    iconFrom: "from-blue-500",
    iconTo: "to-blue-600",
  },
  {
    icon: (
      <img
        src="https://cdn.locket-dio.com/v1/gif/celebration.gif"
        alt="celebration"
        className="w-8 h-8 object-contain"
      />
    ),
    title: "Caption sáng tạo",
    description:
      "Thêm caption cá nhân hóa đầy cảm xúc và phong cách độc đáo. Tạo dấu ấn riêng biệt với mỗi khoảnh khắc đáng nhớ của bạn.",
    gradientFrom: "from-purple-500/10",
    gradientTo: "to-purple-600/10",
    iconFrom: "from-purple-500",
    iconTo: "to-purple-600",
  },
  {
    icon: (
      <img
        src="https://cdn.locket-dio.com/v1/gif/bolt.gif"
        alt="bolt"
        className="w-8 h-8 object-contain"
      />
    ),
    title: "Chia sẻ dễ dàng",
    description:
      "Chia sẻ khoảnh khắc tức thì với bạn bè chỉ bằng một cú click đơn giản, không cần tải về hay qua nhiều bước phức tạp.",
    gradientFrom: "from-pink-500/10",
    gradientTo: "to-pink-600/10",
    iconFrom: "from-pink-500",
    iconTo: "to-pink-600",
  },
  {
    icon: (
      <img
        src="https://cdn.locket-dio.com/v1/gif/category.gif"
        alt="category"
        className="w-8 h-8 object-contain"
      />
    ),
    title: "WebApp tiện lợi",
    description:
      "Truy cập mọi tính năng trực tiếp từ trình duyệt như một ứng dụng cài đặt, hỗ trợ PWA để hoạt động mượt mà ngay cả khi offline.",
    gradientFrom: "from-green-500/10",
    gradientTo: "to-green-600/10",
    iconFrom: "from-green-500",
    iconTo: "to-green-600",
  },

  {
    icon: (
      <img
        src="https://cdn.locket-dio.com/v1/gif/notification.gif"
        alt="notification"
        className="w-8 h-8 object-contain"
      />
    ),
    title: "Thông báo thông minh",
    description:
      "Thông báo khi có moment mới hoặc khi bạn cần biết, tính năng mới, celebrate mới.",
    gradientFrom: "from-orange-500/10",
    gradientTo: "to-orange-600/10",
    iconFrom: "from-orange-500",
    iconTo: "to-orange-600",
  },
  {
    icon: (
      <img
        src="https://cdn.locket-dio.com/v1/gif/calendar.gif"
        alt="calendar"
        className="w-8 h-8 object-contain"
      />
    ),
    title: "Xem lại moment",
    description:
      "Dễ dàng xem lại và sắp xếp những moment đã gửi trước đây, không bỏ lỡ kỷ niệm nào.",
    gradientFrom: "from-cyan-500/10",
    gradientTo: "to-cyan-600/10",
    iconFrom: "from-cyan-500",
    iconTo: "to-cyan-600",
  },
];

const FeatureCardMarquee = () => {
  return (
    <div className="relative overflow-hidden">
      <Marquee
        speed={30}
        gradient={true}
        gradientColor={[248, 251, 253]}
        gradientWidth={200}
      >
        {FEATURES.map((feature, idx) => (
          <div
            key={idx}
            className={`
              relative 
              p-4 rounded-3xl
              mx-3 bg-base-100/30 backdrop-blur-sm
              w-[280px] h-[240px]
              flex-shrink-0 flex flex-col
            `}
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br ${feature.iconFrom} ${feature.iconTo} rounded-2xl flex items-center drop-shadow-md justify-center mb-4`}
            >
              <span className="text-xl">{feature.icon}</span>
            </div>
            <h3 className="text-lg text-left font-bold text-base-content mb-2 leading-tight">
              {feature.title}
            </h3>
            <p className="text-sm text-base-content/80 text-left leading-relaxed line-clamp-6 flex-1">
              {feature.description}
            </p>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default FeatureCardMarquee;

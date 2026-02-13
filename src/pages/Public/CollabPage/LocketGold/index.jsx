import { CircleStar, User, Shield, Zap, Users2 } from "lucide-react";

const features = [
  {
    icon: User,
    title: "Chỉ cần username",
    desc: "Nhập username Locket của bạn là có thể sử dụng ngay — không cần cài đặt hay đăng ký thêm.",
    color: "from-amber-400 to-yellow-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Không cần đăng nhập",
    desc: "Không cần tạo tài khoản hay đăng nhập bất kỳ dịch vụ nào. Dùng xong là xong.",
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "An toàn với thiết bị",
    desc: "Không gây ảnh hưởng đến máy của bạn. Hoạt động trực tiếp trên trình duyệt web.",
    color: "from-blue-400 to-indigo-500",
    bg: "bg-blue-500/10",
  },
];

export default function LocketGold() {
  return (
    <div className="p-4 md:p-6 mx-auto min-h-screen max-w-3xl">
      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 p-[2px] shadow-xl shadow-amber-500/25 mb-8">
        <div className="rounded-[14px] bg-base-100 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-base-content/80 mb-1">
              Truy cập ngay
            </p>
            <p className="text-2xl font-bold text-base-content">
              locketgold.click
            </p>
          </div>
          <a
            href="https://locketgold.click"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-200"
          >
            <CircleStar className="w-5 h-5" />
            Mở website
          </a>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30 p-8 md:p-12 mb-8">
        <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
          <CircleStar className="w-full h-full text-amber-500" strokeWidth={1.5} />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-sm font-medium mb-4">
            <CircleStar className="w-4 h-4" />
            Hợp tác
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-base-content">Locket Dio × </span>
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              LocketGold.click
            </span>
          </h1>
          <p className="text-lg text-base-content/80 max-w-2xl leading-relaxed">
            Website lên Locket Gold chỉ với <strong>username</strong> — không cần
            đăng nhập, không cần tài khoản, không ảnh hưởng thiết bị.
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-500 to-orange-500" />
          Giới thiệu
        </h2>
        <div className="bg-base-200/60 dark:bg-base-300/40 rounded-2xl p-6 border border-base-300">
          <p className="text-base-content/90 leading-relaxed">
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              LocketGold.click
            </span>{" "}
            là website cho phép bạn lên Locket Gold chỉ với username của mình —
            không cần đăng nhập, không cần đăng ký tài khoản bất kỳ, và{" "}
            <span className="font-semibold">không ảnh hưởng đến thiết bị</span>{" "}
            của bạn.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-500 to-orange-500" />
          Ưu điểm nổi bật
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className={`${bg} rounded-2xl p-5 border border-base-300/50 hover:border-amber-400/30 transition-all duration-300 hover:shadow-lg`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}
              >
                <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-semibold mb-2 text-base-content">{title}</h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTV Recruitment */}
      <div className="mb-8 rounded-2xl border-2 border-dashed border-amber-400/50 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-600/30 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Users2 className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 text-base-content">
              Tuyển CTV đồng hành cùng LocketGold.click
            </h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              Bạn muốn đồng hành cùng LocketGold.click? Chúng tôi đang tìm kiếm
              Cộng tác viên (CTV) nhiệt huyết để cùng phát triển và hỗ trợ cộng
              đồng người dùng. Liên hệ qua Facebook để biết thêm chi tiết.
            </p>
            <a
              href="https://www.facebook.com/vnkin.06"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors"
            >
              <Users2 className="w-4 h-4" />
              Đăng ký làm CTV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

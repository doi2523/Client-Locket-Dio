import { useState } from "react";
import { Link } from "react-router-dom";

export default function StepsSection() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      number: "01",
      icon: "🔐",
      title: "Đăng nhập",
      description: "Đăng nhập bằng tài khoản Locket của bạn để bắt đầu sử dụng Locket Camera.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "02",
      icon: "📸",
      title: "Chụp hoặc quay",
      description: "Mở camera ngay trên trình duyệt và ghi lại khoảnh khắc.",
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "03",
      icon: "✍️",
      title: "Thêm caption",
      description: "Viết caption độc đáo hoặc chọn các caption có sẵn để trang trí cho khoảnh khác của bạn.",
      color: "from-pink-500 to-rose-500",
    },
    {
      number: "04",
      icon: "🚀",
      title: "Chia sẻ ngay",
      description: "Đăng lên Locket hoặc lưu lại làm kỷ niệm.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 text-white max-w-3xl mx-auto">
          <div className="inline-block px-5 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-white/20 shadow-sm mb-5">
            <span className="text-sm font-semibold text-gray-700">
              Hướng dẫn sử dụng
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Cách sử dụng đơn giản
          </h2>
          <p className="text-base md:text-lg text-gray-200 leading-relaxed">
            Chỉ với 4 bước đơn giản, bạn có thể tạo và chia sẻ những khoảnh khắc
            tuyệt vời.
          </p>
        </div>

        {/* Mobile: Manual navigation */}
        <div className="block lg:hidden">
          <div className="relative bg-base-100/30 backdrop-blur-sm rounded-2xl p-5 shadow-lg text-left min-h-[260px] flex flex-col justify-between">
            {/* Number square */}
            <div
              className={`absolute top-0 left-0 w-10 h-10 rounded-tl-2xl rounded-br-2xl bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center shadow-lg`}
            >
              <span className="text-white font-bold">
                {steps[currentStep].number}
              </span>
            </div>

            {/* Icon */}
            <div className="text-6xl mb-3 text-center animate-bounce">
              {steps[currentStep].icon}
            </div>
            {/* Title */}
            <h3 className="text-xl font-semibold mb-1">
              {steps[currentStep].title}
            </h3>
            {/* Description */}
            <p className="text-gray-600 text-sm">
              {steps[currentStep].description}
            </p>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                disabled={currentStep === 0}
                className="btn btn-circle disabled:opacity-50 transition-colors"
                aria-label="Quay lại"
              >
                ←
              </button>
              <div className="flex space-x-2">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i === currentStep ? "bg-primary" : "bg-gray-400"
                    }`}
                  ></span>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
                disabled={currentStep === steps.length - 1}
                className="btn btn-circle disabled:opacity-50 transition-colors"
                aria-label="Tiếp"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* PC: Equal height grid */}
        <div className="hidden lg:grid grid-cols-4 gap-6 mt-10 items-stretch">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-base-100/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-left flex flex-col min-h-[320px]"
            >
              {/* Number square */}
              <div
                className={`absolute top-0 left-0 w-10 h-10 rounded-tl-2xl rounded-br-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
              >
                <span className="text-white font-bold">{step.number}</span>
              </div>

              {/* Icon */}
              <div className="text-7xl mb-5 mt-12 flex justify-center items-center">
                {step.icon}
              </div>
              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 text-center">
                {step.title}
              </h3>
              {/* Description */}
              <p className="text-gray-600 text-sm flex-grow text-center">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to={"/login"}
            className="inline-flex rotate-[3deg] bounce-subtle items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
          >
            Bắt đầu ngay
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

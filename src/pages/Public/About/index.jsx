import React from "react";
import MockupiPhone from "@/components/ui/MockupiPhone";
import FeatureList from "@/components/ui/FeatureList";

export default function AboutLocketDio() {
  return (
    <section className="min-h-screen bg-base-200 text-base-content p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-700">
          Giới thiệu về <span className="text-base-content">Locket Dio</span>
        </h1>

        <p className="text-lg leading-8 text-base-content/80 mb-10 text-center max-w-3xl mx-auto">
          Locket Dio - nền tảng mở rộng tiện lợi cho Locket Widget giúp bạn chia
          sẻ ảnh, video trực tiếp lên Locket với giao diện hiện đại và tiện lợi.
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
          <div className="w-full flex justify-center md:scale-90">
            <MockupiPhone />
          </div>
          <div className="-mt-7">
            <FeatureList />
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold mb-2">
            🌐 Truy cập Locket Dio
          </h2>
          <p className="text-gray-700 mb-6">
            Khám phá và bắt đầu chia sẻ những khoảnh khắc đáng nhớ của bạn.
          </p>
          <a
            href="https://locket-dio.space/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-full shadow-md transition duration-300"
          >
            🚀 Truy cập ngay
          </a>
        </div>
      </div>
    </section>
  );
}

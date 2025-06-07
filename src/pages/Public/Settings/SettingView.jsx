import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Loader2 } from "lucide-react"; // Cần: npm install lucide-react

function ImageWithLoader({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-[1/2] bg-gray-100 rounded-lg overflow-hidden">
      {/* Spinner khi chưa load xong */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* Ảnh */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default function SettingView() {
  const { navigation } = useApp();
  const { isFullview, setIsFullview } = navigation;

  const handleSelect = (value) => {
    setIsFullview(value);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold font-lovehouse text-center mb-4 no-select">
        Setting View Locket Dio
      </h1>

      <div className="grid grid-cols-2 gap-6 w-full max-w-[600px] md:max-w-[400px] mx-auto">
        {/* Web View */}
        <div
          onClick={() => handleSelect(false)}
          className={`cursor-pointer border-2 rounded-xl p-3 transition-all duration-500 hover:shadow-lg ${
            !isFullview ? "scale-105" : "scale-100 border-transparent"
          }`}
        >
          <ImageWithLoader
            src="https://firebasestorage.googleapis.com/v0/b/locket-dio.firebasestorage.app/o/Mockup%2Flocket_dio_webview.png?alt=media&token=71f4a342-a16d-4270-8cbf-7679783b687e"
            alt="Web View"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-sm text-primary">Web View</span>
            <input
              type="checkbox"
              checked={!isFullview}
              readOnly
              className="form-checkbox h-4 w-4 text-blue-600"
            />
          </div>
        </div>

        {/* App View */}
        <div
          onClick={() => handleSelect(true)}
          className={`cursor-pointer border-2 rounded-xl p-3 transition-all duration-500 hover:shadow-lg ${
            isFullview ? "scale-105" : "scale-100 border-transparent"
          }`}
        >
          <ImageWithLoader
            src="https://firebasestorage.googleapis.com/v0/b/locket-dio.firebasestorage.app/o/Mockup%2Flocket_dio_appview.png?alt=media&token=7eb7f6c1-bd2f-4f54-be60-15979c6b2a08"
            alt="App View"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-sm text-primary">App View</span>
            <input
              type="checkbox"
              checked={isFullview}
              readOnly
              className="form-checkbox h-4 w-4 text-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Camera, Cloud, Copy, Monitor, Thermometer } from "lucide-react";
import { useLocationWeather } from "@/utils";

const DevPage = () => {
  const [devices, setDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [activeTab, setActiveTab] = useState("camera");
  const [copySuccess, setCopySuccess] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Mock weather data since useLocationWeather isn't available
  const { location, weather } = useLocationWeather();

  // Lấy danh sách thiết bị và khởi động camera mặc định
  useEffect(() => {
    const init = async () => {
      try {
        // Xin quyền truy cập camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop()); // tắt ngay stream

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        setDevices(allDevices);

        const videoInputs = allDevices.filter((d) => d.kind === "videoinput");
        setVideoDevices(videoInputs);

        if (videoInputs.length > 0) {
          setSelectedDeviceId(videoInputs[0].deviceId); // Chọn mặc định camera đầu tiên
        }

        console.log("📋 All Devices:", allDevices);
      } catch (err) {
        console.error("🚫 Không thể truy cập thiết bị:", err);
      }
    };

    init();
  }, []);

  // Khi selectedDeviceId thay đổi → cập nhật stream
  useEffect(() => {
    const startStream = async () => {
      if (!selectedDeviceId || activeTab !== "camera") return;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("🚫 Không thể bật camera:", err);
      }
    };

    startStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [selectedDeviceId, activeTab]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(`${type} copied!`);
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  const tabs = [
    { id: "camera", label: "Camera", icon: Camera },
    { id: "weather", label: "Weather", icon: Cloud },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            <Monitor className="inline-block mr-3 text-blue-600" size={40} />
            DevPage
          </h1>
          <p className="text-gray-600">Device Info & Weather Dashboard</p>
        </div>

        {/* Tabs */}
        <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center px-6 py-4 font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Icon className="mr-2" size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "camera" && (
              <div className="space-y-6">
                {/* Video Preview */}
                <div className="relative">
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black shadow-lg">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {!selectedDeviceId && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <div className="text-white text-center">
                        <Camera size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No camera selected</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Selection */}
                {videoDevices.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-base-content mb-2">
                      Select Camera:
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedDeviceId}
                      onChange={(e) => setSelectedDeviceId(e.target.value)}
                    >
                      {videoDevices.map((device, index) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Device Info */}
                <div className="bg-base-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-base-content">
                      Device Information
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(devices, null, 2),
                          "Device info"
                        )
                      }
                      className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Copy size={16} className="mr-1" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-base-200 rounded-md p-3 max-h-64 overflow-auto">
                    <pre className="text-sm text-base-content">
                      {JSON.stringify(devices, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "weather" && (
              <div className="space-y-6">
                {/* Weather Display */}
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
                  {weather && location ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <img
                            src={`https:${weather.icon}`}
                            alt={weather.condition}
                            className="w-16 h-16 mr-4"
                          />
                          <div>
                            <h2 className="text-3xl font-bold">
                              {weather.temp_c}°C
                            </h2>
                            <p className="text-blue-100">{weather.condition}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4 text-base-content">
                          <div className="bg-base-200 bg-opacity-20 rounded-lg p-3">
                            <div className="flex items-center">
                              <Thermometer size={20} className="mr-2" />
                              <span className="text-sm">Temperature</span>
                            </div>
                            <p className="text-xl font-semibold">
                              {weather.temperature}°F
                            </p>
                          </div>
                          <div className="bg-base-300 bg-opacity-20 rounded-lg p-3">
                            <div className="flex items-center">
                              <Cloud size={20} className="mr-2" />
                              <span className="text-sm">Cloud Cover</span>
                            </div>
                            <p className="text-xl font-semibold">
                              {Math.round(weather.cloud_cover * 100)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Cloud
                        size={48}
                        className="mb-4 animate-pulse text-white/70"
                      />
                      <p className="text-white/80 text-lg">
                        Loading weather data...
                      </p>
                    </div>
                  )}
                </div>

                {/* Weather JSON Data */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Weather JSON Data
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(weather || {}, null, 2),
                          "Weather data"
                        )
                      }
                      className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Copy size={16} className="mr-1" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-white rounded-md p-3 max-h-64 overflow-auto">
                    <pre className="text-sm text-gray-700">
                      {JSON.stringify(
                        weather || { message: "No data yet" },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Copy Success Message */}
        {copySuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
            {copySuccess}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevPage;

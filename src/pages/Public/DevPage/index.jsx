import React, { useEffect, useRef, useState } from "react";

const DevPage = () => {
  const [devices, setDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Lấy danh sách thiết bị và khởi động camera mặc định
  useEffect(() => {
    const init = async () => {
      try {
        // Xin quyền truy cập camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
      if (!selectedDeviceId) return;

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
  }, [selectedDeviceId]);

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">🔍 DevPage – Device Info & Camera</h2>

      {/* Video Preview */}
      <div className="aspect-square w-full rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>

      {/* Select Camera */}
      {videoDevices.length > 0 && (
        <div>
          <label className="font-medium text-sm block mb-1">Chọn Camera:</label>
          <select
            className="border p-2 w-full rounded-md"
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
      <div className="text-sm bg-gray-100 p-4 rounded-md overflow-auto max-h-[300px]">
        <h3 className="font-semibold mb-2">🧾 Thiết bị phát hiện:</h3>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(devices, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DevPage;
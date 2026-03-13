import { useEffect, useState } from "react";
import axios from "axios";
import { SonnerInfo, SonnerSuccess } from "@/components/ui/SonnerToast";
import { Bell, Camera, MapPin } from "lucide-react";
import { CONFIG } from "@/config";
import { API_URL, urlBase64ToUint8Array } from "@/utils";

export default function PermissionsManager() {
  const [permission, setPermission] = useState("default");
  const [subscribed, setSubscribed] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [pushData, setPushData] = useState(null);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    checkSubscription();
  }, []);

  const getSubscription = async () => {
    try {
      SonnerInfo("Hello");
      if (!("serviceWorker" in navigator)) return;

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();

      if (sub) {
        const json = sub.toJSON();

        console.log("Push subscription:", JSON.stringify(json, null, 2));

        setPushData(json);

        SonnerSuccess("Đã lấy subscription");
      } else {
        SonnerInfo("Chưa đăng ký push");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkSubscription = async () => {
    try {
      if (!("serviceWorker" in navigator)) return;

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();

      setSubscribed(!!sub);
    } catch (err) {
      console.error(err);
    }
  };

  const subscribeUser = async () => {
    try {
      if (!("Notification" in window)) return;
      if (!("serviceWorker" in navigator)) return;

      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== "granted") return;

      const registration = await navigator.serviceWorker.ready;

      const existing = await registration.pushManager.getSubscription();

      if (existing) {
        await axios.post(API_URL.REGISTER_PUSH_URL, {
          subscription: existing,
        });

        setSubscribed(true);

        SonnerSuccess("Đã kích hoạt", "Thông báo đã được đăng ký trước đó.");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(CONFIG.keys.vapidPublicKey),
      });

      await axios.post(API_URL.REGISTER_PUSH_URL, { subscription });

      setSubscribed(true);

      SonnerSuccess(
        "Đăng ký thành công",
        "Bạn sẽ nhận được thông báo mới nhất.",
      );
    } catch (error) {
      console.error("Subscribe user error:", error);
    }
  };

  const requestCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        SonnerInfo("Trình duyệt không hỗ trợ camera.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setCameraEnabled(true);

      stream.getTracks().forEach((track) => track.stop());

      SonnerSuccess(
        "Đã cấp quyền camera",
        "Ứng dụng có thể sử dụng camera khi cần.",
      );
    } catch {
      SonnerInfo("Bạn đã từ chối quyền camera.");
    }
  };

  const requestLocation = async () => {
    try {
      if (!navigator.geolocation) {
        SonnerInfo("Trình duyệt không hỗ trợ vị trí.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationEnabled(true);

          console.log("Location:", {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });

          SonnerSuccess(
            "Đã cấp quyền vị trí",
            "Ứng dụng có thể truy cập vị trí khi cần.",
          );
        },
        () => {
          SonnerInfo("Bạn đã từ chối quyền vị trí.");
        },
      );
    } catch {
      SonnerInfo("Không thể lấy vị trí.");
    }
  };

  const handleNotificationToggle = () => {
    if (permission === "denied") {
      SonnerInfo(
        "Bạn đã chặn thông báo. Hãy vào cài đặt trình duyệt để bật lại.",
      );
      return;
    }

    if (!subscribed) {
      subscribeUser();
    }
  };

  const handleCameraToggle = () => {
    if (!cameraEnabled) {
      requestCamera();
    }
  };
  const handleLocationToggle = () => {
    if (!locationEnabled) requestLocation();
  };

  const renderNotificationGuide = () => {
    if (permission === "granted" && subscribed) {
      return (
        <div className="text-xs opacity-70 text-left flex flex-col gap-1">
          <p>Quyền thông báo đã được cấp.</p>
          <p>Bạn sẽ nhận được thông báo khi có cập nhật mới.</p>
        </div>
      );
    }

    if (permission === "default") {
      return (
        <p className="text-xs opacity-70 text-left">
          Bật thông báo để nhận cập nhật ngay lập tức.
        </p>
      );
    }

    if (permission === "denied") {
      return (
        <div className="text-xs text-warning text-left flex flex-col gap-1">
          <p>Bạn đang chặn thông báo từ trang web này.</p>
          <p>
            Hãy vào cài đặt trình duyệt → Quyền trang web → Thông báo để bật
            lại.
          </p>
        </div>
      );
    }

    if (permission === "granted" && !subscribed) {
      return (
        <p className="text-xs text-left opacity-70">
          Quyền thông báo đã bật nhưng chưa đăng ký nhận push.
        </p>
      );
    }

    return null;
  };

  const renderCameraGuide = () => {
    if (cameraEnabled) {
      return (
        <div className="text-xs opacity-70 text-left flex flex-col gap-1">
          <p>Quyền camera đã được cấp.</p>
          <p>Trình duyệt cho phép trang web sử dụng camera.</p>
        </div>
      );
    }

    return (
      <p className="text-xs opacity-70 text-left">
        Bật quyền camera để có thể chụp ảnh trực tiếp từ thiết bị.
      </p>
    );
  };

  const renderLocationGuide = () => {
    if (locationEnabled) {
      return (
        <div className="text-xs opacity-70 text-left flex flex-col gap-1">
          <p>Quyền vị trí đã được cấp.</p>
          <p>Ứng dụng có thể sử dụng vị trí của bạn khi cần.</p>
        </div>
      );
    }

    return (
      <p className="text-xs opacity-70 text-left">
        Bật quyền vị trí để ứng dụng có thể sử dụng định vị thiết bị.
      </p>
    );
  };

  return (
    <div className="flex-1 bg-base-100 rounded-lg p-4 shadow-sm flex flex-col gap-4">
      <h3 className="font-semibold text-lg text-center">
        Quản lý quyền truy cập
      </h3>

      {/* Notification */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Bell className="w-5 h-5" />
          <span>Đăng ký nhận thông báo</span>
        </div>

        <input
          type="checkbox"
          className="toggle toggle-info"
          checked={permission === "granted" && subscribed}
          onChange={handleNotificationToggle}
        />
        {pushData && (
          <div className="bg-base-200 p-2 rounded text-xs overflow-auto">
            <pre>{JSON.stringify(pushData, null, 2)}</pre>
          </div>
        )}
      </div>

      {renderNotificationGuide()}

      {/* Camera */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Camera className="w-5 h-5" />
          <span>Cho phép sử dụng camera</span>
        </div>

        <input
          type="checkbox"
          className="toggle toggle-info"
          checked={cameraEnabled}
          onChange={handleCameraToggle}
        />
      </div>

      {renderCameraGuide()}
      {/* Location */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-5 h-5" />
          <span>Cho phép sử dụng vị trí</span>
        </div>

        <input
          type="checkbox"
          className="toggle toggle-info"
          checked={locationEnabled}
          onChange={handleLocationToggle}
        />
      </div>

      {renderLocationGuide()}

      <button className="text-left opacity-0" onClick={getSubscription}>
        Click to show
      </button>
    </div>
  );
}

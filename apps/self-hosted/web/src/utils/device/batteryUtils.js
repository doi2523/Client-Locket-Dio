import { useState, useEffect } from "react";

export function useBatteryStatus() {
  const [batteryStatus, setBatteryStatus] = useState({
    level: null,
    charging: null
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchBattery() {
      if (!navigator.getBattery) {
        console.warn("Battery API không được hỗ trợ.");
        return;
      }

      try {
        const battery = await navigator.getBattery();
        if (!isMounted) return;

        setBatteryStatus({
          level: Math.round(battery.level * 100),
          charging: battery.charging
        });

        // Nếu muốn cập nhật realtime khi pin thay đổi:
        const update = () => {
          setBatteryStatus({
            level: Math.round(battery.level * 100),
            charging: battery.charging
          });
        };

        battery.addEventListener("levelchange", update);
        battery.addEventListener("chargingchange", update);

        // Cleanup
        return () => {
          battery.removeEventListener("levelchange", update);
          battery.removeEventListener("chargingchange", update);
          isMounted = false;
        };
      } catch (err) {
        console.error("Lỗi khi lấy pin:", err);
      }
    }

    fetchBattery();

    return () => {
      isMounted = false;
    };
  }, []);

  return batteryStatus;
}

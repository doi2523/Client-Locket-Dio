import { useState, useEffect } from "react";

export function useLocationOptions() {
  const [location, setLocation] = useState(null); // { lat, lon }
  const [addressOptions, setAddressOptions] = useState([]); // Mảng lựa chọn
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });

        // 1. Lấy địa chỉ chính
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const geoData = await geoRes.json();
        const { address } = geoData;

        const xa = address.suburb || address.village || address.town || address.city_district || "";
        const huyen = address.county || address.district || "";
        const tinh = address.state || address.region || address.city || "";

        const options = [];

        if (xa && huyen && tinh) options.push(`X. ${xa}, H. ${huyen}`);
        if (huyen && tinh) options.push(`H. ${huyen}, ${tinh}`);
        if (tinh) options.push(tinh);

        // 2. Gợi ý địa điểm lân cận (dùng Nominatim search gần)
        const nearbyRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=quán ăn&limit=5&bounded=1&viewbox=${longitude - 0.01},${latitude + 0.01},${longitude + 0.01},${latitude - 0.01}`
        );
        const nearbyData = await nearbyRes.json();

        nearbyData.forEach((place) => {
          if (place.display_name) {
            options.push(place.display_name.split(",").slice(0, 2).join(", "));
          }
        });

        // Xoá trùng
        const uniqueOptions = [...new Set(options)];
        setAddressOptions(uniqueOptions);
      },
      (err) => {
        console.error("Lỗi lấy vị trí:", err);
        setError("Không thể lấy vị trí");
      }
    );
  }, []);

  return { location, addressOptions, error };
}

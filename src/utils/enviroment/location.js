import { useState, useEffect } from "react";

export function useLocationOptions() {
  const [location, setLocation] = useState(null); // { lat, lon }
  const [addressOptions, setAddressOptions] = useState([]);
  const [error, setError] = useState(null);

  // Hàm chuẩn hóa tên hành chính
  const normalizeName = (name, prefix) => {
    if (!name) return "";
    // Loại bỏ tiền tố hành chính thông thường
    const cleaned = name
      .replace(/^(xã|phường|thị trấn|x\.)\s*/i, "")
      .replace(/^(huyện|quận|tp\.?|thành phố)\s*/i, "")
      .replace(/^(tỉnh|tp\.?|thành phố)\s*/i, "")
      .trim();
    return `${prefix} ${cleaned}`;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });

        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoRes.json();
          const address = geoData.address || {};

          const xaRaw = address.suburb || address.village || address.town || address.city_district || "";
          const huyenRaw = address.county || address.district || "";
          const tinhRaw = address.state || address.region || address.city || "";
          const country = address.country || "";
          const postcode = address.postcode || "";

          const shortXa = xaRaw ? normalizeName(xaRaw, "X.") : "";
          const shortHuyen = huyenRaw ? normalizeName(huyenRaw, "H.") : "";
          const shortTinh = tinhRaw ? normalizeName(tinhRaw, "") : "";

          const variants = [];

          if (shortXa && shortHuyen && shortTinh)
            variants.push(`${shortXa}, ${shortHuyen}, ${shortTinh}`);
          if (shortXa && shortHuyen) variants.push(`${shortXa}, ${shortHuyen}`);
          if (shortXa && shortTinh) variants.push(`${shortXa}, ${shortTinh}`);
          if (shortHuyen && shortTinh) variants.push(`${shortHuyen}, ${shortTinh}`);
          if (shortTinh) variants.push(shortTinh);
          if (postcode && shortTinh) variants.push(`${postcode}, ${shortTinh}`);
          if (country) variants.push(country);

          const fullAddress = [
            address.suburb,
            address.village,
            address.county,
            address.state,
          ]
            .filter(Boolean)
            .join(", ");
          if (fullAddress) variants.push(fullAddress);

          const nearbyRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=quán ăn&limit=5&bounded=1&viewbox=${longitude - 0.01},${latitude + 0.01},${longitude + 0.01},${latitude - 0.01}`
          );
          const nearbyData = await nearbyRes.json();

          nearbyData.forEach((place) => {
            if (place.display_name) {
              const nameParts = place.display_name.split(",").map(s => s.trim());
              if (nameParts.length >= 2) {
                variants.push(`${nameParts[0]}, ${nameParts[1]}`);
              } else {
                variants.push(nameParts[0]);
              }
            }
          });

          const uniqueOptions = [...new Set(variants.filter(Boolean))];
          setAddressOptions(uniqueOptions);
        } catch (err) {
          console.error("Lỗi xử lý địa chỉ:", err);
          setError("Không thể xử lý địa chỉ");
        }
      },
      (err) => {
        console.error("Lỗi lấy vị trí:", err);
        setError("Không thể lấy vị trí");
      }
    );
  }, []);

  return { location, addressOptions, error };
}

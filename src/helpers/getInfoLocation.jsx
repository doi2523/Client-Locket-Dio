import React ,{ useEffect } from "react";
import { useApp } from "../context/AppContext";

function LocationInfoGenerator() {
    const { post } = useApp();
    const { postOverlay, setPostOverlay } = post;
  useEffect(() => {
    const generateLocationVariants = (address) => {
      const {
        village,
        suburb,
        county,
        state,
        postcode,
        country,
      } = address;

      const variants = [];

      // Tên ngắn và dài của các cấp địa phương
      const shortVillage = village?.replace(/Xã\s+/i, "X.") || "";
      const shortCounty = county?.replace(/(Huyện|Quận|Thị xã)\s+/i, "H.") || county?.replace(/Tiên Du/i, "H. Tiên Du");
      const shortState = state?.replace(/Tỉnh\s+/i, "") || "";
      const fullAddress = `${suburb || ""}, ${village || ""}, ${county || ""}, ${state || ""}`;
      
      // Các tổ hợp tên vị trí
      if (village && county) variants.push(`${shortVillage}, ${shortCounty}`);
      if (county && state) variants.push(`${shortCounty}, ${shortState}`);
      if (village && state) variants.push(`${shortVillage}, ${shortState}`);
      if (village && county && state) variants.push(`${shortVillage}, ${shortCounty}, ${shortState}`);
      if (postcode && state) variants.push(`${postcode}, ${state}`);
      if (country) variants.push(country);
      if (fullAddress) variants.push(fullAddress);
      const caption = `${shortVillage}, ${shortCounty}`;
      setPostOverlay((prev) => ({
        ...prev,
        caption,
        type: "location",
      }));

      // Lọc bỏ trùng lặp & rỗng
      const unique = [...new Set(variants.filter(Boolean))];
      return unique;
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            console.log("Raw location data:", data);

            const variants = generateLocationVariants(data.address);
            console.log("📍 Generated location variants:");
            variants.forEach((v, i) => console.log(`${i + 1}. ${v}`));
          } catch (error) {
            console.error("Error fetching location details:", error);
          }
        },
        (error) => {
          console.error("Permission denied or error:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported.");
    }
  }, []);

  return <div>📡 Đang lấy vị trí...</div>;
}

export default LocationInfoGenerator;

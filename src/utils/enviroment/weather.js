import { useState, useEffect } from "react";

export function useLocationWeather() {
  const [location, setLocation] = useState(null); // { lat, lon }
  const [address, setAddress] = useState("");     // "X. ..., H. ..., ..."
  const [weather, setWeather] = useState(null);   // { temp, description, ... }

  useEffect(() => {
    // 1. Lấy tọa độ
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });

        // 2. Lấy địa chỉ từ toạ độ
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const geoData = await geoRes.json();
        const { address } = geoData;

        const xa = address.suburb || address.village || address.town || address.city_district || "";
        const huyen = address.county || address.district || "";
        const tinh = address.state || address.region || address.city || "";

        const customAddress = `X. ${xa} H. ${huyen}, ${tinh}`;
        setAddress(customAddress);

        // 3. Lấy thời tiết
        const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Bạn cần có key
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=vi&appid=${apiKey}`
        );
        const weatherData = await weatherRes.json();
        setWeather({
          temp: weatherData.main.temp,
          desc: weatherData.weather[0].description,
        });
      },
      (err) => {
        console.error("Lỗi lấy vị trí:", err);
      }
    );
  }, []);

  return { location, address, weather };
}

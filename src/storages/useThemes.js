import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils";

const sortByOrderIndex = (themes) => {
  return [...themes].sort(
    (a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999)
  );
};

const groupThemesByType = (themes) => {
  return {
    decorative: sortByOrderIndex(themes.filter((t) => t.type === "decorative")),
    custome: sortByOrderIndex(themes.filter((t) => t.type === "custome")),
    background: sortByOrderIndex(themes.filter((t) => t.type === "background")),
    image_icon: sortByOrderIndex(themes.filter((t) => t.type === "image_icon")),
  };
};

export const useThemes = () => {
  const [captionThemes, setCaptionThemes] = useState({
    decorative: [],
    custome: [],
    background: [],
    image_icon: [],
  });

  useEffect(() => {
    const fetchThemes = async () => {
      // Kiểm tra xem dữ liệu đã có trong sessionStorage chưa
      const cachedThemes = sessionStorage.getItem("captionThemes");

      if (cachedThemes) {
        // Nếu có, sử dụng dữ liệu trong sessionStorage
        setCaptionThemes(JSON.parse(cachedThemes));
      } else {
        try {
          // Nếu chưa có, gọi API để fetch dữ liệu
          const { data } = await axios.get(API_URL.GET_CAPTION_THEMES);

          // Lưu dữ liệu vào sessionStorage để tránh gọi API lại sau này
          sessionStorage.setItem("captionThemes", JSON.stringify(groupThemesByType(data)));

          // Cập nhật state
          setCaptionThemes(groupThemesByType(data));
        } catch (error) {
          console.error("Lỗi khi fetch themes:", error);
        }
      }
    };

    fetchThemes();
  }, []);

  return { captionThemes };
};

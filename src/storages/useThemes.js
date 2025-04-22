import { useEffect, useState } from "react";
import axios from "axios";

const sortByOrderIndex = (themes) => {
  return [...themes].sort(
    (a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999)
  );
};

const groupThemesByType = (themes) => {
  return {
    default: sortByOrderIndex(themes.filter((t) => t.type === "default")),
    custom: sortByOrderIndex(themes.filter((t) => t.type === "custom")),
    background: sortByOrderIndex(themes.filter((t) => t.type === "background")),
  };
};

export const useThemes = () => {
  const [captionThemes, setCaptionThemes] = useState({
    default: [],
    custom: [],
    background: [],
  });

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const { data } = await axios.get("https://server-admin-xi.vercel.app/themes");
        setCaptionThemes(groupThemesByType(data));
      } catch (error) {
        console.error("Lỗi khi fetch themes:", error);
      }
    };

    fetchThemes();
  }, []);

  return { captionThemes };
};

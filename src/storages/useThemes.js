import { useEffect, useState } from "react";

export const useThemes = () => {
  const [captionThemes, setCaptionThemes] = useState({
    default: [],
    custom: [],
    background: [],
  });

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const [defaultRes, customRes, backgroundRes] = await Promise.all([
          fetch("https://server-admin-xi.vercel.app/themes?type=default"),
          fetch("https://server-admin-xi.vercel.app/themes?type=custom"),
          fetch("https://server-admin-xi.vercel.app/themes?type=background"),
        ]);

        const [defaultData, customData, backgroundData] = await Promise.all([
          defaultRes.json(),
          customRes.json(),
          backgroundRes.json(),
        ]);

        // Hàm sắp xếp theo order_index
        const sortByOrder = (arr) =>
          [...arr].sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));

        setCaptionThemes({
          default: sortByOrder(defaultData),
          custom: sortByOrder(customData),
          background: sortByOrder(backgroundData),
        });
      } catch (error) {
        console.error("Lỗi khi fetch themes:", error);
      }
    };

    fetchThemes();
  }, []);

  return { captionThemes };
};

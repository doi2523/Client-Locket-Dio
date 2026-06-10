import { useEffect } from "react";

export const useAutoResize = (refs) => {
  const adjustHeight = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    refs.forEach((ref) => adjustHeight(ref));
  });

  return adjustHeight;
};

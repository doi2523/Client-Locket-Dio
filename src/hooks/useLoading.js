// src/hooks/useImage.js
import { useState } from "react";

export const useLoading = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return { imageLoaded, setImageLoaded };
};

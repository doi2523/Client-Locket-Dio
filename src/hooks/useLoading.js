
import { useState } from "react";

export const useLoading = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCaptionLoading, setIsCaptionLoading] = useState(false);

  return { imageLoaded, setImageLoaded, isCaptionLoading, setIsCaptionLoading };
};

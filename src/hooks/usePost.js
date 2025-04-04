import { useState } from "react";

export const usePost = () => {
  const [selectedColors, setSelectedColors] = useState(null);

  return { selectedColors, setSelectedColors };
};

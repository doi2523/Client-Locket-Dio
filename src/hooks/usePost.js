import { useState } from "react";

export const usePost = () => {
  const [selectedColors, setSelectedColors] = useState({
    top: "rgba(0, 0, 0, 0)", // Trong suốt
    bottom: "rgba(0, 0, 0, 0)", // Trong suốt
  });  
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  return {
    caption,
    setCaption,
    selectedColors,
    setSelectedColors,
    selectedFile,
    setSelectedFile,
  };
};

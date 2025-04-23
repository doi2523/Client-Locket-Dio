import { useState } from "react";

export const usePost = () => {
  const [selectedColors, setSelectedColors] = useState({
    top: "", // Trong suốt
    bottom: "", // Trong suốt
    text: "#FFFFFF", 
    // type: "none"
  });  
  const [custome, setCustome] = useState({
    id: "",            // hoặc null
    top: "transparent",
    bottom: "transparent",
    text: "#FFFFFF",
    caption: "",
  });
  
  const [caption, setCaption ] = useState("");
  const [ preview, setPreview ] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ isTextColor, setTextColor] = useState(null);
  const [ isSizeMedia, setSizeMedia ] = useState(null);

  return {
    caption,setCaption,
    selectedColors,setSelectedColors,
    selectedFile,setSelectedFile,
    preview, setPreview,
    isTextColor, setTextColor,
    isSizeMedia, setSizeMedia,
    custome, setCustome
  };
};

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthLocket";
import { useFeatureVisible } from "../hooks/useFeatureVisible";

export const defaultPostOverlay = {
  overlay_id: "standard",
  color_top: "",
  color_bottom: "",
  text_color: "#FFFFFF",
  icon: "",
  caption: "",
  type: "default",
};

export const usePost = () => {
  const { userPlan } = useContext(AuthContext);
  const [selectedColors, setSelectedColors] = useState({
    top: "", // Trong suốt
    bottom: "", // Trong suốt
    text: "#FFFFFF",
    // type: "none"
  });
  const [postOverlay, setPostOverlay] = useState(defaultPostOverlay);

  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [isTextColor, setTextColor] = useState(null);
  const [isSizeMedia, setSizeMedia] = useState(null);

  const [recentPosts, setRecentPosts] = useState(() => {
    const saved = localStorage.getItem("uploadedMoments");
    return saved ? JSON.parse(saved) : [];
  });
  const [uploadPayloads, setuploadPayloads] = useState(() => {
    const saved = localStorage.getItem("uploadPayloads");
    return saved ? JSON.parse(saved) : [];
  });

  const [audience, setAudience] = useState("all"); // "all" | "selected"
  const [selectedRecipients, setSelectedRecipients] = useState([]); // array userId hoặc object bạn bè

  const [maxImageSizeMB, setMaxImageSizeMB] = useState(""); // Giới hạn ảnh: 9MB
  const [maxVideoSizeMB, setMaxVideoSizeMB] = useState(""); // Giới hạn video: 30MB

  const isHD = useFeatureVisible("upload_hd");

  useEffect(() => {
    //Chia theo plan ( Plan / Free)
    //Sửa thì sửa ở đây nhé.
    setMaxImageSizeMB(isHD ? 9 : 7);
    setMaxVideoSizeMB(isHD ? 30 : 15);
  }, [userPlan]);

  return {
    caption,
    setCaption,
    selectedColors,
    setSelectedColors,
    selectedFile,
    setSelectedFile,
    imageToCrop,
    setImageToCrop,
    preview,
    setPreview,
    isTextColor,
    setTextColor,
    isSizeMedia,
    setSizeMedia,
    postOverlay,
    setPostOverlay,
    recentPosts,
    setRecentPosts,
    audience,
    setAudience,
    selectedRecipients,
    setSelectedRecipients,
    maxImageSizeMB,
    setMaxImageSizeMB,
    maxVideoSizeMB,
    setMaxVideoSizeMB,
    uploadPayloads,
    setuploadPayloads,
  };
};

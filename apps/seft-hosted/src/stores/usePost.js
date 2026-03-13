import { useState } from "react";

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
  const [videoCrop, setVideoCrop] = useState(null);
  const [videoCropArea, setVideoCropArea] = useState(null)

  const [isTextColor, setTextColor] = useState(null);
  const [isSizeMedia, setSizeMedia] = useState(null);

  const [audience, setAudience] = useState("all"); // "all" | "selected"
  const [selectedRecipients, setSelectedRecipients] = useState([]); // array userId hoặc object bạn bè

  const [selectedMoment, setSelectedMoment] = useState(null);
  const [selectedMomentId, setSelectedMomentId] = useState(null);

  const [selectedQueue, setSelectedQueue] = useState(null);
  const [selectedQueueId, setSelectedQueueId] = useState(null);

  const [selectedFriendUid, setSelectedFriendUid] = useState(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactionInfo, setReactionInfo] = useState({
    emoji: "💛",
    moment_id: null,
    intensity: 1000,
  });
  const [restoreStreak, setRestoreStreak] = useState(null)

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
    audience,
    setAudience,
    selectedRecipients,
    setSelectedRecipients,
    selectedMoment,
    setSelectedMoment,
    selectedMomentId,
    setSelectedMomentId,
    selectedQueue,
    setSelectedQueue,
    selectedQueueId, setSelectedQueueId,
    selectedFriendUid,
    setSelectedFriendUid,
    reactionInfo,
    setReactionInfo,
    showEmojiPicker,
    setShowEmojiPicker,
    restoreStreak, setRestoreStreak,
    videoCrop, setVideoCrop,
    videoCropArea, setVideoCropArea
  };
};

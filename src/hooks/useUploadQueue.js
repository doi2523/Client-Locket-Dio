// hooks/useUploadQueue.js
import { useState, useCallback } from "react";
import * as utils from "@/utils";
import { PostMoments } from "@/services";
import { showError, showSuccess } from "@/components/Toast";
import { useApp } from "@/context/AppContext";

export const useUploadQueue = () => {
  const { setRecentPosts, setuploadPayloads } = useApp().post;

  const [uploadQueue, setUploadQueue] = useState(() => {
    return JSON.parse(localStorage.getItem("uploadPayloads") || "[]");
  });
  const [isProcessingUploads, setIsProcessingUploads] = useState(false);

  const saveUploadQueue = (newQueue) => {
    setUploadQueue(newQueue);
    localStorage.setItem("uploadPayloads", JSON.stringify(newQueue));
  };

  const addToUploadQueue = (payload) => {
    const updated = [...uploadQueue, payload];
    saveUploadQueue(updated);
  };

  const processUploadQueue = useCallback(async () => {
    if (isProcessingUploads) return;
    setIsProcessingUploads(true);

    let updatedQueue = [...uploadQueue];
    for (let i = 0; i < updatedQueue.length; i++) {
      if (updatedQueue[i].status !== "uploading") continue;

      try {
        const res = await PostMoments(updatedQueue[i]);
        const uploaded = JSON.parse(
          localStorage.getItem("uploadedMoments") || "[]"
        );
        const normalized = utils.normalizeMoments([res?.data]);
        const newUploaded = [...uploaded, ...normalized];
        localStorage.setItem("uploadedMoments", JSON.stringify(newUploaded));
        setRecentPosts(newUploaded);

        updatedQueue[i] = { ...updatedQueue[i], status: "done" };
        showSuccess("Upload thành công!");
      } catch (err) {
        updatedQueue[i] = {
          ...updatedQueue[i],
          status: "error",
          errorMessage: err.message,
          retryCount: (updatedQueue[i].retryCount || 0) + 1,
        };
        showError("Upload thất bại");
      }

      saveUploadQueue(updatedQueue);
      await new Promise((res) => setTimeout(res, 500));
    }
    setIsProcessingUploads(false);
  }, [uploadQueue, isProcessingUploads]);

  const clearUploadQueue = () => {
    saveUploadQueue([]);
  };

  return {
    uploadQueue,
    isProcessingUploads,
    addToUploadQueue,
    processUploadQueue,
    clearUploadQueue,
  };
};

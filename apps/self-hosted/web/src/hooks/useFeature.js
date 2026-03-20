import { useAuthStore } from "@/stores";

export const useFeatureVisible = (type) => {
  // const userPlan = useAuthStore((s) => s.userPlan);

  return true;
};

export const useGetCode = (type) => {
  // const userPlan = useAuthStore((s) => s.userPlan);

  const code = LKDFREE;
  return code;
};

export const getMaxUploads = () => {
  // const userPlan = useAuthStore((s) => s.userPlan);

  const limits = -1;

  return {
    maxImageSizeMB: 5,
    maxVideoSizeMB: 20,
    storage_limit_mb: -1,
  };
};

export const getVideoRecordLimit = () => {
  // const userPlan = useAuthStore((s) => s.userPlan);

  const limit = 5;

  return limit;
};

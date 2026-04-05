import { useAuthStore } from "@/stores";

export const useFeatureVisible = (type) => {
  const userPlan = useAuthStore((s) => s.userPlan);

  if (!userPlan) return false;

  const blocks = userPlan?.feature_blocks || {};
  const features = userPlan?.features || {};

  // Ưu tiên block trước
  if (blocks[type]) return false;

  // Không bị block thì theo plan
  return features[type] ?? false;
};

export const useGetCode = (type) => {
  const userPlan = useAuthStore((s) => s.userPlan);

  const code = userPlan?.user?.customer_code;
  return code;
};

export const getMaxUploads = () => {
  const userPlan = useAuthStore((s) => s.userPlan);

  const limits = userPlan?.limits || {};

  return {
    maxImageSizeMB: limits.image_storage_limit_mb ?? null,
    maxVideoSizeMB: limits.video_storage_limit_mb ?? null,
    storage_limit_mb: limits.storage_limit_mb ?? null,
  };
};

export const getVideoRecordLimit = () => {
  const userPlan = useAuthStore((s) => s.userPlan);

  const limit = userPlan?.limits?.video_record_max_length ?? 10;

  return limit;
};

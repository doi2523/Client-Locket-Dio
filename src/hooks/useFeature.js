import { useAuthStore } from "@/stores";

export const useFeatureVisible = (type) => {
  const { userPlan } = useAuthStore();

  return !!userPlan?.plan_info?.feature_flags?.[type];
};

export const useGetCode = (type) => {
  const { userPlan } = useAuthStore();
  const code = userPlan?.customer_code;
  return code;
};

export const getMaxUploads = () => {
  const { userPlan } = useAuthStore();

  const uploads = userPlan?.plan_info?.feature_flags?.max_uploads || {};
  const storage_limit_mb = userPlan?.plan_info?.storage_limit_mb || null;
  return {
    image: uploads.image ?? null,
    video: uploads.video ?? null,
    storage_limit_mb: storage_limit_mb,
  };
};

export const getVideoRecordLimit = () => {
  const { userPlan } = useAuthStore();

  const limit =
    userPlan?.plan_info?.feature_flags?.video_record_max_length ?? 10;

  return limit;
};

import { useContext } from "react";
import { AuthContext } from "@/context/AuthLocket";

export const useFeatureVisible = (type) => {
  const { userPlan } = useContext(AuthContext);

  return !!userPlan?.plan_info?.feature_flags?.[type];
};

export const getMaxUploads = () => {
  const { userPlan } = useContext(AuthContext);

  const uploads = userPlan?.plan_info?.feature_flags?.max_uploads || {};
  const storage_limit_mb = userPlan?.plan_info?.storage_limit_mb || null;
  return {
    image: uploads.image ?? null,
    video: uploads.video ?? null,
    storage_limit_mb: storage_limit_mb,
  };
};

export const getVideoRecordLimit = () => {
  const { userPlan } = useContext(AuthContext);

  const limit =
    userPlan?.plan_info?.feature_flags?.video_record_max_length ?? null;

  return limit;
};

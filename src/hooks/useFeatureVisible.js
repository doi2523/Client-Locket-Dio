import { useApp } from "../context/AppContext";

export const useFeatureVisible = (type) => {
  const { userPlan } = useApp();

  return !!userPlan?.plan_info?.features?.[type];
};

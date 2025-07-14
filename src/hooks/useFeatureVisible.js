import { useContext } from "react";
import { AuthContext } from "../context/AuthLocket";

export const useFeatureVisible = (type) => {
  const { userPlan } = useContext(AuthContext);

  return !!userPlan?.plan_info?.features?.[type];
};

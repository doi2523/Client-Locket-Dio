import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthLocket";
// import { AuthContext } from "../../../../context/AuthLocket";

const BadgePlan = () => {
  const { userPlan } = useContext(AuthContext);

  const planName = userPlan?.plan_info?.name || "No Plan";

  return (
    <div className="font-lovehouse backdrop-blur-2xl text-2xl font-semibold px-3 pt-1 border border-base-content rounded-xl">
      Locket Dio - {planName}
    </div>
  );
};

export default BadgePlan;

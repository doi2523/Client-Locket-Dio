import { useState } from "react";
import Turnstile from "react-turnstile";
import { SonnerInfo } from "@/components/ui/SonnerToast";
import { CONFIG } from "@/config";

const TurnstileCaptcha = ({ onVerify }) => {
  const [token, setToken] = useState(null);

  const handleVerify = (t) => {
    setToken(t);
    onVerify(t);
  };

  const handleExpire = () => {
    setToken(null);
    SonnerInfo("Turnstile đã hết hạn. Vui lòng xác minh lại.");
    onVerify(null);
  };

  if (!CONFIG.keys.turnstileKey) return null;

  return (
    <Turnstile
      sitekey={CONFIG.keys.turnstileKey}
      onVerify={handleVerify}
      onExpire={handleExpire}
      className="mt-2"
    />
  );
};

export default TurnstileCaptcha;

import React, { useState } from "react";
import { checkAndRefreshToken } from "../../utils";


const RefreshTokenButton = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const result = await checkAndRefreshToken();
console.log(result)
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Đang kiểm tra..." : "Làm mới token"}
      </button>
    </div>
  );
};

export default RefreshTokenButton;

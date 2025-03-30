import React from "react";

const LocketLayout = ({ children }) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] max-h-screen relative w-full">
      {/* Nội dung chính */}
      <main className="w-full h-full bg-base-100 text-base-content">{children}</main>
    </div>
  );
};

export default LocketLayout;

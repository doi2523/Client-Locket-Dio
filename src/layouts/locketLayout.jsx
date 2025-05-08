import React from "react";

const LocketLayout = ({ children }) => {
  return (
    <div className="overflow-hidden grid grid-rows-[auto_1fr_auto] bg-base-100 text-base-content">
      <main className="overflow-hidden">{children}</main>
    </div>
  );
};


export default LocketLayout;

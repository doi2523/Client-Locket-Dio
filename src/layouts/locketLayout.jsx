import React from "react";
import AssistiveButton from "../components/UI/AssistiveButton";
import FiltersSelector from "../pages/UILocket/controlPage/filtersSelector";

const LocketLayout = ({ children }) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] max-h-screen relative w-full">
      {/* <AssistiveButton/> */}
      {/* Nội dung chính */}
      <main className="w-full h-full bg-base-100 text-base-content">
        {children}
      </main>
    </div>
  );
};

export default LocketLayout;

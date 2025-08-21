import Sidebar from "@/components/Sidebar";
import ContactSupportButton from "@/components/ui/ContactSupportButton";
import { useFeatureVisible } from "@/hooks/useFeature";
import React from "react";

const LocketLayout = ({ children }) => {
  const isButtonSupportVisible = useFeatureVisible("hidden_button_support");
  return (
    <div className="overflow-hidden grid grid-rows-[auto_1fr_auto] bg-base-100 text-base-content">
      <main className="overflow-hidden">{children}</main>
      <Sidebar />
      {!isButtonSupportVisible && <ContactSupportButton />}
    </div>
  );
};

export default LocketLayout;

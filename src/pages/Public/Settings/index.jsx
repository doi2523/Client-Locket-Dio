import React from "react";
import SettingView from "./SettingView";
import ThemeSelector from "../../../components/Theme/ThemeSelector";

export default function Settings() {
  return (
    <>
      <div className="flex w-full flex-col items-center min-h-screen px-6 py-5">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <SettingView />
          <ThemeSelector />
        </div>
      </div>
    </>
  );
}

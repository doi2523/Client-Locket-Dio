// import SettingView from "./SettingView";
import ThemeSelector from "@/components/Theme/ThemeSelector";
import SettingsExtras from "./SettingsExtras";

export default function Settings() {
  return (
    <div className="w-full min-h-screen bg-base-200 py-5 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full">
        <h1 className="text-4xl font-lovehouse font-semibold text-base-content mb-3 sm:mb-5 text-center">
          Setting Locket Dio
        </h1>

        {/* Chỉnh thành grid 4 cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">
          <div className="bg-base-300 rounded-2xl shadow-md p-4">
            <SettingsExtras />
          </div>
          <div className="bg-base-300 rounded-2xl shadow-md p-4">
            <ThemeSelector />
          </div>
          <div className="bg-base-300 rounded-2xl shadow-md p-4">
            {/* <SettingView /> */}
          </div>
          {/* Thêm phần tử trống hoặc thêm component khác */}
          <div className="bg-base-300 rounded-2xl shadow-md p-4"></div>
        </div>
      </div>
    </div>
  );
}

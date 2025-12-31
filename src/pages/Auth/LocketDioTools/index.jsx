import React, { useContext, useEffect, useState } from "react";
import { Flame, FolderDown, UserRoundX } from "lucide-react";
import { AuthContext } from "@/context/AuthLocket";
import BottomToolBar from "./Layout/BottomToolBar";
import DeleteFriendsTool from "./tools/DeleteFriendsTool";
import { TbUserStar } from "react-icons/tb";
import CelebrityTool from "./tools/CelebrityTool";
import ExportDataTool from "./tools/ExportDataTool";
import RestoreStreak from "./tools/RestoreStreak";

const toolsList = [
  {
    key: "delete-friends",
    label: "Clean Requests",
    icon: <UserRoundX />,
    content: <DeleteFriendsTool />,
  },
  {
    key: "celebrity",
    label: "Celebrity Tool",
    icon: <TbUserStar />,
    content: <CelebrityTool />,
  },
  {
    key: "exports-tool",
    label: "Xuất dữ liệu",
    icon: <FolderDown />,
    content: <ExportDataTool />,
  },
  {
    key: "restore-streak",
    label: "Khôi phục chuỗi",
    icon: <Flame />,
    content: <RestoreStreak />,
  },
];

export default function ToolsLocket() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(
    window.location.hash.replace("#", "") || toolsList[0].key
  );

  // Đồng bộ hash khi activeTab thay đổi
  useEffect(() => {
    if (activeTab !== window.location.hash.replace("#", "")) {
      window.location.hash = activeTab;
    }
  }, [activeTab]);

  // Nghe thay đổi hash (nếu user đổi trực tiếp URL hoặc back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (toolsList.find((t) => t.key === hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="flex flex-col min-h-[84vh] w-full p-3">
      {/* Title */}
      <h1 className="text-3xl font-bold text-primary text-center">
        🧰 ToolsLocket by Dio
      </h1>

      {/* Layout */}
      <div className="flex flex-col md:flex-row w-full mx-auto gap-6 py-3">
        {/* Sidebar */}
        <div className="hidden md:block w-1/4">
          <div className="flex flex-col gap-2 bg-base-100 p-4 rounded-xl shadow-md border">
            {toolsList.map((tool) => (
              <button
                key={tool.key}
                onClick={() => setActiveTab(tool.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-all
                  ${
                    activeTab === tool.key
                      ? "bg-primary text-white shadow border border-primary"
                      : "hover:bg-base-200 text-base-content"
                  }`}
              >
                {React.cloneElement(tool.icon, { size: 20 })}
                <span>{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-base-100 border border-base-300 p-4 rounded-2xl shadow-md">
          {toolsList.find((t) => t.key === activeTab)?.content || (
            <div>🔍 Không tìm thấy nội dung</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm text-center mt-6 text-base-content">
        Đăng nhập dưới tên:{" "}
        <strong>
          {user?.firstName} {user?.lastName}
        </strong>
      </div>

      {/* Mobile Bottom Toolbar */}
      <BottomToolBar
        tools={toolsList}
        activeKey={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
}

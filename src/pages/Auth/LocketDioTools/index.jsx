import React, { useContext, useState } from "react";
import { Image, Settings, UserRoundX } from "lucide-react";
import { AuthContext } from "@/context/AuthLocket";
import BottomToolBar from "./BottomToolBar";
import DeleteFriendsTool from "./tools/DeleteFriendsTool";
import { TbUserStar } from "react-icons/tb";
import CelebrityTool from "./tools/CelebrityTool";

const toolsList = [
  {
    key: "delete_friends",
    label: "Xoá lời mời Spam",
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
    key: "editor",
    label: "Chỉnh Sửa Ảnh",
    icon: <Image />,
    content: <div>🖌️ Dễ dàng cắt ảnh, thêm sticker, filter.</div>,
  },
  {
    key: "settings",
    label: "Cài Đặt",
    icon: <Settings />,
    content: <div>⚙️ Tuỳ chỉnh giao diện, bảo mật.</div>,
  },
];

export default function ToolsLocket() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(toolsList[0].key);

  return (
    <div className="flex flex-col min-h-[84vh] w-full p-3">
      {/* Title */}
      <h1 className="text-3xl font-bold text-primary text-center">
        🧰 ToolsLocket by Dio
      </h1>

      {/* Layout */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto gap-6 py-3">
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

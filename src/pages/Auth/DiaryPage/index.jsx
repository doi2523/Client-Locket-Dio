import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { CalendarClock } from "lucide-react";

export default function DiaryPage() {
  const { user, userPlan } = useContext(AuthContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-[84vh] w-full p-6 bg-base-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <CalendarClock size={28} />
        <h1 className="text-3xl font-bold">
          Nhật ký của {user?.displayName || "bạn"}
        </h1>
      </div>

      {/* Banner đang xây dựng */}
      <div className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-base-content bg-base-100 w-full max-w-lg">
        <p className="text-lg font-semibold mb-2">🚧 Khu vực đang thi công</p>
        <p className="text-sm text-center text-gray-500">
          Trang nhật ký đang được xây dựng. Bạn có thể quay lại sau hoặc thử các
          tính năng khác.
        </p>
      </div>
    </div>
  );
}

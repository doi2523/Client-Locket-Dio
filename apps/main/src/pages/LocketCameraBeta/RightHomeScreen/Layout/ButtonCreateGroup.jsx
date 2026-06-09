import { Pencil, Users } from "lucide-react";
import { SonnerInfo } from "@/components/ui/SonnerToast";

const ButtonCreateGroup = ({ onClick, hasUserGroup }) => {
  const handleClick = () => {
    if (hasUserGroup) {
      SonnerInfo("Bạn đã tạo một nhóm rồi");
      return;
    }

    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className="
        fixed bottom-5 right-5
        w-12 h-12
        rounded-full
        text-white
        flex items-center justify-center
        shadow-lg
        transition-all duration-200
        active:scale-95
        z-50
        bg-secondary hover:bg-secondary/90
      "
      title={hasUserGroup ? "Bạn đã tạo một nhóm rồi" : "Tạo nhóm chat mới"}
    >
      {hasUserGroup ? <Users size={22} /> : <Pencil size={22} />}
    </button>
  );
};

export default ButtonCreateGroup;

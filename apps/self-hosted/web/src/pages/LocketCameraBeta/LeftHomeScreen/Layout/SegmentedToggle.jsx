import { CalendarDays, Megaphone } from "lucide-react";

export default function SegmentedToggle({active, setActive}) {

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-row gap-1 bg-base-100/20 px-2 py-1 rounded-4xl shadow-lg backdrop-blur-[4px]">
        
        {/* Rollcalls */}
        <button
          onClick={() => setActive("rollcall")}
          className={`flex flex-col items-center justify-center px-5 py-1 rounded-4xl transition-all 
            ${active === "rollcall" 
              ? "bg-base-100/80 shadow-sm" 
              : ""
            }`}
        >
          <Megaphone size={22} />
          <span className="text-sm font-medium">Rollcalls</span>
        </button>

        {/* Lockets */}
        <button
          onClick={() => setActive("lockets")}
          className={`flex flex-col items-center justify-center px-5 py-1 rounded-4xl transition-all 
            ${active === "lockets" 
              ? "bg-base-100/80 shadow-sm" 
              : ""
            }`}
        >
          <CalendarDays size={22} />
          <span className="text-sm font-medium">Lockets</span>
        </button>

      </div>
    </div>
  );
}

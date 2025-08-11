import { Send, Check } from "lucide-react";
import LoadingRing from "@/components/UI/Loading/ring";
import "./UploadStatusIcon.css";

const UploadStatusIcon = ({ loading = false, success = false }) => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      {/* Loading Ring */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-in-out ${
          loading
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-75 rotate-180"
        }`}
      >
        <LoadingRing size={40} stroke={3} />
      </div>

      {/* Success Check Icon */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-in-out ${
          success
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-75 -rotate-90"
        }`}
      >
        <Check
          size={40}
          className="text-green-500"
          style={{
            // filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))",
            animation: success ? "checkmark-draw 0.6s ease-in-out" : "none",
          }}
        />
      </div>

      {/* Default Send Icon */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-in-out ${
          !loading && !success
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-75 rotate-45"
        }`}
      >
        <Send size={40} className="mr-1 mt-0.5" />
      </div>
    </div>
  );
};

export default UploadStatusIcon;

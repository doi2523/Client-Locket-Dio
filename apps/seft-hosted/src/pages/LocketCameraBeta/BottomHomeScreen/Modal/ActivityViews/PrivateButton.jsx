import { FaLock } from "react-icons/fa";

const PrivateButton = () => {
  return (
    <div
      className="inline-flex flex-row justify-center items-center gap-2 px-4 py-3.5 bg-base-200 rounded-3xl shadow-md"
    >
      <FaLock className="text-base-content w-5 h-5" />
      
      <span className="text-base-content font-semibold pl-1">
        Riêng tư
      </span>
    </div>
  );
};

export default PrivateButton;

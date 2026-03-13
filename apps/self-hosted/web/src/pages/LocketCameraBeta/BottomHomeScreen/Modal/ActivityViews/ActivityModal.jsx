import { useState } from "react";
import ActivityButton from "./ActivityButton";
import PrivateButton from "./PrivateButton";
import { ActivityModal } from "@/pages/LocketCameraBeta/ModalViews/ActivityModal";

// ================= Parent Example =================
export default function ActivitySection({ isPublic, activity, isLoading }) {
  const [showModal, setShowModal] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <>
      {isPublic !== false && (
        <div className="w-full relative">
          <ActivityButton
            activity={activity}
            isLoading={isLoading}
            onClick={() => setShowModal(true)}
          />
          <ActivityModal
            show={showModal}
            onClose={() => setShowModal(false)}
            activity={activity}
            isLoading={isLoading}
            activeTooltip={activeTooltip}
            setActiveTooltip={setActiveTooltip}
          />
        </div>
      )}

      {isPublic === false && (
        <div className="flex justify-center items-center w-full relative">
          <PrivateButton />
        </div>
      )}
    </>
  );
}

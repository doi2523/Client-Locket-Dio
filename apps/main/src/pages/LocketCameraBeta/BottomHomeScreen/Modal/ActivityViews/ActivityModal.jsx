import { useState } from "react";
import ActivityButton from "./ActivityButton";
import PrivateButton from "./PrivateButton";
import { ActivityModal } from "@/features/ActivityModal";

export default function ActivitySection({
  isPublic,
  activity,
  isLoading,
  pollCounts,
}) {
  const [showModal, setShowModal] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <>
      {isPublic !== false && (
        <div className="relative w-full">
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
            pollCounts={pollCounts}
            activeTooltip={activeTooltip}
            setActiveTooltip={setActiveTooltip}
          />
        </div>
      )}

      {isPublic === false && (
        <div className="relative flex w-full items-center justify-center">
          <PrivateButton />
        </div>
      )}
    </>
  );
}

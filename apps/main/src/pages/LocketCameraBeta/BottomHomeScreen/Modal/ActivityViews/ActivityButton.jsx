import { lazy, Suspense, useMemo } from "react";
const ReactionEffect = lazy(
  () => import("@/components/Effects/ReactionEffect"),
);
import LoadingRing from "@/components/ui/Loading/ring";
import { MoonStar } from "lucide-react";

const ActivityButton = ({ activity, isLoading, onClick }) => {
  const viewersWithReaction = activity.filter((i) => i.reactions?.length > 0);
  const displayUsers = viewersWithReaction.length
    ? viewersWithReaction
    : activity;

  const reactionEmojis = useMemo(() => {
    return activity
      .flatMap((item) => item.reactions || [])
      .map((reaction) => reaction.emoji)
      .filter(Boolean);
  }, [activity]);

  return (
    <>
      <div
        className="flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-3xl bg-base-200 px-4 py-3.5 shadow-md"
        onClick={onClick}
      >
        <MoonStar className="h-6 w-6 text-base-content" />
        <span className="flex-1 pl-1 font-semibold text-base-content">
          Hoạt động
        </span>

        <div className="absolute right-5 z-10 flex flex-row items-center justify-center -space-x-3">
          {isLoading ? (
            <LoadingRing size={28} stroke={3} />
          ) : (
            displayUsers
              .slice(0, 6)
              .map((item) => (
                <img
                  key={item?.user?.uid}
                  src={item?.user?.profilePic || item?.user?.profilePicture}
                  alt={item?.user?.firstName}
                  className="h-9 w-9 rounded-full border-2 border-base-100 object-cover"
                />
              ))
          )}
        </div>
      </div>
      <Suspense fallback={null}>
        <ReactionEffect
          key={`${reactionEmojis.join("-")}-${activity.length}`}
          emojis={reactionEmojis}
          count={30}
          direction="down"
        />
      </Suspense>
    </>
  );
};

export default ActivityButton;

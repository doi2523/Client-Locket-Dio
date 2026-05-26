import { lazy, Suspense } from "react";
const ReactionEffect = lazy(
  () => import("@/components/Effects/ReactionEffect"),
);
import { useReactionStore } from "@/stores";

export default function GlobalReactionEffect() {
  const reaction = useReactionStore((s) => s.reaction);

  if (!reaction) return null;

  return (
    <Suspense fallback={null}>
      <ReactionEffect
        key={reaction.id}
        emojis={reaction.reactions}
        count={30}
        direction="up"
      />
    </Suspense>
  );
}

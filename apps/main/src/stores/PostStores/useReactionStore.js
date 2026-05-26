import { create } from "zustand";

export const useReactionStore = create((set) => ({
  reaction: null,

  triggerReaction: (input) => {
    const reactions = Array.isArray(input) ? input : [input];

    const validReactions = reactions.filter(
      (reaction) => typeof reaction === "string",
    );

    if (!validReactions.length) return;

    set({
      reaction: {
        id: crypto.randomUUID(),
        reactions: validReactions,
      },
    });
  },
}));
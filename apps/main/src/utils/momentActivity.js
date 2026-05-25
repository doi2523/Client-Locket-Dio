import { getFriendDetail } from "@/cache/friendsDB";

export const MAX_REACTIONS_PER_USER = 5;

export function resolvePollOverlay(overlays) {
  if (!overlays) return null;

  const list = Array.isArray(overlays) ? overlays : [overlays];
  const poll = list.find(
    (o) =>
      o?.type === "poll" || String(o?.overlay_id || "").includes("poll"),
  );

  if (!poll) return null;

  const payload = poll.payload || poll.overlays?.payload || {};

  return {
    leftEmoji: payload.left_emoji || "👎",
    rightEmoji: payload.right_emoji || "👍",
    text: poll.text,
  };
}

/**
 * Đếm poll: 1 user = tối đa 1 vote (👍 hoặc 👎).
 * User thả nhiều lần → lấy lượt mới nhất.
 */
export function computePollCounts(
  reactions,
  leftEmoji = "👎",
  rightEmoji = "👍",
) {
  const latestVoteByUser = new Map();

  const pollVotes = (reactions || [])
    .filter(
      (r) =>
        r?.user && (r.emoji === leftEmoji || r.emoji === rightEmoji),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  for (const r of pollVotes) {
    if (latestVoteByUser.has(r.user)) continue;
    latestVoteByUser.set(
      r.user,
      r.emoji === leftEmoji ? "left" : "right",
    );
  }

  let leftCount = 0;
  let rightCount = 0;

  for (const side of latestVoteByUser.values()) {
    if (side === "left") leftCount++;
    else rightCount++;
  }

  return {
    isPoll: true,
    leftEmoji,
    rightEmoji,
    leftCount,
    rightCount,
    total: leftCount + rightCount,
  };
}

/** Gom reaction theo user, mới nhất trước, tối đa 5 / user */
export function groupReactionsByUser(reactions) {
  const map = new Map();

  for (const r of reactions || []) {
    if (!r?.user) continue;
    if (!map.has(r.user)) map.set(r.user, []);
    map.get(r.user).push(r);
  }

  for (const [uid, list] of map) {
    list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    map.set(uid, list.slice(0, MAX_REACTIONS_PER_USER));
  }

  return map;
}

function mapReactionItem(r) {
  return {
    id: r.id,
    emoji: r.emoji,
    intensity: r.intensity ?? 0,
    createdAt: r.createdAt,
  };
}

export async function buildActivityFromViewsAndReactions(views, reactions) {
  const viewList = views?.moment_views ?? [];
  const reactionsByUser = groupReactionsByUser(reactions);
  const viewByUser = new Map(viewList.map((v) => [v.user, v]));

  const allUserIds = new Set([
    ...viewList.map((v) => v.user),
    ...reactionsByUser.keys(),
  ]);

  const activities = await Promise.all(
    [...allUserIds].map(async (uid) => {
      const userInfo = await getFriendDetail(uid);
      const userReactions = (reactionsByUser.get(uid) || []).map(mapReactionItem);
      const view = viewByUser.get(uid);

      return {
        user: userInfo,
        viewedAt: view?.viewed_at ?? null,
        reactions: userReactions,
        reaction: userReactions[0] ?? null,
      };
    }),
  );

  activities.sort((a, b) => {
    const aTime = a.reactions[0]?.createdAt || a.viewedAt || 0;
    const bTime = b.reactions[0]?.createdAt || b.viewedAt || 0;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return activities;
}

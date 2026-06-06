export function normalizeDirectConversation(conversation) {
  if (!conversation?.uid) return null;

  return {
    ...conversation,
    type: conversation.type || "direct",
    update_time:
      conversation.update_time ||
      Number(conversation.latestMessage?.createdAt) ||
      0,
  };
}

export function normalizeGroupToListItem(group) {
  if (!group?.id) return null;

  const latest = group.latest_message;

  return {
    uid: group.id,
    type: "group",
    with_user: null,
    group: {
      id: group.id,
      name: group.name,
      emoji: group.emoji,
      image_url: group.image_url,
      users: group.users || [],
      muted: group.muted ?? false,
      unread_count: group.unread_count ?? 0,
      last_read_at: group.last_read_at,
      last_updated_at: group.last_updated_at,
      removed_at: group.removed_at,
    },
    latestMessage: latest
      ? {
          id: latest.id,
          createdAt: latest.created_at,
          body: latest.content?.content || "",
          type: latest.content?.type || "text",
          userId: latest.user_id,
          reactions: latest.reactions || [],
        }
      : null,
    isRead: !group.unread_count,
    update_time: group.last_updated_at || 0,
  };
}

export function getConversationSortTime(item) {
  return Number(item?.latestMessage?.createdAt || item?.update_time || 0);
}

export function mergeAndSortConversations(directList = [], groups = []) {
  const directItems = directList
    .map(normalizeDirectConversation)
    .filter(Boolean);
  const groupItems = groups.map(normalizeGroupToListItem).filter(Boolean);

  return [...directItems, ...groupItems].sort(
    (a, b) => getConversationSortTime(b) - getConversationSortTime(a),
  );
}

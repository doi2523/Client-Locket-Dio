export const sortFriends = (list = []) => {
  return [...list].sort((a, b) => {
    if (a.hidden !== b.hidden) return a.hidden ? 1 : -1;
    if (a.isCelebrity !== b.isCelebrity) return a.isCelebrity ? -1 : 1;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
};
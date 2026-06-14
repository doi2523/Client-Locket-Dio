import { create } from "zustand";
import { getGroupsState } from "@/services";
import {
  deleteGroupsByIds,
  getAllGroups,
  getGroupsLastFetchedAt,
  saveGroups,
  setGroupsLastFetchedAt,
  upsertGroups,
} from "@/cache/groupsDB";

const sortGroups = (groups) =>
  [...groups].sort(
    (a, b) => (b.last_updated_at || 0) - (a.last_updated_at || 0),
  );

export const useGroupChatStore = create((set, get) => ({
  groups: [],
  loading: false,

  fetchGroups: async () => {
    set({ loading: true });

    try {
      const localGroups = await getAllGroups();

      if (localGroups.length) {
        set({ groups: sortGroups(localGroups) });
      }

      const lastFetchedAt = await getGroupsLastFetchedAt();

      const apiData = await getGroupsState();

      if (!apiData) return;

      const { groups = [], removed_group_ids = [] } = apiData;
      const { groups: currentGroups } = get();

      const map = new Map(currentGroups.map((g) => [g.id, g]));

      // Giữ nguyên logic cũ
      if (removed_group_ids.length) {
        removed_group_ids.forEach((id) => map.delete(id));
        await deleteGroupsByIds(removed_group_ids);
      }

      // Xóa những group local không còn tồn tại trên server
      const serverIds = new Set(groups.map((g) => g.id));

      const deletedIds = currentGroups
        .filter(
          (g) => !serverIds.has(g.id) && !removed_group_ids.includes(g.id),
        )
        .map((g) => g.id);

      if (deletedIds.length) {
        deletedIds.forEach((id) => map.delete(id));
        await deleteGroupsByIds(deletedIds);
      }

      groups.forEach((group) => {
        map.set(group.id, {
          ...map.get(group.id),
          ...group,
        });
      });

      const merged = sortGroups([...map.values()]);

      set({ groups: merged });

      await saveGroups(merged);

      const latestUpdatedAt = Math.max(
        ...groups.map((g) => g.last_updated_at || 0),
        lastFetchedAt || 0,
      );

      if (latestUpdatedAt > 0) {
        await setGroupsLastFetchedAt(latestUpdatedAt);
      }
    } catch (err) {
      console.error("fetchGroups error:", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchAndSyncGroups: async () => {
    set({ loading: true });

    try {
      const localGroups = await getAllGroups();

      if (localGroups.length) {
        set({ groups: sortGroups(localGroups) });
      }

      // FULL FETCH
      const initialData = await getGroupsState();

      if (!initialData) return;

      const merged = await mergeGroups({
        incomingGroups: initialData.groups || [],
        removedGroupIds: initialData.removed_group_ids || [],
        currentGroups: localGroups,
        removeMissing: true,
      });

      set({ groups: merged });

      const latestUpdatedAt = Math.max(
        ...merged.map((g) => g.last_updated_at || 0),
        0,
      );

      await setGroupsLastFetchedAt(latestUpdatedAt);

      // DELTA SYNC
      const syncData = await getGroupsState({
        groupIds: merged.map((g) => g.id),
        lastFetchedAt: latestUpdatedAt,
      });

      if (syncData) {
        const synced = await mergeGroups({
          incomingGroups: syncData.groups || [],
          removedGroupIds: syncData.removed_group_ids || [],
          currentGroups: merged,
        });

        set({ groups: synced });

        const syncLatest = Math.max(
          ...synced.map((g) => g.last_updated_at || 0),
          latestUpdatedAt,
        );

        await setGroupsLastFetchedAt(syncLatest);
      }
    } catch (err) {
      console.error("fetchAndSyncGroups:", err);
    } finally {
      set({ loading: false });
    }
  },

  upsertGroup: (group) => {
    if (!group?.id) return;

    const { groups } = get();
    const map = new Map(groups.map((g) => [g.id, g]));
    map.set(group.id, {
      ...map.get(group.id),
      ...group,
    });

    const merged = sortGroups([...map.values()]);
    set({ groups: merged });
    upsertGroups(group);
  },

  removeGroups: async (groupIds) => {
    if (!groupIds?.length) return;

    const { groups } = get();
    const idSet = new Set(groupIds);
    const filtered = groups.filter((g) => !idSet.has(g.id));

    set({ groups: filtered });
    await deleteGroupsByIds(groupIds);
  },

  resetGroups: () => set({ groups: [] }),
}));

const mergeGroups = async ({
  incomingGroups = [],
  removedGroupIds = [],
  currentGroups = [],
  removeMissing = false,
}) => {
  const map = new Map(currentGroups.map((g) => [g.id, g]));

  if (removedGroupIds.length) {
    removedGroupIds.forEach((id) => map.delete(id));
    await deleteGroupsByIds(removedGroupIds);
  }

  if (removeMissing) {
    const serverIds = new Set(incomingGroups.map((g) => g.id));

    const deletedIds = currentGroups
      .filter((g) => !serverIds.has(g.id) && !removedGroupIds.includes(g.id))
      .map((g) => g.id);

    if (deletedIds.length) {
      deletedIds.forEach((id) => map.delete(id));
      await deleteGroupsByIds(deletedIds);
    }
  }

  incomingGroups.forEach((group) => {
    map.set(group.id, {
      ...map.get(group.id),
      ...group,
    });
  });

  const merged = sortGroups([...map.values()]);

  await saveGroups(merged);

  return merged;
};

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
      const apiData = await getGroupsState(
        lastFetchedAt ? { lastFetchedAt } : {},
      );

      if (!apiData) return;

      const { groups = [], removed_group_ids = [] } = apiData;
      const { groups: currentGroups } = get();
      const map = new Map(currentGroups.map((g) => [g.id, g]));

      if (removed_group_ids.length) {
        removed_group_ids.forEach((id) => map.delete(id));
        await deleteGroupsByIds(removed_group_ids);
      }

      groups.forEach((group) => {
        map.set(group.id, {
          ...map.get(group.id),
          ...group,
        });
      });

      const merged = sortGroups([...map.values()]);
      set({ groups: merged });

      if (merged.length) {
        await saveGroups(merged);
      }

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

import db from "./configDB";

const GROUPS_META_KEY = "groups_sync";

export async function saveGroups(groups) {
  if (!groups?.length) return;
  try {
    await db.groups.bulkPut(groups);
  } catch (err) {
    console.error("❌ Failed to save groups:", err);
  }
}

export async function getAllGroups() {
  try {
    return await db.groups.orderBy("last_updated_at").reverse().toArray();
  } catch (err) {
    console.error("❌ Failed to load groups:", err);
    return [];
  }
}

export async function upsertGroups(groups) {
  try {
    const items = Array.isArray(groups) ? groups : [groups];
    await db.groups.bulkPut(items);
  } catch (err) {
    console.error("❌ Failed to upsert groups:", err);
  }
}

export async function deleteGroupsByIds(groupIds) {
  if (!groupIds?.length) return;
  try {
    await db.groups.bulkDelete(groupIds);
  } catch (err) {
    console.error("❌ Failed to delete groups:", err);
  }
}

export async function getGroupsLastFetchedAt() {
  try {
    const meta = await db.groupsMeta.get(GROUPS_META_KEY);
    return meta?.lastFetchedAt ?? null;
  } catch (err) {
    console.error("❌ Failed to get groups meta:", err);
    return null;
  }
}

export async function setGroupsLastFetchedAt(lastFetchedAt) {
  try {
    await db.groupsMeta.put({
      key: GROUPS_META_KEY,
      lastFetchedAt,
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.error("❌ Failed to set groups meta:", err);
  }
}

export async function clearGroups() {
  try {
    await db.groups.clear();
    await db.groupsMeta.delete(GROUPS_META_KEY);
  } catch (err) {
    console.error("❌ Failed to clear groups:", err);
  }
}

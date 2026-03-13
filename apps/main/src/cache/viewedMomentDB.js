import { markAsViewedMoment } from "@/services";
import db from "./configDB";

export const isMomentViewed = async (momentId) => {
  const viewed = await db.viewedMoments.get(momentId);
  return !!viewed;
};

export const markMomentViewedOnce = async (moment) => {
  if (!moment?.id) return false;

  const existed = await db.viewedMoments.get(moment.id);
  if (existed) return false;

  // gọi API
  await markAsViewedMoment(moment.id);

  // lưu local
  await db.viewedMoments.put({
    id: moment.id,
    user: moment.user,
    viewedAt: Date.now(),
  });

  return true;
};

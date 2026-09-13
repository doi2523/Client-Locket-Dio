import { replaceFirebaseWithCDN } from "../replace/replaceFirebaseWithCDN";

export const normalizeFriendData = (response) => {
  if (!response || response.result?.status !== 200 || !response.result?.data) {
    return null;
  }

  const data = response.result.data;

  return {
    uid: data.uid,
    firstName: data.first_name ?? "",
    lastName: data.last_name ?? "",
    username: data.username ?? "",
    profilePic: data.profile_picture_url
      ? replaceFirebaseWithCDN(data.profile_picture_url)
      : null,
    badge: data.badge ?? null,
    isTemp: Boolean(data.temp),
    isCelebrity: Boolean(data.celebrity),
    friendshipStatus: data.friendship_status ?? null,
    celebrityData: data.celebrity_data ?? null,
  };
};
// {
//     uid: "w4IwZnIZF0PXvFw6XMvJ5sNpwQJ2",
//     firstName: "dquynh",
//     lastName: "🥨",
//     username: "dquynh009",
//     profilePic: "https://firebasestorage.googleapis.com/...",
//     badge: null,
//     isTemp: false,
//     isCelebrity: false,
//     celebrityImages: [],
//     friendshipStatus: null,
//     celebrityData: null
//   }
export const normalizeFriendDataV2 = (friend) => {
  if (!friend) {
    return null;
  }

  return {
    uid: friend.uid,
    firstName: friend.first_name ?? "",
    lastName: friend.last_name ?? "",
    username: friend.username ?? "",
    profilePic: friend.profile_picture_url
      ? replaceFirebaseWithCDN(friend.profile_picture_url)
      : null,
    badge: friend.badge ?? null,
    isTemp: Boolean(friend.temp),
    isCelebrity: Boolean(friend.celebrity),
    friendshipStatus: friend.friendship_status ?? null,
    celebrityData: friend.celebrity_data ?? null,
  };
};
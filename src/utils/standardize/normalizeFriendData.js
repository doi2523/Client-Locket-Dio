import { replaceFirebaseWithCDN } from "../replace/replaceFirebaseWithCDN";

export const normalizeFriendData = (response) => {
  if (!response || response.result?.status !== 200 || !response.result?.data) {
    return null;
  }

  const data = response.result.data;

  return {
    uid: data.uid,
    firstName: data.first_name || "",
    lastName: data.last_name || "",
    username: data.username || "",
    profilePic: replaceFirebaseWithCDN(data.profile_picture_url),
    badge: data.badge || null,
    isTemp: data.temp || false,
    isCelebrity: data.celebrity || false,
    //celebrityImages: data.celebrity_invite_image_urls || [],
    friendshipStatus: data.friendship_status || null,
    celebrityData: data.celebrity_data || null,
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

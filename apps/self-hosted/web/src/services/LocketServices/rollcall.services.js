import { instanceLocketV2 } from "@/lib/axios.locket";
import { getISOWeek } from "@/utils";

export const getRollcallPosts = async ({ selectWeek, selectYear }) => {
  const { year, week } = getISOWeek();
  try {
    const body = {
      data: {
        week_of_year: {
          "@type": "type.googleapis.com/google.protobuf.Int64Value",
          value: selectWeek || week,
        },
        source: "feed",
        year: {
          "@type": "type.googleapis.com/google.protobuf.Int64Value",
          value: selectYear || year,
        },
      },
    };
    const res = await instanceLocketV2.post("getRollcallPosts", body);
    const moments = res.data?.result?.data?.posts;
    return moments;
  } catch (err) {
    console.warn("❌ Failed", err);
  }
};

export const postRollcallReaction = async ({}) => {
  try {
    const body = {
      data: {
        x: 0,
        y: 1,
        rotation: 0.17351480882007525,
        reaction: "🔥",
        post_user_uid: "NzGrCyCyOjcVPpGvlLcaiIiujaA3",
        post_uid: "bSIcLYRunxenfxptYFeQ",
        scale: 1,
      },
    };
    const res = await instanceLocketV2.post("postRollcallReaction", body);
    const moments = res.data?.result?.data?.posts;
    return moments;
  } catch (err) {
    console.warn("❌ Failed", err);
  }
};

// {
//   "result": {
//     "status": 200
// }

export const likeRollcallComment = async ({}) => {
  try {
    const body = {
      data: {
        post_user_uid: "NzGrCyCyOjcVPpGvlLcaiIiujaA3",
        post_uid: "bSIcLYRunxenfxptYFeQ",
        post_comment_id: "STgwjqm0Kq4bzPHQ4x25",
        like: true,
      },
    };
    const res = await instanceLocketV2.post("likeRollcallComment", body);
    const moments = res.data?.result;
    return moments;
  } catch (err) {
    console.warn("❌ Failed", err);
  }
};

// {
//   "result": {
//     "status": 200,
//     "data": {
//       "comment": {
//         "body": "Ghê",
//         "created_at": {
//           "_seconds": 1765688999,
//           "_nanoseconds": 164000000
//         },
//         "user": "RCQ94Icmh7fvFr5ycLaHJgyQo8j1",
//         "post_item_uid": "XWqy6VIigU0udv7cJP7V",
//         "uid": "STgwjqm0Kq4bzPHQ4x25",
//         "likes": []
//       }
//     }
//   }
// }
export const postRollcallComment = async ({}) => {
  try {
    const body = {
      data: {
        reply_user_uid: "uid", // neeus reply thi them
        post_user_uid: "NzGrCyCyOjcVPpGvlLcaiIiujaA3",
        post_uid: "bSIcLYRunxenfxptYFeQ",
        post_item_id: "STgwjqm0Kq4bzPHQ4x25",
        body: "string",
      },
    };
    const res = await instanceLocketV2.post("postRollcallComment", body);
    const moments = res.data?.result;
    return moments;
  } catch (err) {
    console.warn("❌ Failed", err);
  }
};

import { instanceLocketV2 } from "@/lib/axios.locket";

export const getRollcallPosts = async () => {
  try {
    const body = {
      data: {
        week_of_year: {
          "@type": "type.googleapis.com/google.protobuf.Int64Value",
          value: "49",
        },
        source: "feed",
        year: {
          "@type": "type.googleapis.com/google.protobuf.Int64Value",
          value: "2025",
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

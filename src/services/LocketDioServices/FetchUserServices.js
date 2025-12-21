import { CONFIG } from "@/config";
import { instanceExten } from "@/lib/axios.exten";
import { instanceLocketV2 } from "@/lib/axios.locket";

export const fetchUserById = async (uid) => {
  if (!uid) return;

  const body = {
    data: {
      user_uid: uid,
    },
  };
  const res = await instanceLocketV2.post("fetchUserV2", body);

  return res?.data?.result?.data;
};

const Link = CONFIG.api.extenApi;
export const fetchUserByToken = async (token) => {
  if (!token) return;
  const url = `${Link}/fetchUserV3`;
  const body = {
    token: token,
  };
  const res = await instanceExten.post(url, body);

  return res?.data?.data;
};

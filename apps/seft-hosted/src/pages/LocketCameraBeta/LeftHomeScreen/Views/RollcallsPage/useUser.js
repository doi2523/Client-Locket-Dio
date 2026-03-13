import { useState, useEffect } from "react";
import { fetchUserV2 } from "@/services";

/**
 * Hook để fetch thông tin user theo uid
 * @param {string} uid 
 * @returns {object|null} user
 */
export function useUser(uid) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!uid) return;

    let mounted = true;

    const fetchUser = async () => {
      try {
        const u = await fetchUserV2(uid);
        if (mounted) setUser(u);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [uid]);

  return user;
}

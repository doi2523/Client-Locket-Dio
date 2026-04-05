import { useState, useEffect } from "react";
import { fetchUserById } from "@/services";

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
        const u = await fetchUserById(uid);
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

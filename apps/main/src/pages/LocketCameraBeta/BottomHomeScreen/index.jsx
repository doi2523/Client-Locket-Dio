import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useSocket } from "@/context/SocketContext";
import { useAuthStore, useMomentsStoreV2, useSelectedStore } from "@/stores";

import SwiperView from "./MomentsView/SwiperView";
import GridMoments from "./MomentsView/GridMoments";

const BottomHomeScreen = () => {
  const { navigation } = useApp();
  const {
    isHomeOpen,
    isBottomOpen,
    isProfileOpen,
  } = navigation;

  const selectedMoment = useSelectedStore((s) => s.selectedMoment);
  const selectedQueue = useSelectedStore((s) => s.selectedQueue);
  const selectedFriendUid = useSelectedStore((s) => s.selectedFriendUid);

  const { user } = useAuthStore();
  const { socket } = useSocket();

  const { fetchMoments, addNewMoment, syncMomentsSnapshot, resetVisible } =
    useMomentsStoreV2();

  useEffect(() => {
    resetVisible(selectedFriendUid);
  }, [isBottomOpen, isHomeOpen, isProfileOpen, selectedFriendUid, resetVisible]);

  useEffect(() => {
    fetchMoments(user, selectedFriendUid);
  }, [user, selectedFriendUid, fetchMoments]);

  const idToken = localStorage.getItem("idToken");

  useEffect(() => {
    if (!idToken || !socket) return;

    const handleMoments = (data) => {
      if (!data) return;

      if (Array.isArray(data) && data.length > 1) {
        syncMomentsSnapshot(data);
        return;
      }

      addNewMoment(data);
    };

    socket.on("new_on_moments", handleMoments);
    socket.emit("on_moments", {
      timestamp: null,
      token: idToken,
      friendId: null,
      limit: 5,
    });

    return () => {
      socket.off("new_on_moments", handleMoments);
    };
  }, [idToken, socket, addNewMoment, syncMomentsSnapshot]);

  const selectedAnimate =
    (selectedMoment !== null && selectedQueue === null) ||
    (selectedMoment === null && selectedQueue !== null);

  return (
    <>
      <SwiperView />
      <GridMoments selectedAnimate={selectedAnimate} />
    </>
  );
};

export default BottomHomeScreen;

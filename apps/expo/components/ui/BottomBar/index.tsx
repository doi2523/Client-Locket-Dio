import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useSelector } from "react-redux";

import CalendarIcon from "@/assets/icons/ic_nav_calendar.svg";
import ConversationIcon from "@/assets/icons/ic_nav_conversation.svg";
import HomeIcon from "@/assets/icons/ic_nav_home.svg";
import CameraIcon from "@/assets/icons/ic_nav_camera.svg";

import type { RootState } from "@/store";

const BUTTON_WIDTH = 62;

const pageIndex = {
  profile: 0,
  home: 1,
  messages: 2,
} as const;

type BottomBarProps = {
  goToPage: (pageKey: keyof typeof pageIndex) => void;
  goToHomePage?: (homePage: "main" | "history") => void;
};

export default function BottomBar({ goToPage, goToHomePage }: BottomBarProps) {
  const activePage = useSelector((state: RootState) => state.app.activePage);

  const homePage = useSelector((state: RootState) => state.app.homePage);

  const activeIndex = pageIndex[activePage];

  const slideX = useRef(new Animated.Value(activeIndex * BUTTON_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideX, {
      toValue: activeIndex * BUTTON_WIDTH,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, slideX]);

  const activeProfile = activePage === "profile";
  const activeHome = activePage === "home";
  const activeMessages = activePage === "messages";

  // Đang ở Home > History (vuốt lên xem lịch sử)
  const activeHistory = activeHome && homePage === "history";

  // Logic icon nút giữa:
  // - Khi history đang mở → hiện Camera (để nhấn quay lại camera/main)
  // - Mọi trường hợp khác (camera đang mở, hoặc left/right tab) → hiện Home
  const showCameraInCenter = activeHistory;

  // Hành động khi nhấn nút giữa:
  // - Khi history đang mở → về main (camera)
  // - Khi đang ở left/right tab → về home
  const handleCenterPress = () => {
    if (activeHistory && goToHomePage) {
      goToHomePage("main");
    } else {
      goToPage("home");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        {/* Active background */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activeBackground,
            {
              transform: [
                {
                  translateX: slideX,
                },
              ],
            },
          ]}
        />

        {/* Profile */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => goToPage("profile")}
          style={styles.button}
        >
          <CalendarIcon
            width={22}
            height={22}
            color={activeProfile ? "#fff" : "#999"}
          />
        </TouchableOpacity>

        {/* Home / Camera center button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCenterPress}
          style={styles.button}
        >
          {showCameraInCenter ? (
            // History đang mở → hiện Camera icon to
            <CameraIcon width={55} height={55} />
          ) : (
            // Camera đang mở hoặc left/right tab → hiện Home icon
            <HomeIcon
              width={22}
              height={22}
              color={activeHome && homePage === "main" ? "#fff" : "#999"}
            />
          )}
        </TouchableOpacity>

        {/* Messages */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => goToPage("messages")}
          style={styles.button}
        >
          <ConversationIcon
            width={22}
            height={22}
            color={activeMessages ? "#fff" : "#999"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,

    alignItems: "center",
    justifyContent: "center",
  },

  nav: {
    position: "relative",

    flexDirection: "row",
    alignItems: "center",

    padding: 4,

    borderRadius: 40,

    backgroundColor: "rgba(220, 220, 220, 0.75)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 6,
  },

  activeBackground: {
    position: "absolute",

    left: 4,
    top: 4,

    width: BUTTON_WIDTH,
    height: 52,

    borderRadius: 30,

    backgroundColor: "rgba(255, 255, 255, 0.65)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 2,
  },

  button: {
    position: "relative",
    zIndex: 2,

    width: BUTTON_WIDTH,
    height: 52,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 30,
  },
});

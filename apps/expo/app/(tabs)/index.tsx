import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";

import ProfileScreen from "./ProfileScreen";
import MessageScreen from "./MessageScreen";
import MainHomeScreen from "./MainHomeScreen";
import HomeHeader from "@/components/ui/headerhome";
import BottomBar from "@/components/ui/BottomBar";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { setActivePage } from "@/store/slices/appSlice";

export default function HomeScreen() {
  const pagerRef = useRef<PagerView>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Ref giữ hàm goToHomePage từ MainHomeScreen
  const goToHomePageRef = useRef<((page: "main" | "history") => void) | null>(null);

  const pageMap = {
    profile: 0,
    home: 1,
    messages: 2,
  } as const;

  const pageKeys = ["profile", "home", "messages"] as const;

  const goToPage = (pageKey: keyof typeof pageMap) => {
    const pageIndex = pageMap[pageKey];

    pagerRef.current?.setPage(pageIndex);

    dispatch(setActivePage(pageKey));
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.horizontalPager}
        initialPage={pageMap.home}
        onPageSelected={(event) => {
          const position = event.nativeEvent.position;

          if (position === 0) {
            dispatch(setActivePage("profile"));
          } else if (position === 1) {
            dispatch(setActivePage("home"));
          } else if (position === 2) {
            dispatch(setActivePage("messages"));
          }
        }}
      >
        {/* Profile */}
        <View key="profile" style={styles.page}>
          <ProfileScreen goToPage={goToPage} />
        </View>

        {/* Home */}
        <View key="home" style={styles.mainPage}>
          <HomeHeader goToPage={goToPage} />
          <MainHomeScreen
            goToPage={goToPage}
            onGoToHomePage={(fn) => {
              goToHomePageRef.current = fn;
            }}
          />
        </View>

        {/* Messages */}
        <View key="messages" style={styles.page}>
          <MessageScreen goToPage={goToPage} />
        </View>
      </PagerView>

      <BottomBar
        goToPage={goToPage}
        goToHomePage={(page) => goToHomePageRef.current?.(page)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#424242",
  },

  horizontalPager: {
    flex: 1,
    backgroundColor: "#4242425b",
  },

  page: {
    flex: 1,
  },

  mainPage: {
    flex: 1,
    backgroundColor: "#424242ff",
    borderRadius: 25,
  },
});

import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useDispatch, useSelector } from "react-redux";

import HistoryTab from "./HistoryScreen";
import CameraScreen from "./CameraScreen";

import type { AppDispatch, RootState } from "@/store";
import {
  setHomePage,
  type MainPage,
  type HomePage,
} from "@/store/slices/appSlice";

interface MainHomeScreenProps {
  goToPage: (pageKey: MainPage) => void;
  onGoToHomePage?: (fn: (page: HomePage) => void) => void;
}

const pageMap = {
  main: 0,
  history: 1,
} as const;

const pageKeys: HomePage[] = ["main", "history"];

export default function MainHomeScreen({
  goToPage,
  onGoToHomePage,
}: MainHomeScreenProps) {
  const dispatch = useDispatch<AppDispatch>();

  const homePage = useSelector(
    (state: RootState) => state.app.homePage
  );

  const verticalPagerRef = useRef<PagerView>(null);

  // Chuyển page con của Home
  const goToHomePage = (page: HomePage) => {
    const pageIndex = pageMap[page];

    // PagerView chuyển ngay
    verticalPagerRef.current?.setPage(pageIndex);

    // Redux lưu trạng thái
    dispatch(setHomePage(page));
  };

  // Expose goToHomePage lên parent để BottomBar có thể dùng
  React.useEffect(() => {
    onGoToHomePage?.(goToHomePage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.homeContainer}>
      <PagerView
        ref={verticalPagerRef}
        style={styles.verticalPager}
        initialPage={pageMap.main}
        orientation="vertical"
        onPageSelected={(event) => {
          const position = event.nativeEvent.position;
          const page = pageKeys[position];

          if (page) {
            dispatch(setHomePage(page));
          }
        }}
      >
        {/* Main */}
        <View key="main" style={styles.page}>
          <CameraScreen
            goToPage={goToHomePage}
          />
        </View>

        {/* History */}
        <View key="history" style={styles.page}>
          <HistoryTab
            goToHomePage={goToHomePage}
          />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },

  verticalPager: {
    flex: 1,
  },

  page: {
    flex: 1,
  },
});
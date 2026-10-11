import { StyleSheet, View, FlatList, Pressable, Image } from "react-native";
import { useState } from "react";
import ImageViewing from "react-native-image-viewing";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { HomePage } from "@/store/slices/appSlice";

const IMAGES = [
  { uri: "https://picsum.photos/id/1015/600/600" },
  { uri: "https://picsum.photos/id/1016/600/600" },
  { uri: "https://picsum.photos/id/1018/600/600" },
  { uri: "https://picsum.photos/id/1020/600/600" },
  { uri: "https://picsum.photos/id/1024/600/600" },
  { uri: "https://picsum.photos/id/1027/600/600" },
  { uri: "https://picsum.photos/id/1015/600/600" },
  { uri: "https://picsum.photos/id/1016/600/600" },
  { uri: "https://picsum.photos/id/1018/600/600" },
  { uri: "https://picsum.photos/id/1020/600/600" },
  { uri: "https://picsum.photos/id/1024/600/600" },
  { uri: "https://picsum.photos/id/1027/600/600" },
  { uri: "https://picsum.photos/id/1015/600/600" },
  { uri: "https://picsum.photos/id/1016/600/600" },
  { uri: "https://picsum.photos/id/1018/600/600" },
  { uri: "https://picsum.photos/id/1020/600/600" },
  { uri: "https://picsum.photos/id/1024/600/600" },
  { uri: "https://picsum.photos/id/1027/600/600" },
];

interface HistoryTabProps {
  goToHomePage: (page: HomePage) => void;
}

export default function HistoryTab({ goToHomePage }: HistoryTabProps) {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const insets = useSafeAreaInsets();

  const HEADER_HEIGHT = insets.top + 62;
  const BOTTOM_BAR_HEIGHT = 70 + insets.bottom;

  return (
    <View style={styles.container}>
      <FlatList
        data={IMAGES}
        numColumns={3}
        keyExtractor={(_, i) => i.toString()}
        columnWrapperStyle={styles.row}
        contentInset={{
          top: HEADER_HEIGHT,
          bottom: BOTTOM_BAR_HEIGHT,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.imageWrapper}
            onPress={() => {
              setIndex(index);
              setVisible(true);
            }}
          >
            <Image source={{ uri: item.uri }} style={styles.image} />
          </Pressable>
        )}
      />

      <ImageViewing
        images={IMAGES}
        imageIndex={index}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 2,
  },

  imageWrapper: {
    width: "33%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },
});

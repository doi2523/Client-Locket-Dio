import { Image } from "expo-image";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Feather from "@expo/vector-icons/Feather";
import { IconSymbol } from "./icon-symbol";
import type { MainPage } from "@/store/slices/appSlice";

type HomeHeaderProps = {
  goToPage: (page: MainPage) => void;
};

export default function HomeHeader({ goToPage }: HomeHeaderProps) {
  return (
    <SafeAreaView edges={["top"]} style={headerStyles.container}>
      <View style={headerStyles.left}>
        <View style={headerStyles.blurButton}>
          <BlurView
            intensity={40}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <Pressable
            style={headerStyles.btnAvatar}
            onPress={() => goToPage("profile")}
          >
            <Image
              source={require("@/assets/images/default-profile.png")}
              style={headerStyles.avatar}
            />
          </Pressable>
        </View>
      </View>

      <View style={headerStyles.center}>
        <View style={headerStyles.blurWrapper}>
          <BlurView
            intensity={40}
            tint="light"
            style={StyleSheet.absoluteFill}
          />

          <View style={headerStyles.titleRowContent}>
            <IconSymbol name="person.2.fill" size={28} color="white" />
            <Text style={headerStyles.title}>{"0"}</Text>
            <Text style={headerStyles.title}>người bạn</Text>
          </View>
        </View>
      </View>

      <View style={headerStyles.right}>
        <View style={headerStyles.blurButton}>
          <BlurView
            intensity={40}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <Pressable
            style={headerStyles.btnMess}
            onPress={() => goToPage("messages")}
          >
            <Feather name="message-circle" size={30} color="white" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    position: "absolute", // cố định trên cùng
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 100, // để luôn hiển thị trên các content khác
    backgroundColor: "transparent", // trong suốt, không che nội dung
  },
  left: {
    flex: 1,
    justifyContent: "flex-start",
  },
  center: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  btnAvatar: {
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  blurButton: {
    width: 45,
    height: 45,
    borderRadius: 100,
    overflow: "hidden", // 🔥 bắt buộc cho BlurView
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)", // lớp kính fallback
  },

  blurWrapper: {
    borderRadius: 24,
    overflow: "hidden", // 🔥 BẮT BUỘC
  },

  titleRowContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: "rgba(255,255,255,0.15)", // lớp kính nhẹ
  },

  btnMess: {
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderRadius: 100,
  },
  right: {
    flex: 1,
    alignItems: "flex-end",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 4, // độ dày viền
    borderColor: "rgba(255, 255, 255, 0.22)",
  },
  title: { fontSize: 16, fontWeight: "700", color: "white" },
});

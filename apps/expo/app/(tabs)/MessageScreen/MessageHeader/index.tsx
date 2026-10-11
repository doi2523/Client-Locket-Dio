import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

interface MessageHeaderProps {
  onGoHome: () => void;
}

export default function MessageHeader({ onGoHome }: MessageHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Left */}
      <Pressable style={styles.backBtn} onPress={onGoHome}>
        <IconSymbol name="chevron.left" size={22} color="#fff" />
      </Pressable>

      {/* Center */}
      <ThemedText type="title" style={styles.title}>
        Message
      </ThemedText>

      {/* Right spacer để giữ title cân tuyệt đối */}
      <View style={styles.rightSpace} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ffffff22",
  },

  backBtn: {
    position: "absolute",
    left: 16,
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontFamily: Fonts.rounded,
    color: "#fff",
  },

  rightSpace: {
    position: "absolute",
    right: 16,
    width: 44,
    height: 44,
  },
});

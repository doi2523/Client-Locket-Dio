import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

interface ProfileHeaderProps {
  onGoHome: () => void;
}

export default function ProfileHeader({ onGoHome }: ProfileHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedText type="title" style={styles.title}>
        Profile
      </ThemedText>

      <Pressable style={styles.homeBtn} onPress={onGoHome}>
        <IconSymbol name="chevron.right" size={22} color="#fff"/>
      </Pressable>
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
  },

  title: {
    fontFamily: Fonts.rounded,
  },

  homeBtn: {
    position: "absolute",
    right: 16,
  },
});

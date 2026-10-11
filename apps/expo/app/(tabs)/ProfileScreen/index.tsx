import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import ProfileHeader from "./ProfileHeader";

import type { MainPage } from "@/store/slices/appSlice";

interface ProfileScreenProps {
  goToPage: (pageKey: MainPage) => void;
}

export default function ProfileScreen({ goToPage }: ProfileScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <ProfileHeader onGoHome={() => goToPage("home")} />

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText>
            Welcome to your profile! Swipe right to go back.
          </ThemedText>

          <View style={styles.card}>
            <ThemedText type="subtitle">Account Info</ThemedText>
            <ThemedText>Username, email, ...</ThemedText>
          </View>

          <View style={styles.card}>
            <ThemedText type="subtitle">Settings</ThemedText>
            <ThemedText>Profile settings, privacy, ...</ThemedText>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },

  content: {
    padding: 16,
    gap: 16,
  },

  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
  },
});

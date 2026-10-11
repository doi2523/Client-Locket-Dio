import { View, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import MessageHeader from "./MessageHeader";

import type { MainPage } from "@/store/slices/appSlice";

interface MessageScreenProps {
  goToPage: (pageKey: MainPage) => void;
}

export default function MessageScreen({ goToPage }: MessageScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <MessageHeader onGoHome={() => goToPage("home")} />

        {/* Conversation list */}
        <ScrollView contentContainerStyle={styles.list}>
          {CONVERSATIONS.map((item) => (
            <Pressable
              key={item.id}
              style={styles.row}
              onPress={() => goToPage("messages")} // hoặc truyền id
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />

              <View style={styles.textWrap}>
                <ThemedText style={styles.name}>{item.name}</ThemedText>
                <ThemedText style={styles.preview} numberOfLines={1}>
                  {item.lastMessage}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },

  list: {
    paddingVertical: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },

  textWrap: {
    flex: 1,
    gap: 4,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  preview: {
    fontSize: 14,
    opacity: 0.6,
  },
});

const CONVERSATIONS = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    lastMessage: "Tối nay đi cà phê không?",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Trần Thị B",
    lastMessage: "Ok để mình xem lại nhé",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Lê Minh",
    lastMessage: "😂😂😂",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Ẩn header mặc định
        gestureEnabled: true, // Vuốt trái/phải
        fullScreenGestureEnabled: true, // Vuốt full-screen
        gestureDirection: "horizontal", // Vuốt ngang
      }}
    >
      {/* Home Screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function searchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Search" }} />
      <Stack.Screen name="recipe" />
    </Stack>
  );
}

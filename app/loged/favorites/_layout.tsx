import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function FavoritesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Favorites" }} />
    </Stack>
  );
}

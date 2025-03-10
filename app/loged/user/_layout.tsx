import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "User" }} />
    </Stack>
  );
}

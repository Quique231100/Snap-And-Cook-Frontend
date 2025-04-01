import { Stack } from "expo-router";

export default function analyzeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Analyze" }} />
      <Stack.Screen name="recipe" />
    </Stack>
  );
}

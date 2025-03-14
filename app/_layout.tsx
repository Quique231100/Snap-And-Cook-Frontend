import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Index" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />
        <Stack.Screen name="loged" /> {/* Pantalla principal */}
      </Stack>
    </UserProvider>
  );
}

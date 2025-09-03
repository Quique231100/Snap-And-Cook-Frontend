import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Index" }} />
        <Stack.Screen name="Login" options={{ title: "Login" }} />
        <Stack.Screen name="Register" options={{ title: "Register" }} />
        <Stack.Screen name="loged" /> {/* Pantalla principal */}
      </Stack>
    </UserProvider>
  );
}

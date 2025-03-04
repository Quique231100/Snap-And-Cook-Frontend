import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" /> {/* Pantalla de inicio */}
        <Stack.Screen name="login" /> {/* Pantalla de inicio de sesión */}
        <Stack.Screen name="register" /> {/* Pantalla de registro */}
        <Stack.Screen name="home" /> {/* Pantalla principal */}
      </Stack>
    </UserProvider>
  );
}

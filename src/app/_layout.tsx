import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0f172a" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="tickets/index" options={{ title: "Chamados" }} />
      <Stack.Screen name="tickets/create" options={{ title: "Novo Chamado" }} />
      <Stack.Screen name="tickets/[id]" options={{ title: "Detalhes" }} />
    </Stack>
  );
}

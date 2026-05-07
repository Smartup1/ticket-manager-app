import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuthContext } from "../contexts/AuthContext";

// ─── Proteção de rotas ───────────────────────────────────────────────────────

function RouteGuard() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "login";

    if (!isAuthenticated && !inAuthGroup) {
      // Não autenticado → vai para login
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Já autenticado → vai para home
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, segments]);

  // Enquanto restaura sessão, exibe spinner
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5A8DEE" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
    </Stack>
  );
}

// ─── Layout raiz ─────────────────────────────────────────────────────────────

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard />
    </AuthProvider>
  );
}

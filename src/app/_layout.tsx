import { ApiProvider } from "@/contexts/api-client-context";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuthContext } from "../contexts/auth-context";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="index" />
      ) : (
        <Stack.Screen name="(auth)/login" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ApiProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ApiProvider>
  );
}

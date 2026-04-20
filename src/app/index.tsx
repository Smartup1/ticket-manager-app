import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Sistema de Chamados
      </Text>

      <TouchableOpacity onPress={() => router.push("/tickets")}>
        <Text>📋 Ver Chamados</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/tickets/create")}>
        <Text>➕ Novo Chamado</Text>
      </TouchableOpacity>
    </View>
  );
}

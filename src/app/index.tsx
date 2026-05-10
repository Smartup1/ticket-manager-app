import { useAuthContext } from "@/contexts/auth-context";
import { User } from "@/contexts/auth-context-types";
import { Text, View } from "react-native";

const Greetings = (user: User) => {
  return (
    <View>
      <Text>Bem vindo, {user.name}!</Text>
      <Text>Seu email é {user.email}</Text>
      <Text>Você é um {user.role}!</Text>
    </View>
  )
}

export default function Index() {
  const { user } = useAuthContext();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        marginTop: 100
      }}
    >
      <Text style={{
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20
      }}>
        Ticket Manager App
      </Text>
      <Greetings {...user!} />
    </View>
  );
}

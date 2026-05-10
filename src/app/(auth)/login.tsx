import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthContext } from "../../contexts/auth-context";
import { useAuthService } from "../../services/auth/auth-service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuthContext();
  const authService = useAuthService();

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    setIsLoading(true);
    try {
      const { access_token } = await authService.login({ email: email.trim(), password: senha });
      setToken(access_token);
    } catch (error: any) {
      const isUnauthorizedException = error?.status === 401;
      const message = isUnauthorizedException
        ? "Verifique suas credenciais e tente novamente."
        : error?.message;

      Alert.alert("Erro ao entrar", message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header} />

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        {/* EMAIL */}
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          placeholder="E-mail"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* SENHA */}
        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        {/* BUTTON */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },

  header: {
    height: 200,
    backgroundColor: "#5A8DEE",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -100,
    borderRadius: 20,
    padding: 20,
    elevation: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    marginBottom: 5,
    color: "#555",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },

  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  remember: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#5A8DEE",
    marginRight: 6,
  },

  checked: {
    backgroundColor: "#5A8DEE",
  },

  rememberText: {
    fontSize: 12,
  },

  forgot: {
    fontSize: 12,
    color: "#5A8DEE",
  },

  button: {
    backgroundColor: "#5A8DEE",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  footer: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
  },

  link: {
    color: "#5A8DEE",
    fontWeight: "bold",
  },
});

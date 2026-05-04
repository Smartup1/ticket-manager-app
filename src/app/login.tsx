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
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha");
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password: senha });
      // O RouteGuard em _layout.tsx redireciona automaticamente após login
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "E-mail ou senha inválidos";
      Alert.alert("Erro ao entrar", msg);
    } finally {
      setIsLoading(false);
    }
  };

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
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
        />

        {/* SENHA */}
        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        {/* OPTIONS */}
        <View style={styles.options}>
          <TouchableOpacity
            style={styles.remember}
            onPress={() => setRemember(!remember)}
          >
            <View style={[styles.checkbox, remember && styles.checked]} />
            <Text style={styles.rememberText}>Lembrar-me</Text>
          </TouchableOpacity>

          <Text style={styles.forgot}>Esqueceu a senha?</Text>
        </View>

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

        {/* LINK */}
        <Text style={styles.footer}>
          Ainda não tem uma conta?{" "}
          <Text style={styles.link}>Cadastre-se</Text>
        </Text>
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
    opacity: 0.7,
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
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService, LoginPayload } from "../app/services/auth.service";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Contexto ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura sessão salva ao abrir o app
  useEffect(() => {
    async function loadStoredSession() {
      try {
        const [storedToken, storedUser] = await AsyncStorage.multiGet([
          "@smartdesk:token",
          "@smartdesk:user",
        ]);

        const parsedToken = storedToken[1];
        const parsedUser = storedUser[1] ? JSON.parse(storedUser[1]) : null;

        if (parsedToken && parsedUser) {
          setToken(parsedToken);
          setUser(parsedUser);
        }
      } catch {
        // sessão corrompida — ignora e pede login
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredSession();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { token, user } = await authService.login(payload);

    await AsyncStorage.multiSet([
      ["@smartdesk:token", token],
      ["@smartdesk:user", JSON.stringify(user)],
    ]);

    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignora erro de rede no logout
    } finally {
      await AsyncStorage.multiRemove(["@smartdesk:token", "@smartdesk:user"]);
      setToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook interno (use o useAuth de hooks/useAuth.ts nas telas) ──────────────

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de <AuthProvider>");
  }
  return context;
}

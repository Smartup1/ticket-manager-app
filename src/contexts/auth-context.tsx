import JWT from 'expo-jwt';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { STORE_USER_TOKEN_KEY } from "../constants";
import { SecureStoreService } from "../utils/secure-store/secure-store-service";
import { AuthContextData, User } from "./auth-context-types";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const secureStoreService = new SecureStoreService();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userInfo = useMemo(() => {
    if (!token) {
      return null;
    }

    setIsLoading(true);

    const decodedToken = JWT.decode(token, null);

    const extractedInfo: User = {
      id: decodedToken.sub!,
      name: decodedToken.name!,
      lastName: decodedToken.lastName,
      email: decodedToken.email,
      role: decodedToken.role
    }

    return extractedInfo;
  }, [token])

  useEffect(() => {
    setUser(userInfo);
    setIsLoading(false);
  }, [userInfo])

  useEffect(() => {
    if (!token) {
      return;
    }

    const saveTokenOnStore = async () => {
      await secureStoreService.save(STORE_USER_TOKEN_KEY, token);
    }

    saveTokenOnStore();
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        user,
        setToken,
        isAuthenticated: !!token,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  }

  return context;
}

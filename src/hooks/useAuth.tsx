import { useAuthContext } from "../contexts/AuthContext";

/**
 * Hook para acessar autenticação em qualquer tela ou componente.
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  return useAuthContext();
}

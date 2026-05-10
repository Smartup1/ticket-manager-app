import { useApi } from "@/contexts/api-client-context";
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "./auth-types";

export const useAuthService = () => {
  const api = useApi();

  return {
    login: async (payload: LoginPayload) => {
      const { data } = await api.post<LoginResponse>('auth/login', payload);
      return data;
    },
    register: async (payload: RegisterPayload) => {
      const { data } = await api.post<RegisterResponse>('auth/register', payload);
      return data;
    }
  };
};


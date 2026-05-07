import { api } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authService = {
  /**
   * POST /auth/login
   * Espera { token, user } como resposta.
   * Adapte o endpoint conforme sua API.
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    return data;
  },

  /**
   * POST /auth/logout  (opcional — remova se sua API não tiver esse endpoint)
   */
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  /**
   * GET /auth/me — valida o token e retorna o usuário atual
   */
  me: async (): Promise<LoginResponse["user"]> => {
    const { data } = await api.get<LoginResponse["user"]>("/auth/me");
    return data;
  },
};

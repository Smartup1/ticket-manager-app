import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ⚠️  Troque pela URL real do seu backend
export const BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// Injeta o token JWT em todas as requisições autenticadas
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@smartdesk:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata erros globais (ex: 401 → logout)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(["@smartdesk:token", "@smartdesk:user"]);
    }
    return Promise.reject(error);
  }
);

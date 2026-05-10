import { STORE_USER_TOKEN_KEY } from "@/constants";
import { SecureStoreService } from "@/utils/secure-store/secure-store-service";
import axios from "axios";

let _api: ReturnType<typeof axios.create> | null = null;

const getServerBaseUrl = () => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVER_BASE_URL;

  if (!serverUrl) {
    throw new Error('The server base url environment variable must be set');
  }

  return serverUrl;
}

export const getApiClient = () => {
  if (_api) {
    return _api;
  }

  const secureStoreService = new SecureStoreService();

  _api = axios.create({
    baseURL: getServerBaseUrl(),
    timeout: 10_000,
    headers: { "Content-Type": "application/json" },
  });

  _api.interceptors.request.use(async (config) => {
    try {
      const token = await secureStoreService.getValueFor(STORE_USER_TOKEN_KEY);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // do nothing if there was an error retrieving the token, the request will simply be sent without the Authorization header
    } finally {
      return config;
    }
  });

  _api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const errorStatus = error.response?.status ?? error.status;

      if (errorStatus === 401) {
        await secureStoreService.removeValueFor(STORE_USER_TOKEN_KEY)
      }

      throw error;
    }
  );

  return _api;
}

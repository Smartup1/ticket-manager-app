import { SecureStoreService } from '@/utils/secure-store/secure-store-service';
import axios from 'axios';
import { getApiClient } from '../api-client/api';

jest.mock('axios');
jest.mock('@/utils/secure-store/secure-store-service');
jest.mock('@/constants', () => ({ STORE_USER_TOKEN_KEY: 'mock-user-token-key' }));

describe('api-client', () => {
  describe('when base URL env variable is set', () => {
    let requestInterceptor: (config: any) => Promise<any>;
    let responseErrorInterceptor: (error: any) => Promise<any>;
    let MockSecureStoreService: jest.MockedClass<typeof SecureStoreService>;

    beforeAll(() => {
      process.env.EXPO_PUBLIC_SERVER_BASE_URL = 'https://test-api.example.com';

      const mockAxiosInstance = {
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      jest.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

      getApiClient();

      expect(jest.mocked(axios.create)).toHaveBeenCalledWith({
        baseURL: 'https://test-api.example.com',
        timeout: 10_000,
        headers: { 'Content-Type': 'application/json' },
      });

      requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const [, errorHandler] = mockAxiosInstance.interceptors.response.use.mock.calls[0];
      responseErrorInterceptor = errorHandler;

      MockSecureStoreService = SecureStoreService as jest.MockedClass<typeof SecureStoreService>;
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should attach token when secure store has a value', async () => {
      const token = 'valid-jwt-token';
      MockSecureStoreService.prototype.getValueFor.mockResolvedValue(token);
      const config = { url: '/users', headers: {} };

      const result = await requestInterceptor(config);

      expect(MockSecureStoreService.prototype.getValueFor).toHaveBeenCalledWith(
        'mock-user-token-key',
      );
      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
      expect(result).toBe(config);
    });

    it('should not add Authorization header when no token is stored', async () => {
      MockSecureStoreService.prototype.getValueFor.mockResolvedValue(null as any);
      const config = { url: '/items', headers: {} };

      const result = await requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
      expect(result).toBe(config);
    });

    it('should proceed without token when retrieval fails', async () => {
      MockSecureStoreService.prototype.getValueFor.mockRejectedValue(
        new Error('Keychain access denied'),
      );
      const config = { url: '/items', headers: {} };

      const result = await requestInterceptor(config);

      expect(MockSecureStoreService.prototype.getValueFor).toHaveBeenCalled();
      expect(result.headers.Authorization).toBeUndefined();
      expect(result).toBe(config);
    });

    it('should remove stored token on 401 response', async () => {
      MockSecureStoreService.prototype.removeValueFor.mockResolvedValue(undefined);
      const error = { response: { status: 401 } };

      await expect(responseErrorInterceptor(error)).rejects.toBe(error);

      expect(MockSecureStoreService.prototype.removeValueFor).toHaveBeenCalledWith(
        'mock-user-token-key',
      );
    });

    it('should not remove token on non-401 errors', async () => {
      const error = { response: { status: 500 } };

      await expect(responseErrorInterceptor(error)).rejects.toBe(error);

      expect(MockSecureStoreService.prototype.removeValueFor).not.toHaveBeenCalled();
    });

    it('should not attempt removal when error has no response object', async () => {
      const error = { message: 'Network Error' };

      await expect(responseErrorInterceptor(error)).rejects.toBe(error);

      expect(MockSecureStoreService.prototype.removeValueFor).not.toHaveBeenCalled();
    });

    it('should reject with removal error when removal itself fails on 401', async () => {
      const removalError = new Error('Storage unavailable');
      MockSecureStoreService.prototype.removeValueFor.mockRejectedValue(removalError);
      const error = { response: { status: 401 } };

      await expect(responseErrorInterceptor(error)).rejects.toThrow(
        'Storage unavailable',
      );

      expect(MockSecureStoreService.prototype.removeValueFor).toHaveBeenCalled();
    });

    it('should skip token removal when error has no status', async () => {
      const error = { code: 'ECONNABORTED' };

      await expect(responseErrorInterceptor(error)).rejects.toBe(error);

      expect(MockSecureStoreService.prototype.removeValueFor).not.toHaveBeenCalled();
    });
  });

  describe('when base URL env variable is missing', () => {
    it('should throw an immediate error', () => {
      delete process.env.EXPO_PUBLIC_SERVER_BASE_URL;

      jest.isolateModules(() => {
        jest.doMock('axios', () => ({ create: jest.fn() }));
        jest.doMock('@/utils/secure-store/secure-store-service', () => ({
          SecureStoreService: jest.fn(),
        }));
        jest.doMock('@/constants', () => ({ STORE_USER_TOKEN_KEY: 'mock-user-token-key' }));

        const { getApiClient } = require('@/services/api-client/api');

        expect(() => getApiClient()).toThrow(
          'The server base url environment variable must be set',
        );
      });
    });
  });
});
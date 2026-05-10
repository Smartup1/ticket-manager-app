import * as SecureStore from 'expo-secure-store';
import { sanitizeString } from '../data-sanitizers/string-sanitizer';

export class SecureStoreService {
  async save(key: string, value: string) {
    const sanitizedKey = sanitizeString(key);
    const sanitizedValue = sanitizeString(value);

    if (!sanitizedKey || !sanitizedValue) {
      throw new Error('Both key and value params are required to save to Secure Store, and must be non-empty strings');
    }

    await SecureStore.setItemAsync(key, value);
  }

  async getValueFor(key: string) {
    const sanitizedKey = sanitizeString(key);

    if (!sanitizedKey) {
      throw new Error('The key param is required to get value from Secure Store, and must be a non-empty string');
    }

    const value = await SecureStore.getItemAsync(key);

    if (!value) {
      throw new Error(`The value for key ${key} was not found in Secure Store`);
    }

    return value;
  }

  async removeValueFor(key: string) {
    const sanitizedKey = sanitizeString(key);

    if (!sanitizedKey) {
      throw new Error('The key param is required to remove a value from Secure Store, and must be a non-empty string');
    }

    await SecureStore.deleteItemAsync(key);
  }
}
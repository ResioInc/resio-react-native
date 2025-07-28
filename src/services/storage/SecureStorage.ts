import * as Keychain from 'react-native-keychain';
import { MMKV } from 'react-native-mmkv';

export class SecureStorage {
  private static instance: SecureStorage;
  private storage: MMKV;

  private constructor() {
    this.storage = new MMKV({
      id: 'resio-secure-storage',
      encryptionKey: 'resio-secure-key', // In production, generate a unique key
    });
  }

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  // Token Management
  async saveToken(token: string): Promise<void> {
    try {
      await Keychain.setInternetCredentials(
        'resio-api',
        'access-token',
        token,
        {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          authenticatePrompt: 'Authenticate to access your account',
        }
      );
    } catch (error) {
      console.error('Failed to save token:', error);
      throw new Error('Failed to save token securely');
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials('resio-api');
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  async saveRefreshToken(refreshToken: string): Promise<void> {
    try {
      await Keychain.setInternetCredentials(
        'resio-refresh',
        'refresh-token',
        refreshToken,
        {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        }
      );
    } catch (error) {
      console.error('Failed to save refresh token:', error);
      throw new Error('Failed to save refresh token');
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials('resio-refresh');
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await Keychain.resetInternetCredentials('resio-api');
      await Keychain.resetInternetCredentials('resio-refresh');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  // General Secure Storage
  async setSecureValue(key: string, value: string): Promise<void> {
    try {
      await Keychain.setInternetCredentials(
        `resio-${key}`,
        key,
        value,
        {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        }
      );
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      throw new Error(`Failed to save ${key} securely`);
    }
  }

  async getSecureValue(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(`resio-${key}`);
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error(`Failed to get ${key}:`, error);
      return null;
    }
  }

  async removeSecureValue(key: string): Promise<void> {
    try {
      await Keychain.resetInternetCredentials(`resio-${key}`);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  // MMKV Storage for non-sensitive data
  setItem(key: string, value: any): void {
    this.storage.set(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const value = this.storage.getString(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clearAll(): void {
    this.storage.clearAll();
  }

  // Check if biometric authentication is available
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();
      return biometryType !== null;
    } catch (error) {
      return false;
    }
  }
} 
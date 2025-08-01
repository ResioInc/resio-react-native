import * as Keychain from 'react-native-keychain';
import { MMKV } from 'react-native-mmkv';

// Constants for keychain services
const KEYCHAIN_SERVICES = {
  ACCESS_TOKEN: 'resio-api',
  REFRESH_TOKEN: 'resio-refresh',
} as const;

const MMKV_CONFIG = {
  ID: 'resio-secure-storage',
  // TODO: Generate unique encryption key from device ID or secure random
  ENCRYPTION_KEY: 'resio-secure-key',
} as const;

export class SecureStorage {
  private static instance: SecureStorage;
  private storage: MMKV | null = null;

  private constructor() {
    // MMKV will be initialized lazily to avoid Chrome debugger issues
  }

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  private getMMKVStorage(): MMKV {
    if (!this.storage) {
      try {
        this.storage = new MMKV({
          id: MMKV_CONFIG.ID,
          encryptionKey: MMKV_CONFIG.ENCRYPTION_KEY,
        });
      } catch (error) {
        console.warn('MMKV not available (likely due to Chrome debugger). Using fallback storage.');
        throw new Error('MMKV storage not available in debug mode. Disable Chrome debugger or use Flipper.');
      }
    }
    return this.storage;
  }

  // Token Management
  async saveToken(token: string): Promise<void> {
    if (!token?.trim()) {
      throw new Error('Invalid token provided');
    }

    try {
      // First try with biometric authentication
      try {
        await Keychain.setInternetCredentials(
          KEYCHAIN_SERVICES.ACCESS_TOKEN,
          'access-token',
          token,
          {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            authenticationPrompt: 'Authenticate to access your account',
          }
        );
      } catch (biometricError) {
        // Fallback to saving without biometric protection (for development)
        await Keychain.setInternetCredentials(
          KEYCHAIN_SERVICES.ACCESS_TOKEN,
          'access-token',
          token,
          {
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
          }
        );
      }
    } catch (error) {
      console.error('Failed to save token:', error);
      throw new Error('Failed to save token securely');
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(KEYCHAIN_SERVICES.ACCESS_TOKEN);
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  async saveRefreshToken(refreshToken: string): Promise<void> {
    if (!refreshToken?.trim()) {
      throw new Error('Invalid refresh token provided');
    }

    try {
      await Keychain.setInternetCredentials(
        KEYCHAIN_SERVICES.REFRESH_TOKEN,
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
      const credentials = await Keychain.getInternetCredentials(KEYCHAIN_SERVICES.REFRESH_TOKEN);
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        Keychain.resetInternetCredentials(KEYCHAIN_SERVICES.ACCESS_TOKEN),
        Keychain.resetInternetCredentials(KEYCHAIN_SERVICES.REFRESH_TOKEN),
      ]);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
      // Don't throw here - clearing should always succeed
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
    try {
      const storage = this.getMMKVStorage();
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Cannot set item ${key} - MMKV not available:`, error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const storage = this.getMMKVStorage();
      const value = storage.getString(key);
      if (value) {
        try {
          return JSON.parse(value) as T;
        } catch {
          return null;
        }
      }
      return null;
    } catch (error) {
      console.warn(`Cannot get item ${key} - MMKV not available:`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      const storage = this.getMMKVStorage();
      storage.delete(key);
    } catch (error) {
      console.warn(`Cannot remove item ${key} - MMKV not available:`, error);
    }
  }

  clearAll(): void {
    try {
      const storage = this.getMMKVStorage();
      storage.clearAll();
    } catch (error) {
      console.warn('Cannot clear all - MMKV not available:', error);
    }
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
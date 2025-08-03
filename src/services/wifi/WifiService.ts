import { WifiInfo, WifiConnectionStatus } from '@/types';
import { Platform, Linking } from 'react-native';

// Development-only logging utility
const devLog = (message: string, ...args: any[]) => {
  if (__DEV__) {
    console.log(message, ...args);
  }
};

/**
 * WiFi Service for managing WiFi connections
 * Based on iOS WifiService.swift functionality
 * 
 * Note: React Native has limited WiFi management capabilities compared to iOS.
 * This service provides:
 * - Connection status simulation
 * - Opening device WiFi settings
 * - Support contact methods
 * - Future native module integration point
 */
class WifiService {
  private static instance: WifiService;
  private connectionStatus: WifiConnectionStatus = WifiConnectionStatus.UNKNOWN;
  private listeners: ((status: WifiConnectionStatus) => void)[] = [];
  private connectionTimeoutId: NodeJS.Timeout | null = null;

  static getInstance(): WifiService {
    if (!WifiService.instance) {
      WifiService.instance = new WifiService();
    }
    return WifiService.instance;
  }

  /**
   * Subscribe to connection status changes
   */
  addConnectionStatusListener(listener: (status: WifiConnectionStatus) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners(status: WifiConnectionStatus): void {
    this.connectionStatus = status;
    this.listeners.forEach(listener => listener(status));
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): WifiConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * Update connection status (for manual updates)
   */
  updateConnectionStatus(status: WifiConnectionStatus): void {
    console.log('📶 WifiService updateConnectionStatus:', status);
    this.notifyListeners(status);
  }

  /**
   * Cleanup method to prevent memory leaks
   */
  cleanup(): void {
    // Clear any pending timeouts
    if (this.connectionTimeoutId) {
      clearTimeout(this.connectionTimeoutId);
      this.connectionTimeoutId = null;
    }
    
    // Clear all listeners
    this.listeners = [];
    
    devLog('📶 WifiService cleaned up');
  }

  /**
   * Simulate WiFi connection process
   * Matches iOS behavior: simulator vs device
   */
  async connectToWifi(wifiInfo: WifiInfo): Promise<void> {
    console.log('📶 WifiService connectToWifi - SSID:', wifiInfo.ssid);
    
    try {
      // Set status to connecting immediately
      this.notifyListeners(WifiConnectionStatus.CONNECTING);
      
      // Simulate iOS behavior based on environment
      if (__DEV__) {
        // Development/simulator: immediate toggle (like iOS simulator)
        devLog('📶 WifiService (DEV) - Simulating immediate connection');
        
        // Clear any existing timeout
        if (this.connectionTimeoutId) {
          clearTimeout(this.connectionTimeoutId);
        }
        
        this.connectionTimeoutId = setTimeout(() => {
          this.connectionTimeoutId = null;
          this.notifyListeners(WifiConnectionStatus.CONNECTED);
        }, 500); // Brief delay to show connecting state
      } else {
        // Production: open WiFi settings (like iOS device)
        console.log('📶 WifiService (PROD) - Opening WiFi settings');
        await this.openWifiSettings();
        this.notifyListeners(WifiConnectionStatus.CONNECTED);
      }
      
    } catch (error) {
      console.error('📶 WifiService connectToWifi error:', error);
      this.notifyListeners(WifiConnectionStatus.DISCONNECTED);
      throw error;
    }
  }

  /**
   * Simulate WiFi disconnection
   * Matches iOS behavior: simulator vs device
   */
  async disconnectFromWifi(ssid: string): Promise<void> {
    console.log('📶 WifiService disconnectFromWifi - SSID:', ssid);
    
    try {
      if (__DEV__) {
        // Development/simulator: immediate toggle (like iOS simulator)
        console.log('📶 WifiService (DEV) - Simulating immediate disconnection');
        this.notifyListeners(WifiConnectionStatus.DISCONNECTED);
      } else {
        // Production: open WiFi settings for manual disconnection (like iOS device)
        console.log('📶 WifiService (PROD) - Opening WiFi settings for disconnection');
        await this.openWifiSettings();
        this.notifyListeners(WifiConnectionStatus.DISCONNECTED);
      }
      
    } catch (error) {
      console.error('📶 WifiService disconnectFromWifi error:', error);
      throw error;
    }
  }

  /**
   * Open device WiFi settings
   */
  async openWifiSettings(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        // iOS WiFi settings URL
        await Linking.openURL('App-Prefs:WIFI');
      } else if (Platform.OS === 'android') {
        // Android WiFi settings intent
        await Linking.sendIntent('android.settings.WIFI_SETTINGS');
      }
    } catch (error) {
      console.warn('📶 WifiService openWifiSettings - Could not open WiFi settings:', error);
      // Fallback to general settings
      await Linking.openSettings();
    }
  }

  /**
   * Generate WiFi QR code data
   * Matches iOS QR code format: WIFI:T:WPA;S:SSID;P:PASSWORD;;
   */
  generateQRCodeData(wifiInfo: WifiInfo): string {
    return `WIFI:T:WPA;S:${wifiInfo.ssid};P:${wifiInfo.password};;`;
  }

  /**
   * Open support contact (text/SMS)
   */
  async openSupportText(phoneNumber: string): Promise<void> {
    const url = `sms:${phoneNumber}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      throw new Error('Cannot open SMS app');
    }
  }

  /**
   * Open support contact (email)
   */
  async openSupportEmail(email: string): Promise<void> {
    const url = `mailto:${email}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      throw new Error('Cannot open email app');
    }
  }

  /**
   * Open support website
   */
  async openSupportWebsite(website: string): Promise<void> {
    const url = website.startsWith('http') ? website : `https://${website}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      throw new Error('Cannot open website');
    }
  }
}

export default WifiService.getInstance();
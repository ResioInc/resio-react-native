import Config from 'react-native-config';

// Type definitions for better IDE support
interface AppConfigType {
  readonly API: {
    readonly BASE_URL: string;
    readonly TIMEOUT: number;
    readonly VERSION: string;
  };
  readonly CARDCONNECT: {
    readonly URL: string;
    readonly SDK_URL: string;
  };
  readonly ENVIRONMENT: {
    readonly NAME: string;
    readonly IS_DEV: boolean;
    readonly IS_PRODUCTION: boolean;
  };
  readonly DATADOG: {
    readonly APP_ID?: string;
    readonly CLIENT_TOKEN?: string;
    readonly ENABLED: boolean;
  };
  readonly FEATURE_FLAGS: {
    readonly LAUNCH_DARKLY_KEY?: string;
  };
  readonly URLS: {
    readonly APP: string;
    readonly TERMS: string;
    readonly PRIVACY: string;
    readonly APP_STORE: string;
    readonly FEEDBACK: string;
  };
  readonly CONSTANTS: {
    readonly COUNTRY: string;
    readonly NETWORK_TIMEOUT: number;
  };
}

// Validation helper
const validateConfig = () => {
  const requiredVars = ['API_BASE_URL'];
  const missing = requiredVars.filter(key => !Config[key]);
  
  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Environment detection
const ENVIRONMENT = Config.ENVIRONMENT || (__DEV__ ? 'DEVELOPMENT' : 'PRODUCTION');
const IS_DEV = __DEV__ || ENVIRONMENT === 'DEVELOPMENT' || ENVIRONMENT === 'STAGE';
const IS_PRODUCTION = ENVIRONMENT === 'PRODUCTION';

// Main configuration object
export const AppConfig: AppConfigType = {
  API: {
    BASE_URL: Config.API_BASE_URL || 'https://api.portal.resio.com',
    TIMEOUT: parseInt(Config.API_TIMEOUT || '30000', 10),
    VERSION: 'v1',
  },
  
  CARDCONNECT: {
    URL: Config.CARDCONNECT_URL || 'https://fts-uat.cardconnect.com',
    SDK_URL: Config.CARDCONNECT_SDK_URL || 'fts.cardconnect.com',
  },
  
  ENVIRONMENT: {
    NAME: ENVIRONMENT,
    IS_DEV,
    IS_PRODUCTION,
  },
  
  DATADOG: {
    APP_ID: Config.DATADOG_APP_ID,
    CLIENT_TOKEN: Config.DATADOG_CLIENT_TOKEN,
    ENABLED: !!(Config.DATADOG_APP_ID && Config.DATADOG_CLIENT_TOKEN),
  },
  
  FEATURE_FLAGS: {
    LAUNCH_DARKLY_KEY: Config.LAUNCH_DARKLY_KEY,
  },
  
  URLS: {
    APP: Config.DEFAULT_APP_URL || 'https://app.resio.com',
    TERMS: Config.DEFAULT_TERMS_URL || 'https://storage.googleapis.com/resio-lifestyle-us-static/legal/terms_conditions.htm',
    PRIVACY: Config.DEFAULT_PRIVACY_URL || 'https://storage.googleapis.com/resio-lifestyle-us-static/legal/privacy_policy.htm',
    APP_STORE: 'https://apps.apple.com/us/app/resio-resident-app/id1476268451',
    FEEDBACK: 'https://share.hsforms.com/1eOnpNJ77TT6q4ypor8IT8Qeirgf',
  },
  
  CONSTANTS: {
    COUNTRY: 'US',
    NETWORK_TIMEOUT: 30000,
  },
} as const;

// Environment helpers (simplified)
export const isDevelopment = (): boolean => AppConfig.ENVIRONMENT.IS_DEV;
export const isProduction = (): boolean => AppConfig.ENVIRONMENT.IS_PRODUCTION;

// Validation on import
if (__DEV__) {
  validateConfig();
}

// Export for debugging
if (__DEV__) {
  console.log('📱 App Config Loaded:', {
    environment: AppConfig.ENVIRONMENT.NAME,
    apiUrl: AppConfig.API.BASE_URL,
    datadogEnabled: AppConfig.DATADOG.ENABLED,
  });
} 
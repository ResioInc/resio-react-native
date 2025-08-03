// Re-export configuration
export { AppConfig, isDevelopment, isProduction } from './config';

// Re-export strings for localization
export * from './strings';

// Application constants
export const APP_CONSTANTS = {
  // Navigation
  TAB_BAR_HEIGHT: 50,
  NAVIGATION_TITLE_FONT_SIZE: 15,
  NAVIGATION_LARGE_TITLE_FONT_SIZE: 22,
  
  // UI
  BUTTON_CORNER_RADIUS: 8,
  TEXT_FIELD_HEIGHT: 48,
  INPUT_FONT_SIZE: 16,
  LABEL_FONT_SIZE: 14,
  
  // Timeouts
  DEFAULT_ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  
  // Validation
  MIN_PASSWORD_LENGTH: 8,
  MAX_INPUT_LENGTH: 240,
  
  // Styling
  ENABLED_ALPHA: 1.0,
  DISABLED_ALPHA: 0.5,
} as const;

// Color constants (matching iOS app)
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#E0E0E0',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  BACKGROUND_PRIMARY: '#FFFFFF',
  BACKGROUND_SECONDARY: '#F5F5F5',
} as const;

// Re-export utilities for convenience
export { formatAsPhoneNumber, cleanPhoneNumber, isValidPhoneNumber } from '../utils/utils';

// Re-export invitation status constants
export * from './invitationStatus'; 
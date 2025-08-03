import { Dimensions, StyleSheet } from 'react-native';

// Screen dimensions
export const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Header animation constants
export const MIN_HEADER_HEIGHT = 64;
export const BEGIN_ANIMATION_HEIGHT = 128; // 64 * 2, matching iOS
export const PLACEHOLDER_HEIGHT = 180;
export const CARD_OVERLAY_HEIGHT = 28;

// iOS padding constants (matches iOS .Padding values exactly)
// iOS: sizingFactor = 4.0
export const PADDING = {
  paddingHalf: 2, // sizingFactor / 2 = 2.0
  padding1: 4,    // sizingFactor = 4.0 (exact match)
  padding2: 8,    // sizingFactor * 2 = 8.0
  padding3: 12,   // sizingFactor * 3 = 12.0
  padding4: 16,   // sizingFactor * 4 = 16.0 (exact match)
  padding5: 20,   // sizingFactor * 5 = 20.0
  padding6: 24,   // sizingFactor * 6 = 24.0
  padding7: 28,   // sizingFactor * 7 = 28.0
  padding8: 32,   // sizingFactor * 8 = 32.0
  padding10: 40,  // sizingFactor * 10 = 40.0
} as const;

// Colors (exact iOS values from UIColor+Extension.swift)
export const COLORS = {
  background: '#F2F2F7',
  cardBackground: '#E3E3E3', // iOS .Card.primary (gray100) - matches iOS exactly
  cardBorder: '#C8C8C8', // iOS .Border.card (gray200) - matches iOS exactly
  primary: '#007AFF',
  textPrimary: '#171717', // iOS .Text.primary: resioBlack #171717 (exact match)
  textSubtitle: '#8E8E93',
  textDate: '#5E5E5E', // iOS .Text.date: gray600 #5E5E5E (exact match)
  separator: '#C7C7CC',
  iconBackground: '#E5F2FF',
  moreResourcesBackground: '#F2F2F7',
  red: '#FF3B30',
  shadow: '#000',
  // Bulletin icon colors (matching iOS CircleIcon colors)
  circleIconBackground: '#E5F2FF', // Default icon background
  circleIconPrimaryTint: '#007AFF', // Default icon tint
  circleIconNotificationBackground: '#FF3B30', // Notification background
  circleIconSecondaryTint: '#FFFFFF', // Notification icon tint
} as const;

// Typography
export const TYPOGRAPHY = {
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  cardDescription: {
    fontSize: 13,
    fontWeight: '400' as const,
  },
  bulletinText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
} as const;

// Shadow styles (matches iOS CardView exactly)
export const SHADOW = {
  card: {
    shadowColor: COLORS.shadow, // iOS: color .black
    shadowOffset: { width: 1, height: 2 }, // iOS: x: 1, y: 2
    shadowOpacity: 0.15, // iOS: alpha: 0.15
    shadowRadius: 6, // iOS: blur: 6
    elevation: 4, // Android equivalent
  },
  separator: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cardOverlay: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
} as const;

// Icon sizes
export const ICON_SIZES = {
  small: 20,
  medium: 24,
  large: 40,
  jumbo: 64, // For empty states (matching iOS jumbo size)
} as const;

// Animation values
export const ANIMATION = {
  pullDownRange: 200,
  scaleMax: 1.5,
  scrollEventThrottle: 16,
  logoSize: { width: 88, height: 25 },
} as const;

// Standard card styles (matches iOS CardView exactly)
export const CARD_STYLES = {
  backgroundColor: COLORS.cardBackground,
  borderRadius: 14, // iOS CornerRadius.card = 14.0
  borderWidth: StyleSheet.hairlineWidth, // iOS BorderWidth.borderSmallest (1.0 / UIScreen.main.scale)
  borderColor: COLORS.cardBorder, // iOS .Border.card = gray200 (#C8C8C8)
  ...SHADOW.card,
} as const;
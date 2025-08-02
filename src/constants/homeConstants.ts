import { Dimensions } from 'react-native';

// Screen dimensions
export const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Header animation constants
export const MIN_HEADER_HEIGHT = 64;
export const BEGIN_ANIMATION_HEIGHT = 128; // 64 * 2, matching iOS
export const PLACEHOLDER_HEIGHT = 180;
export const CARD_OVERLAY_HEIGHT = 28;

// iOS padding constants (matches iOS .Padding values)
export const PADDING = {
  paddingHalf: 2,
  padding1: 4,
  padding2: 8,
  padding3: 12,
  padding4: 16,
  padding5: 20,
  padding6: 24,
  padding7: 28,
  padding8: 32,
  padding10: 40,
} as const;

// Colors (should eventually move to a design system)
export const COLORS = {
  background: '#F2F2F7',
  cardBackground: '#E3E3E3', // iOS .Card.primary (gray100) - matches iOS exactly
  cardBorder: '#C8C8C8', // iOS .Border.card (gray200) - matches iOS exactly
  primary: '#007AFF',
  textPrimary: '#000000',
  textSubtitle: '#8E8E93',
  separator: '#C7C7CC',
  iconBackground: '#E5F2FF',
  moreResourcesBackground: '#F2F2F7',
  red: '#FF3B30',
  shadow: '#000',
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
  borderWidth: 0.33, // iOS BorderWidth.borderSmallest (hairline)
  borderColor: COLORS.cardBorder,
  ...SHADOW.card,
} as const;
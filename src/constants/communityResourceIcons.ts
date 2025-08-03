/**
 * Community Resource Icon mapping
 * Based on iOS CommunityResourceIcon enum to maintain consistency
 */

// Icon name mapping from iOS to React Native Ionicons
export const CommunityResourceIconMap: Record<string, string> = {
  // Basic icons
  addressBookIcon: 'people-outline',
  aidIcon: 'medical-outline',
  alarmIcon: 'alarm-outline',
  backpackIcon: 'bag-outline',
  bedIcon: 'bed-outline',
  bicycleIcon: 'bicycle-outline',
  boardIcon: 'easel-outline',
  bookOpenIcon: 'book-outline',
  bookmarkIcon: 'bookmark-outline',
  booksIcon: 'library-outline',
  bottleIcon: 'bottle-outline',
  briefcaseIcon: 'briefcase-outline',
  buildingIcon: 'business-outline',
  cakeIcon: 'cafe-outline',
  calendarIcon: 'calendar-outline',
  carIcon: 'car-outline',
  catIcon: 'paw-outline',
  cigaretteIcon: 'warning-outline',
  clockIcon: 'time-outline',
  coffeeIcon: 'cafe-outline',
  cubeIcon: 'cube-outline',
  devicesIcon: 'phone-portrait-outline',
  dollarIcon: 'cash-outline',
  doorIcon: 'exit-outline',
  fileIcon: 'document-outline',
  fireIcon: 'flame-outline',
  flagIcon: 'flag-outline',
  folderIcon: 'folder-outline',
  gearIcon: 'settings-outline',
  globeIcon: 'globe-outline',
  idCardIcon: 'card-outline',
  keyIcon: 'key-outline',
  maskIcon: 'shield-outline',
  moonIcon: 'moon-outline',
  musicIcon: 'musical-notes-outline',
  printerIcon: 'print-outline',
  sirenIcon: 'warning-outline',
  stackIcon: 'layers-outline',
  swimmingPoolIcon: 'water-outline',
  warningIcon: 'warning-outline',
  widgetsIcon: 'apps-outline',
  windIcon: 'leaf-outline',
  wrenchIcon: 'build-outline',
  
  // Default fallback
  default: 'grid-outline'
};

// Helper function to get icon name with fallback
export const getCommunityResourceIcon = (iconKey?: string): string => {
  if (!iconKey) return CommunityResourceIconMap.default;
  return CommunityResourceIconMap[iconKey] || CommunityResourceIconMap.default;
};

// Available icon keys (for type safety)
export type CommunityResourceIconKey = keyof typeof CommunityResourceIconMap;

// Icon color mapping for consistency with iOS
export const CommunityResourceIconColors = {
  primary: '#007AFF', // iOS .CircleIcon.primaryTint
  secondary: '#FFFFFF', // iOS .CircleIcon.secondaryTint
  background: '#E5F2FF', // iOS .CircleIcon.background
  secondaryBackground: '#E3E3E3', // iOS .CircleIcon.secondaryBackground
} as const;
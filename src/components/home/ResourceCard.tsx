import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommunityResource } from '@/types/home';
import { getCommunityResourceIcon, CommunityResourceIconColors } from '@/constants/communityResourceIcons';
import { 
  COLORS, 
  PADDING, 
  CARD_STYLES, 
  TYPOGRAPHY, 
  ICON_SIZES, 
  SCREEN_WIDTH 
} from '@/constants/homeConstants';

interface ResourceCardProps {
  resource?: CommunityResource;
  isMoreResourcesCard?: boolean;
  isFullWidth?: boolean;
  isInMoreResourcesScreen?: boolean; // New prop to distinguish screen context
  onPress: (resource?: CommunityResource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  isMoreResourcesCard = false,
  isFullWidth = false,
  isInMoreResourcesScreen = false,
  onPress 
}) => {
  // Get icon name - support both new and legacy formats
  const getIconName = (): string => {
    if (isMoreResourcesCard) return 'apps-outline';
    if (resource?.icon) return getCommunityResourceIcon(resource.icon);
    if (resource?.iconName) return getCommunityResourceIcon(resource.iconName);
    return 'grid-outline';
  };

  const iconName = getIconName();
  const iconBackgroundColor = isMoreResourcesCard 
    ? COLORS.moreResourcesBackground 
    : CommunityResourceIconColors.background;
  
  // Support both new (name) and legacy (title) field names
  const title = isMoreResourcesCard 
    ? 'More resources' 
    : resource?.name || resource?.title || '';
  const description = isMoreResourcesCard 
    ? 'See what else is out there' 
    : resource?.description || '';

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isFullWidth && styles.fullWidthCard,
        isInMoreResourcesScreen && styles.moreResourcesScreenCard
      ]} 
      onPress={() => onPress(resource)}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${description}`}
    >
      <View style={[styles.icon, { backgroundColor: iconBackgroundColor }]}>
        <Icon 
          name={iconName} 
          size={ICON_SIZES.medium} 
          color={CommunityResourceIconColors.primary} 
        />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    // iOS calculation: equal width items with proper container padding and gap
    // Available width = SCREEN_WIDTH - container padding (32px)
    // Two items per row with 16px gap = (available width - gap) / 2
    width: (SCREEN_WIDTH - PADDING.padding4 * 2 - PADDING.padding4) / 2,
    ...CARD_STYLES, // iOS CardView styling
    padding: PADDING.padding4,
    // No margin - spacing handled by parent gap
    // Height is content-based by default (iOS home screen behavior)
  },
  fullWidthCard: {
    width: '100%',
    alignItems: 'flex-start',
  },
  moreResourcesScreenCard: {
    // iOS MoreResourcesView: heightDimension = .fractionalWidth(0.4) = 40% of screen width
    height: SCREEN_WIDTH * 0.4,
  },
  icon: {
    width: ICON_SIZES.large,
    height: ICON_SIZES.large,
    borderRadius: ICON_SIZES.large / 2,
    backgroundColor: COLORS.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING.padding2,
  },
  title: {
    ...TYPOGRAPHY.cardTitle,
    color: COLORS.textPrimary,
    marginBottom: PADDING.paddingHalf,
  },
  description: {
    ...TYPOGRAPHY.cardDescription,
    color: COLORS.textSubtitle,
  },
});
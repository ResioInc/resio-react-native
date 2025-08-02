import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommunityResource } from '@/types/home';
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
  onPress: (resource?: CommunityResource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  isMoreResourcesCard = false,
  isFullWidth = false,
  onPress 
}) => {
  const iconName = isMoreResourcesCard ? 'apps-outline' : 'grid-outline';
  const iconBackgroundColor = isMoreResourcesCard 
    ? COLORS.moreResourcesBackground 
    : COLORS.iconBackground;
  
  const title = isMoreResourcesCard ? 'More resources' : resource?.title || '';
  const description = isMoreResourcesCard 
    ? 'See what else is out there' 
    : resource?.description || '';

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isFullWidth && styles.fullWidthCard
      ]} 
      onPress={() => onPress(resource)}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${description}`}
    >
      <View style={[styles.icon, { backgroundColor: iconBackgroundColor }]}>
        <Icon name={iconName} size={ICON_SIZES.medium} color={COLORS.primary} />
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
  },
  fullWidthCard: {
    width: '100%',
    alignItems: 'flex-start',
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
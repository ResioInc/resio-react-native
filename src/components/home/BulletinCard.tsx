import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, PADDING, CARD_STYLES, TYPOGRAPHY, ICON_SIZES } from '@/constants/homeConstants';
import { homeStrings } from '@/constants/strings';

interface BulletinCardProps {
  unreadCount: number;
  onPress: () => void;
}

export const BulletinCard: React.FC<BulletinCardProps> = ({ unreadCount, onPress }) => {
  // Use centralized strings that match iOS exactly
  const getText = () => {
    switch (unreadCount) {
      case 0:
        return homeStrings.actions.bulletins.noNew;
      case 1:
        return homeStrings.actions.bulletins.newSingular;
      default:
        return homeStrings.actions.bulletins.newPlural(unreadCount);
    }
  };

  const getIconStyle = () => {
    if (unreadCount === 0) {
      return {
        backgroundColor: COLORS.circleIconBackground,
        iconColor: COLORS.circleIconPrimaryTint,
      };
    } else {
      return {
        backgroundColor: COLORS.circleIconNotificationBackground,
        iconColor: COLORS.circleIconSecondaryTint,
      };
    }
  };

  const iconStyle = getIconStyle();
  
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      accessibilityRole="button"
      accessibilityLabel={getText()}
    >
      <View style={styles.content}>
        <View style={[styles.icon, { backgroundColor: iconStyle.backgroundColor }]}>
          <Icon 
            name="megaphone-outline" 
            size={ICON_SIZES.small} 
            color={iconStyle.iconColor} 
          />
        </View>
        <Text style={styles.text}>
          {getText()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...CARD_STYLES, // iOS CardView styling
    padding: PADDING.padding4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: ICON_SIZES.large,
    height: ICON_SIZES.large,
    borderRadius: ICON_SIZES.large / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  text: {
    ...TYPOGRAPHY.bulletinText,
    color: COLORS.textPrimary,
  },
});
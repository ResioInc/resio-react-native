import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Bulletin } from '@/types/home';
import { COLORS, PADDING, CARD_STYLES, TYPOGRAPHY, ICON_SIZES } from '@/constants/homeConstants';

interface BulletinCardProps {
  bulletins: Bulletin[];
  onPress: () => void;
}

export const BulletinCard: React.FC<BulletinCardProps> = ({ bulletins, onPress }) => {
  const unreadCount = bulletins.filter(b => !b.isRead).length;
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} accessibilityRole="button">
      <View style={styles.content}>
        <View style={styles.icon}>
          <Icon 
            name="megaphone-outline" 
            size={ICON_SIZES.small} 
            color={COLORS.primary} 
          />
        </View>
        <Text style={styles.text}>
          {unreadCount > 0 
            ? `${unreadCount} new bulletins`
            : 'No new bulletins'}
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
    backgroundColor: COLORS.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  text: {
    ...TYPOGRAPHY.bulletinText,
    color: COLORS.textPrimary,
  },
});
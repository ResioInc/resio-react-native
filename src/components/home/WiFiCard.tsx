import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, PADDING, CARD_STYLES, TYPOGRAPHY, ICON_SIZES } from '@/constants/homeConstants';

interface WiFiCardProps {
  onPress: () => void;
}

export const WiFiCard: React.FC<WiFiCardProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Wi-Fi network settings"
    >
      <View style={styles.content}>
        <View style={styles.cbxLogo}>
          <Text style={styles.cbxLogoText}>CBX</Text>
        </View>
        <Text style={styles.title}>Wi-Fi network</Text>
        <Text style={styles.description}>
          View your network and password
        </Text>
      </View>
      {/* Chevron positioned at top-right of content like iOS */}
      <Icon 
        name="chevron-forward" 
        size={ICON_SIZES.medium} 
        color={COLORS.separator}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...CARD_STYLES, // iOS CardView styling
    padding: PADDING.padding4,
    marginBottom: PADDING.padding4,
    position: 'relative', // For absolute positioning of chevron
  },
  content: {
    // iOS: content has .Padding.padding4 from cellContainer edges
    // This is already handled by card padding
  },
  chevron: {
    position: 'absolute',
    top: PADDING.padding4, // iOS: content.topAnchor (at top of content area)
    right: PADDING.padding4, // iOS: content.trailingAnchor (at right of content area)
  },
  cbxLogo: {
    width: 70,
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING.padding4,
  },
  cbxLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
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
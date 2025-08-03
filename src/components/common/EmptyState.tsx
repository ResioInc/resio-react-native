import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, PADDING, ICON_SIZES } from '@/constants/homeConstants';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  iconName 
}) => {
  return (
    <View style={styles.container}>
      {/* Main vertical stack - matches iOS stackView */}
      <View style={styles.stackView}>
        {/* Icon - matches iOS imageView */}
        <View style={styles.iconContainer}>
          <Icon 
            name={iconName} 
            size={ICON_SIZES.jumbo} // iOS: .Icon.jumbo (64)
            color={COLORS.textSubtitle} // iOS: .Icon.gray
            style={styles.icon}
          />
        </View>
        
        {/* Title - matches iOS titleLabel */}
        <Text style={styles.titleLabel}>{title}</Text>
        
        {/* Description - matches iOS descriptionLabel */}
        <Text style={styles.descriptionLabel}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // iOS: .Background.primary
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackView: {
    alignItems: 'center', // iOS: alignment = .center
    paddingHorizontal: PADDING.padding12, // iOS: .Padding.padding12 (48px)
  },
  iconContainer: {
    marginBottom: PADDING.padding4, // iOS: setCustomSpacing(.Padding.padding4, after: imageView)
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    // iOS: contentMode = .scaleAspectFit and pinAspectRatioTo(1.0)
  },
  titleLabel: {
    fontSize: 14, // iOS: .avenir900(withSize: 14)
    fontWeight: '900', // iOS: avenir900 (black weight)
    color: COLORS.textPrimary, // iOS: .Text.primary
    textAlign: 'center', // iOS: textAlignment = .center
    marginBottom: PADDING.padding1, // Spacing before description
  },
  descriptionLabel: {
    fontSize: 13, // iOS: .avenir400(withSize: 13)
    fontWeight: '400', // iOS: avenir400 (regular weight)
    color: COLORS.textSubtitle, // iOS: .Text.profileSubtitle
    textAlign: 'center', // iOS: textAlignment = .center
    lineHeight: 18, // Appropriate line height for readability
    // iOS: numberOfLines = 0 (unlimited lines)
  },
});
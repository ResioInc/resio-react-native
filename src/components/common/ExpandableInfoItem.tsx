import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, PADDING, CARD_STYLES } from '@/constants/homeConstants';

interface ExpandableInfoItemProps {
  title: string;
  detail: string;
  isExpanded: boolean;
  onPress: () => void;
}

export const ExpandableInfoItem: React.FC<ExpandableInfoItemProps> = ({ 
  title, 
  detail, 
  isExpanded, 
  onPress 
}) => {
  const handlePress = () => {
    // iOS-style animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${isExpanded ? 'Expanded' : 'Collapsed'}`}
        accessibilityHint="Double tap to expand or collapse"
        activeOpacity={1} // iOS: selectionStyle = .none (no highlighting)
      >
        <View style={styles.header}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          
          {/* Chevron icon */}
          <Icon 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={COLORS.textSubtitle} 
            style={styles.chevron}
          />
        </View>
        
        {/* Expandable detail content */}
        {isExpanded && (
          <View style={styles.detailContainer}>
            <Text style={styles.detail}>{detail}</Text>
          </View>
        )}
      </TouchableOpacity>
      
      {/* Bottom divider - matches iOS divider */}
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0, // Let parent handle spacing
  },
  divider: {
    height: 1, // iOS: .BorderWidth.borderSmallest
    backgroundColor: COLORS.separator, // iOS: .separator
    marginHorizontal: PADDING.padding4, // iOS: leading/trailing .Padding.padding4
    marginTop: PADDING.padding1, // iOS: topAnchor from container.bottomAnchor + padding4
    // No marginBottom - iOS handles this with contentView constraints
  },
  card: {
    backgroundColor: COLORS.background, // iOS: .Background.primary (same as main background)
    padding: PADDING.padding4,
    // No border or shadow - iOS ExpandableInfoTableViewCell has clean background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 15, // iOS: .primaryTextField(withSize: 14) - adjusted for RN
    fontWeight: '600',
    color: COLORS.textPrimary, // iOS: .Text.primary
    marginRight: PADDING.padding2,
  },
  chevron: {
    // Icon styling
  },
  detailContainer: {
    marginTop: PADDING.padding1, // iOS: .Padding.padding1
    paddingTop: PADDING.padding1,
    // No border on detail - iOS doesn't have border between title and detail
  },
  detail: {
    fontSize: 14, // iOS: .primaryTextField(withSize: 13) - adjusted for RN
    fontWeight: '400',
    color: COLORS.textPrimary, // iOS: .Text.subtitle
    lineHeight: 20,
  },
});
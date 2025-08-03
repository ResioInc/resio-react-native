import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
// Note: LinearGradient would need to be installed if not available
// For now, using a simple overlay View instead
import Icon from 'react-native-vector-icons/Ionicons';
import { CommunityResourceIconColors } from '@/constants/communityResourceIcons';
import {
  COLORS,
  PADDING,
  CARD_STYLES,
  TYPOGRAPHY,
  ICON_SIZES,
  SCREEN_WIDTH,
} from '@/constants/homeConstants';

interface PropertyInfoCardProps {
  title: string;
  iconName: string;
  backgroundImage: any; // require() image
  onPress: () => void;
}

export const PropertyInfoCard: React.FC<PropertyInfoCardProps> = ({
  title,
  iconName,
  backgroundImage,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        {/* Gradient Overlay (matching iOS GradientShield) */}
        <View style={styles.gradient} />
        
        {/* Content */}
        <View style={styles.content}>
          {/* Circle Icon */}
          <View style={[styles.icon, { backgroundColor: CommunityResourceIconColors.secondaryBackground }]}>
            <Icon 
              name={iconName} 
              size={ICON_SIZES.medium} 
              color={CommunityResourceIconColors.secondary} // White icon like iOS
            />
          </View>
          
          {/* Title */}
          <Text style={styles.title}>{title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // iOS MoreResourcesView: heightDimension = .fractionalWidth(0.4) = 40% of screen width
    // Same calculation as ResourceCard for perfect alignment
    height: SCREEN_WIDTH * 0.4,
    overflow: 'hidden',
    ...CARD_STYLES,
    backgroundColor: 'transparent', // Background image handles this
    borderWidth: 0, // Remove border for image cards
    borderRadius: 14, // iOS CornerRadius.card - override CARD_STYLES
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    borderRadius: 14, // iOS CornerRadius.card
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', // Simple dark overlay instead of gradient
    borderRadius: 14, // iOS CornerRadius.card
  },
  content: {
    padding: PADDING.padding4,
    alignItems: 'flex-start',
  },
  icon: {
    width: ICON_SIZES.large,
    height: ICON_SIZES.large,
    borderRadius: ICON_SIZES.large / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING.padding3, // iOS spacing
  },
  title: {
    color: '#FFFFFF', // iOS .Text.overDarkImage
    fontSize: 14, // iOS font size
    fontWeight: '700', // iOS .tertiary font weight
    textAlign: 'left',
  },
});
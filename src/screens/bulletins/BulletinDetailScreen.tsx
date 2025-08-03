import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { ImageCarousel } from '@/components/bulletins/ImageCarousel';
import { Bulletin } from '@/types';
import { COLORS, PADDING } from '@/constants/homeConstants';
import { formatRelativeDate } from '@/utils/utils';


import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/RootNavigator';

type BulletinDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BulletinDetail'>;
type BulletinDetailScreenRouteProp = RouteProp<RootStackParamList, 'BulletinDetail'>;

interface BulletinDetailScreenProps {
  route: BulletinDetailScreenRouteProp;
  navigation: BulletinDetailScreenNavigationProp;
}

export const BulletinDetailScreen: React.FC<BulletinDetailScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const insets = useSafeAreaInsets();
  const { bulletin } = route.params;
  
  const [scrollY] = useState(new Animated.Value(0));
  const hasImages = bulletin.files && bulletin.files.length > 0;
  
  // Use the actual API field 'description' (iOS maps this to responseDescription)
  const descriptionText = bulletin.description || bulletin.responseDescription || '';

   const cleanDescription = (text?: string): string => {
    if (!text) return '';
    
    // Remove returns and normalize whitespace (matching iOS .replaceReturns())
    return text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const handleClose = () => {
    navigation.goBack();
  };

  // Simple scroll handler (can be used for future scroll-based animations)
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Scrollable Content */}
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            !hasImages && styles.scrollContentWithPadding
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Image Carousel */}
          {hasImages && (
            <ImageCarousel files={bulletin.files!} />
          )}
          
          {/* Content Stack */}
          <View style={styles.contentStack}>
            <Text style={styles.dateLabel}>
              {formatRelativeDate(bulletin.updatedAt)}
            </Text>
            
            <Text style={styles.titleLabel}>
              {bulletin.title}
            </Text>
            
            <Text style={styles.descriptionLabel}>
              {cleanDescription(descriptionText)}
            </Text>
          </View>
        </Animated.ScrollView>



        {/* Close Button (iOS CloseButton) - positioned at top right */}
        <TouchableOpacity
          style={[
            styles.closeButton,
            {
              top: PADDING.padding4, // iOS: Position at top with padding
              right: PADDING.padding4, // iOS: Position at right with padding
            }
          ]}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Icon 
            name="close" 
            size={14} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: PADDING.padding6,
  },
  scrollContentWithPadding: {
    paddingTop: PADDING.padding10, // iOS: top inset when no images
  },
  contentStack: {
    padding: PADDING.padding4,
    gap: PADDING.padding2, // iOS spacing: .Padding.padding2
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textSubtitle, // iOS .Text.date
    lineHeight: 16,
  },
  titleLabel: {
    fontSize: 20,
    fontWeight: '600', // iOS .Notifications.title (larger for detail)
    color: COLORS.textPrimary,
    lineHeight: 26,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '400', // iOS .Notifications.description (larger for detail)
    color: COLORS.textPrimary,
    lineHeight: 22,
  },

  // iOS CloseButton - positioned at top right of modal
  closeButton: {
    position: 'absolute',
    width: 24, // iOS: .CloseButton.diameter = 24.0
    height: 24, // iOS: .CloseButton.diameter = 24.0  
    borderRadius: 12, // iOS: .CloseButton.radius = 12.0
    backgroundColor: 'rgba(0, 0, 0, 0.55)', // iOS: .Button.closeBackground = blackOverlay55
    justifyContent: 'center',
    alignItems: 'center',
    // iOS shadow for close button
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
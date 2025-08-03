import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import { Bulletin } from '@/types';
import { COLORS, PADDING, CARD_STYLES, TYPOGRAPHY } from '@/constants/homeConstants';
import { formatRelativeDate } from '@/utils/utils';

// Inline sanitizeFileURL function (temporary fix for import issue)
const sanitizeFileURL = (url?: string): string | null => {
  if (!url) return null;
  if (!url.match(/^https?:\/\//i)) return null;
  if (url.match(/^(javascript|data):/i)) return null;
  return url.trim();
};

interface BulletinListItemProps {
  bulletin: Bulletin;
  onPress: (bulletin: Bulletin) => void;
}

export const BulletinListItem: React.FC<BulletinListItemProps> = ({ bulletin, onPress }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // iOS-style cell selection animation
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  const MAX_RETRY_ATTEMPTS = 2;
  const LOADING_TIMEOUT = 15000; // 15 seconds timeout
  
  // Filter to only image files (matching iOS and ImageCarousel logic)
  const imageFiles = useMemo(() => {
    return bulletin.files?.filter(file => {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'heic'];
      const fileExtension = file.label.split('.').pop()?.toLowerCase();
      const sanitizedUrl = sanitizeFileURL(file.fileUrl);
      return fileExtension && imageExtensions.includes(fileExtension) && sanitizedUrl;
    }) || [];
  }, [bulletin.files]);
  
  const hasImage = imageFiles.length > 0;
  const isHighlighted = bulletin.highlight || false;
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);
  
  // Reset states when bulletin changes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
    setRetryCount(0);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  }, [bulletin.id, imageFiles[0]?.fileUrl]);
  
  // Handle image loading timeout
  const startLoadingTimeout = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = setTimeout(() => {
      // Image loading timeout - retry if attempts remain
      if (__DEV__) {
        console.warn('Image loading timeout, retry attempt:', retryCount + 1);
      }
      
      if (retryCount < MAX_RETRY_ATTEMPTS) {
        // Retry loading
        setRetryCount(prev => prev + 1);
        setImageLoading(true);
        setImageError(false);
      } else {
        // Give up after max retries
        setImageLoading(false);
        setImageError(true);
      }
    }, LOADING_TIMEOUT);
  };
  
  // Handle successful retry
  const handleRetry = () => {
    setRetryCount(0);
    setImageLoading(true);
    setImageError(false);
  };

  // iOS-style selection animation handlers
  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95, // iOS .Animation.selectionScale
      duration: 150, // Fast animation
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };
  
  // Use the actual API field 'description' (iOS maps this to responseDescription)
  const descriptionText = bulletin.description || bulletin.responseDescription || '';
  
  // Remove verbose logging for production



  // Get card style with highlight border if needed
  const cardStyle = [
    styles.card,
    ...(isHighlighted ? [styles.highlightedCard] : [])
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={cardStyle}
        onPress={() => onPress(bulletin)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`Bulletin: ${bulletin.title}`}
        activeOpacity={1} // Disable TouchableOpacity's default opacity change
      >
      {/* Header Image - Optional */}
      {hasImage && (
        <View style={styles.imageContainer}>
          <Image
            key={`bulletin-${bulletin.id}-image-${retryCount}`} // Force reload on retry
            source={{ uri: imageFiles[0].fileUrl }}
            style={styles.headerImage}
            resizeMode="cover"
            onLoadStart={() => {
              setImageLoading(true);
              setImageError(false);
              startLoadingTimeout(); // Start timeout when loading begins
              // Image loading started
            }}
            onError={(error) => {
              if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
              }
              setImageLoading(false);
              setImageError(true);
              // Log error for debugging in development only
              if (__DEV__) {
                console.error('Image failed to load:', error.nativeEvent.error);
              }
            }}
            onLoad={() => {
              if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
              }
              setImageLoading(false);
              setImageError(false);
              // Image loaded successfully
            }}
            onLoadEnd={() => {
              // This fires regardless of success/failure - fallback safety
              if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
              }
              // Only update loading state if we haven't already handled success/error
              if (imageLoading && !imageError) {
                setImageLoading(false);
              }
            }}
          />
          
          {/* Loading Indicator */}
          {imageLoading && (
            <View style={styles.imageLoadingOverlay}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              {retryCount > 0 && (
                <Text style={styles.retryText}>Attempt {retryCount + 1}</Text>
              )}
            </View>
          )}
          
          {/* Error State */}
          {imageError && (
            <View style={styles.imageErrorOverlay}>
              <Text style={styles.imageErrorText}>Failed to load image</Text>
              {retryCount < MAX_RETRY_ATTEMPTS && (
                <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
                  <Text style={styles.retryButtonText}>Tap to retry</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
      
      {/* Content Stack */}
      <View style={styles.contentStack}>
                  {/* Date */}
          <Text style={styles.dateLabel}>
            {formatRelativeDate(bulletin.updatedAt)}
          </Text>
        
        {/* Title */}
        <Text style={styles.titleLabel} numberOfLines={2}>
          {bulletin.title}
        </Text>
        
        {/* Description - iOS: 3 lines, .Notifications.description font */}
        {descriptionText && (
          <Text style={styles.descriptionLabel} numberOfLines={3}>
            {descriptionText}
          </Text>
        )}
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...CARD_STYLES, // iOS CardView styling
    marginHorizontal: PADDING.padding4,
    marginBottom: PADDING.padding4,
    overflow: 'hidden',
  },
  highlightedCard: {
    // iOS gradient border effect - simplified for React Native
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 5/3, // iOS: heightAnchor.constraint(equalTo: cardView.widthAnchor, multiplier: 0.6) = 60% height
  },
  headerImage: {
    width: '100%',
    height: '100%', // Fill the container with correct aspect ratio
    borderTopLeftRadius: 14, // iOS: .CornerRadius.card = 14.0
    borderTopRightRadius: 14,
    backgroundColor: '#F0F0F0', // Placeholder background while loading
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  imageErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(240, 240, 240, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  imageErrorText: {
    fontSize: 12,
    color: COLORS.textSubtitle,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 10,
    color: COLORS.textSubtitle,
    textAlign: 'center',
    marginTop: 4,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  retryButtonText: {
    fontSize: 11,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  contentStack: {
    padding: 16, // iOS: .Padding.padding4 = sizingFactor * 4 = 16px (exact match)
    gap: 4, // iOS mainStackView.spacing = .Padding.padding1 = sizingFactor = 4px (exact match)
  },
  dateLabel: {
    fontSize: 13, // iOS .Notifications.tertiary: EuclidCircularB-Light, 13.0
    fontWeight: '300', // iOS Light weight
    color: COLORS.textDate, // iOS .Text.date: gray600 #5E5E5E (exact match)
    lineHeight: 16,
  },
  titleLabel: {
    fontSize: 20, // iOS .Notifications.title: EuclidCircularB-SemiBold, 20.0
    fontWeight: '600', // iOS SemiBold weight
    color: COLORS.textPrimary, // iOS .Text.primary: resioBlack #171717 (exact match)
    lineHeight: 24,
  },
  descriptionLabel: {
    fontSize: 15, // iOS .Notifications.description: EuclidCircularB-Regular, 15.0
    fontWeight: '400', // iOS Regular weight
    color: COLORS.textPrimary, // iOS .Text.primary: resioBlack #171717 (exact match)
    lineHeight: 19, // Proper line height for 15pt font
    // backgroundColor: 'rgba(255, 0, 0, 0.1)', // DEBUG: Uncomment to see description area (for debugging layout)
  },
});
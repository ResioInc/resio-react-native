import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Event } from '@/types/home';
import { COLORS, PADDING, SCREEN_WIDTH, CARD_STYLES } from '@/constants/homeConstants';

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const formatDay = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getRSVPTitle = (): string => {
    return event.rsvp ? 'Going' : 'Not Going';
  };

  // iOS calculates card size within the collection view width context
  // This will be handled by the parent ScrollView's contentContainerStyle

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(event)}
      accessibilityRole="button"
      accessibilityLabel={`Event: ${event.title} on ${event.startTime.toDateString()}`}
    >
      <ImageBackground 
        source={event.imageUrl ? { uri: event.imageUrl } : undefined}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        {/* Dark Overlay - Matches iOS GradientShield */}
        <View style={styles.overlay} />
        
        {/* Content Stack - Matches iOS stackView */}
        <View style={styles.contentStack}>
          {/* Pre-title (RSVP Status) */}
          <Text style={styles.pretitle}>{getRSVPTitle()}</Text>
          
          {/* Title Stack with Checkmark */}
          <View style={styles.titleStack}>
            {event.rsvp && (
              <Icon 
                name="checkmark-circle" 
                size={PADDING.padding6} 
                color="#FFFFFF" 
                style={styles.checkmark}
              />
            )}
            <Text style={styles.title} numberOfLines={2}>
              {formatDay(event.startTime)}
            </Text>
          </View>
          
          {/* Subtitle (Event Name) */}
          <Text style={styles.subtitle} numberOfLines={2}>
            {event.title}
          </Text>
          
          {/* Detail (Time) */}
          <Text style={styles.detail}>
            {formatTime(event.startTime)}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    // iOS calculation: (frame.size.width - .Padding.padding4) / 2 gives TOTAL slot size
    // This includes the card content + its margins
    // Card content = slot size - margins (8px left + 8px right = 16px total)
    width: (SCREEN_WIDTH - PADDING.padding4) / 2 - PADDING.padding4,
    height: (SCREEN_WIDTH - PADDING.padding4) / 2 - PADDING.padding4,
    // iOS: containerView has .Padding.padding2 margin on all sides
    margin: PADDING.padding2, // 8px margin creates spacing between cards
    overflow: 'hidden',
    ...CARD_STYLES, // iOS CardView styling (background, border, shadow, borderRadius)
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundImageStyle: {
    borderRadius: 14, // iOS CornerRadius.card
  },
  overlay: {
    position: 'absolute',
    top: PADDING.padding5, // Matches iOS gradient positioning
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)', // Dark overlay to ensure text readability
  },
  contentStack: {
    padding: PADDING.padding4,
    gap: PADDING.padding2, // iOS .spacing = .Padding.padding2
  },
  pretitle: {
    fontSize: 13,
    color: '#FFFFFF', // iOS .Text.overDarkImage
    fontWeight: '400',
  },
  titleStack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Matches iOS spacing
  },
  checkmark: {
    width: PADDING.padding6,
    height: PADDING.padding6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600', // Matches iOS .secondary font
    color: '#FFFFFF',
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  detail: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
  },
});
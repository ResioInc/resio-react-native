import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Event } from '@/types/home';
import { useAppDispatch } from '@/store';
import { setEventRSVP } from '@/store/slices/homeSlice';
import { COLORS, PADDING, SCREEN_WIDTH } from '@/constants/homeConstants';
import { eventStrings } from '@/constants/strings';
import { formatRelativeDate, formatTime } from '@/utils/utils';

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  // Guard against undefined event FIRST - before any other code
  if (!event) {
    console.error('EventCard received undefined event');
    return null;
  }

  const dispatch = useAppDispatch();

  // iOS rsvpTitle() equivalent
  const getRSVPTitle = (): string | null => {
    const total = event?.rsvpLimit ?? 0;
    const taken = event?.nRsvps ?? 0;
    const remaining = total - taken;
    const isAttending = event?.rsvp;

    if (total <= 0) return null;

    if (isAttending) {
      return eventStrings?.rsvp?.success;
    } else if (remaining > 0) {
      return remaining === 1 ? eventStrings?.subtitle?.spotsLeftSingular : eventStrings?.subtitle?.spotsLeft?.(remaining);
    } else {
      return eventStrings?.subtitle?.full;
    }
  };

  const handleRSVPToggle = async () => {
    if (!event?.id) return;
    
    try {
      await dispatch(setEventRSVP({ 
        eventId: event.id, 
        rsvp: !event.rsvp 
      })).unwrap();
    } catch (error) {
      console.error('Failed to update RSVP:', error);
    }
  };

  // iOS imageURL equivalent - first photo
  const imageUrl = event?.photos && event.photos.length > 0 ? event.photos[0]?.photoUrl : undefined;

  const rsvpTitle = getRSVPTitle();
  const formattedDay = formatRelativeDate(event?.startTime);
  const formattedTime = formatTime(event?.startTime);

  return (
    <TouchableOpacity 
      style={styles.containerView} 
      onPress={() => onPress(event)}
      accessibilityRole="button"
      accessibilityLabel={`Event: ${event?.name || 'Event'} on ${formattedDay}`}
    >
      {/* Background Image */}
      <ImageBackground 
        source={imageUrl ? { uri: imageUrl } : undefined}
        style={styles.backgroundImageView}
        imageStyle={styles.backgroundImageStyle}
        // No defaultSource since we handle missing images with background color
      >
        {/* iOS GradientShield - alpha 0.9, clear to black gradient */}
        <View style={styles.gradientShield} />
        
        {/* iOS stackView - vertical with .Padding.padding2 spacing */}
        <View style={styles.stackView}>
          {/* Pre-title (RSVP Status) - iOS: .primary(withSize: 13.0), .Text.overDarkImage */}
          {rsvpTitle && (
            <TouchableOpacity onPress={handleRSVPToggle} activeOpacity={0.7}>
              <Text style={styles.pretitleLabel}>{rsvpTitle}</Text>
            </TouchableOpacity>
          )}
          
          {/* Title Stack - iOS: spacing 10, alignment .center */}
          <View style={styles.titleStackView}>
            {/* Checkmark - iOS: 24pt icon, .Text.overDarkImage */}
            {event?.rsvp && (
              <Icon 
                name="checkmark-circle" 
                size={24} 
                color="#FFFFFF" 
                style={styles.checkmarkImageView}
              />
            )}
            {/* Title - iOS: .secondary(withSize: 18.0), .Text.overDarkImage, numberOfLines = 2 */}
            <Text style={styles.titleLabel} numberOfLines={2}>
              {formattedDay}
            </Text>
          </View>
          
          {/* Subtitle (Event Name) - iOS: .primary(withSize: 13.0), .Text.overDarkImage, numberOfLines = 2 */}
          {event?.name && (
            <Text style={styles.subtitleLabel} numberOfLines={2}>
              {event.name}
            </Text>
          )}
          
          {/* Detail (Time) - iOS: .primary(withSize: 12.0), .Text.overDarkImage */}
          {formattedTime && (
            <Text style={styles.detailLabel}>
              {formattedTime}
            </Text>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // iOS: containerView with .Background.primary, masksToBounds, cornerRadius
  containerView: {
    backgroundColor: COLORS.background, // iOS: .Background.primary
    borderRadius: 14, // iOS: CardView.cornerRadius
    overflow: 'hidden', // iOS: layer.masksToBounds = true
    // iOS calculation: (frame.size.width - .Padding.padding4) / 2
        // React Native: Account for scroll content padding (8pt left/right) + card margins (8pt each side)
    // Available width = SCREEN_WIDTH - scroll padding (16pt) - total card margins (32pt for 2 cards)
    width: (SCREEN_WIDTH - PADDING.padding2 * 2 - PADDING.padding2 * 4) / 2,
    aspectRatio: 1, // iOS: square (width: edge, height: edge)
    // iOS: .Padding.padding2 margin from containerView.layoutHelpers.pinEdgesToView(contentView, constant: .Padding.padding2)
    marginHorizontal: PADDING.padding2,
  },
  
  // iOS: backgroundImageView with .scaleAspectFill, clipsToBounds
  backgroundImageView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    // ImageBackground resizeMode is set to 'cover' by default (= scaleAspectFill)
  },
  
  // iOS: GradientShield with alpha 0.9, clear to black gradient
  gradientShield: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Linear gradient approximation: clear at top, black at bottom with alpha 0.9
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  
  // iOS: stackView with .vertical axis, .Padding.padding2 spacing
  stackView: {
    position: 'absolute',
    left: PADDING.padding4, // iOS: leadingAnchor constant: .Padding.padding4
    right: PADDING.padding4, // iOS: trailingAnchor constant: -.Padding.padding4  
    bottom: PADDING.padding4, // iOS: bottomAnchor constant: -.Padding.padding4
    gap: PADDING.padding2, // iOS: stack.spacing = .Padding.padding2 (8pt)
  },
  
  // iOS: pretitleLabel with .primary(withSize: 13.0), .Text.overDarkImage
  pretitleLabel: {
    fontSize: 13,
    fontWeight: '400', // iOS primary font weight
    color: '#FFFFFF', // iOS: .Text.overDarkImage
    lineHeight: 16,
  },
  
  // iOS: titleStackView with spacing 10, alignment .center
  titleStackView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // iOS: stack.spacing = 10
  },
  
  // iOS: checkmarkImageView 24pt width/height
  checkmarkImageView: {
    width: 24, // iOS: .Padding.padding6 = 24pt
    height: 24,
  },
  
  // iOS: titleLabel with .secondary(withSize: 18.0), .Text.overDarkImage, numberOfLines = 2
  titleLabel: {
    fontSize: 18,
    fontWeight: '600', // iOS secondary font (semi-bold)
    color: '#FFFFFF', // iOS: .Text.overDarkImage
    lineHeight: 22,
    flex: 1,
  },
  
  // iOS: subtitleLabel with .primary(withSize: 13.0), .Text.overDarkImage, numberOfLines = 2
  subtitleLabel: {
    fontSize: 13,
    fontWeight: '400', // iOS primary font weight
    color: '#FFFFFF', // iOS: .Text.overDarkImage
    lineHeight: 16,
  },
  
  // iOS: detailLabel with .primary(withSize: 12.0), .Text.overDarkImage
  detailLabel: {
    fontSize: 12,
    fontWeight: '400', // iOS primary font weight
    color: '#FFFFFF', // iOS: .Text.overDarkImage
    lineHeight: 15,
  },
});
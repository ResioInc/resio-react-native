import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Event } from '@/types';
import { COLORS, PADDING } from '@/constants/homeConstants';
import { useAppDispatch } from '@/store';
import { setEventRSVP } from '@/store/slices/homeSlice';

type EventDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EventDetail'>;
type EventDetailScreenRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

interface EventDetailScreenProps {
  route: EventDetailScreenRouteProp;
  navigation: EventDetailScreenNavigationProp;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { event } = route.params;

  // Guard against undefined event
  if (!event) {
    console.error('EventDetailScreen received undefined event');
    return (
      <View style={styles.container}>
        <Text>Event not found</Text>
      </View>
    );
  }

  // Log the complete event object
  console.log('🎪 EventDetailScreen - Full event object:', event);
  console.log('🎪 EventDetailScreen - Event keys:', Object.keys(event));
  console.log('🎪 EventDetailScreen - Event values:', Object.values(event));

  const formatDateTime = (dateString?: string): string => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleClose = () => {
    navigation.goBack();
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

  const imageUrl = event?.photos && event.photos.length > 0 ? event.photos[0]?.photoUrl : undefined;
  const description = event?.description || event?.responseDescription || '';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.headerImage}
            resizeMode="cover"
          />
        )}
        
        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Event Title */}
          <Text style={styles.title}>
            {event?.name || 'Event'}
          </Text>
          
          {/* Date & Time */}
          <View style={styles.infoRow}>
            <Icon name="time-outline" size={20} color={COLORS.textSubtitle} />
            <Text style={styles.infoText}>
              {formatDateTime(event?.startTime)}
            </Text>
          </View>
          
          {/* Location */}
          {event?.location && (
            <View style={styles.infoRow}>
              <Icon name="location-outline" size={20} color={COLORS.textSubtitle} />
              <Text style={styles.infoText}>{event.location}</Text>
            </View>
          )}
          
          {/* Address */}
          {event?.address && (
            <View style={styles.infoRow}>
              <Icon name="map-outline" size={20} color={COLORS.textSubtitle} />
              <Text style={styles.infoText}>{event.address}</Text>
            </View>
          )}
          
          {/* RSVP Section */}
          <View style={styles.rsvpSection}>
            <Text style={styles.rsvpTitle}>Will you attend?</Text>
            <TouchableOpacity 
              style={[
                styles.rsvpButton,
                event?.rsvp && styles.rsvpButtonActive
              ]}
              onPress={handleRSVPToggle}
            >
              <Icon 
                name={event?.rsvp ? "checkmark-circle" : "checkmark-circle-outline"} 
                size={24} 
                color={event?.rsvp ? "#FFFFFF" : COLORS.primary} 
              />
              <Text style={[
                styles.rsvpButtonText,
                event?.rsvp && styles.rsvpButtonTextActive
              ]}>
                {event?.rsvp ? 'Going' : 'RSVP'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Description */}
          {description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
          )}
          
          {/* RSVP Count */}
          {event.nRsvps !== undefined && (
            <View style={styles.rsvpCountSection}>
              <Text style={styles.rsvpCountText}>
                {event.nRsvps} {event.nRsvps === 1 ? 'person is' : 'people are'} going
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Close Button (iOS CloseButton) - positioned at top right of modal */}
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
  headerImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: PADDING.padding4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: PADDING.padding4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: PADDING.padding3,
    gap: PADDING.padding2,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  rsvpSection: {
    marginTop: PADDING.padding6,
    marginBottom: PADDING.padding4,
  },
  rsvpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: PADDING.padding3,
  },
  rsvpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: PADDING.padding3,
    paddingHorizontal: PADDING.padding4,
    gap: PADDING.padding2,
  },
  rsvpButtonActive: {
    backgroundColor: COLORS.primary,
  },
  rsvpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  rsvpButtonTextActive: {
    color: '#FFFFFF',
  },
  descriptionSection: {
    marginTop: PADDING.padding4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: PADDING.padding3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textPrimary,
  },
  rsvpCountSection: {
    marginTop: PADDING.padding4,
    padding: PADDING.padding3,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
  },
  rsvpCountText: {
    fontSize: 14,
    color: COLORS.textSubtitle,
    textAlign: 'center',
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
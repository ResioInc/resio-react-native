import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchHomeData } from '@/store/slices/homeSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const MIN_HEADER_HEIGHT = 64;
const BEGIN_ANIMATION_HEIGHT = 128; // 64 * 2, matching iOS
const PLACEHOLDER_HEIGHT = 180;
const CARD_OVERLAY_HEIGHT = 28;

export const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector((state) => state.auth);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Mock data to match iOS structure
  const mockBulletins = [
    { id: 1, isRead: false, title: 'Welcome to the building!' },
    { id: 2, isRead: false, title: 'New amenity hours' },
  ];

  const mockEvents = [
    {
      id: 1,
      title: 'Coffee Hour',
      startTime: new Date('2024-12-20T10:00:00'),
      location: 'Community Room',
    },
    {
      id: 2,
      title: 'Fitness Class',
      startTime: new Date('2024-12-21T18:00:00'),
      location: 'Gym',
    },
  ];

  const mockResources = [
    { id: 1, title: 'Package Room', description: 'Pick up deliveries' },
    { id: 2, title: 'Gym Access', description: '24/7 fitness center' },
    { id: 3, title: 'Bike Storage', description: 'Secure parking' },
    { id: 4, title: 'Study Rooms', description: 'Book quiet spaces' },
  ];

  const mockConnections = [
    { id: 1, user: { photoUrl: null, firstName: 'John', lastName: 'Doe' } },
    { id: 2, user: { photoUrl: null, firstName: 'Jane', lastName: 'Smith' } },
  ];

  useEffect(() => {
    // Mock load data
  }, []);

  // Header animation calculations (matching iOS exactly)
  const maxHeaderHeight = PLACEHOLDER_HEIGHT + CARD_OVERLAY_HEIGHT + BEGIN_ANIMATION_HEIGHT; // 336px total
  const minHeight = MIN_HEADER_HEIGHT + insets.top;
  
  // iOS logic: finalHeight = refHeaderHeight - yOffset
  // When pulling down (negative scroll), header grows larger
  const headerHeight = scrollY.interpolate({
    inputRange: [-200, 0, maxHeaderHeight - minHeight], // Allow pull down to -200px
    outputRange: [maxHeaderHeight + 200, maxHeaderHeight, minHeight], // Grow when pulling down
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, (maxHeaderHeight - minHeight) / 2],
    outputRange: [0.8, 0.2],
    extrapolate: 'clamp',
  });

  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, maxHeaderHeight - minHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Image zoom effect when pulling down (matching iOS)
  const imageScale = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [1.5, 1], // Scale up to 1.5x when pulling down
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header - Matching iOS exactly */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={require('@/assets/images/home_header_bg.png')}
          // source={{ uri: 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Building+Photo' }}
          style={[
            styles.headerBackground, 
            { 
              opacity: headerOpacity,
              transform: [{ scale: imageScale }]
            }
          ]}
          resizeMode="cover"
        />
        <View style={[styles.headerContent, { paddingTop: insets.top + 13.5 }]}>
          <Image
            source={require('@/assets/images/logo_horizontal_white.png')}
            //source={{ uri: 'https://via.placeholder.com/88x25/FFFFFF/000000?text=RESIO' }
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Shadow Separator - Positioned independently like iOS */}
      <Animated.View style={[
        styles.shadowSeparator, 
        { 
          opacity: shadowOpacity,
          top: insets.top + 32 // Matching iOS .Padding.padding8
        }
      ]} />

      {/* Scrollable Content - Matching iOS structure exactly */}
      <Animated.ScrollView
        style={[styles.scrollView, { marginTop: insets.top + 64 }]}
        contentContainerStyle={[styles.content, { paddingTop: 16 }]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}

        showsVerticalScrollIndicator={false}
      >
        {/* Animation Placeholder - Matches iOS exactly */}
        <View style={{ height: PLACEHOLDER_HEIGHT }} />
        
        {/* Card Overlay - Matches iOS exactly */}
        <View style={styles.cardOverlay} />
        
        {/* Negative spacing after card overlay - matches iOS setCustomSpacing */}
        <View style={{ height: -12 }} />

        {/* Home Actions Section - Simplified to match current iOS */}
        <View style={styles.homeActionsContainer}>
          <TouchableOpacity 
            style={styles.bulletinsCard}
            onPress={() => console.log('Navigate to Bulletins')}
          >
            <View style={styles.bulletinsContent}>
              <View style={styles.bulletinsIcon}>
                <Icon name="megaphone-outline" size={20} color="#007AFF" />
              </View>
              <Text style={styles.bulletinsText}>
                {mockBulletins.filter(b => !b.isRead).length > 0 
                  ? `${mockBulletins.filter(b => !b.isRead).length} new bulletins`
                  : 'No new bulletins'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Events Section - Matches iOS exactly */}
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsScrollContainer}
          >
            {mockEvents.map((event) => (
              <TouchableOpacity key={event.id} style={styles.eventCard}>
                <View style={styles.eventDateContainer}>
                  <Text style={styles.eventMonth}>
                    {event.startTime.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </Text>
                  <Text style={styles.eventDay}>
                    {event.startTime.getDate()}
                  </Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <Text style={styles.eventTime}>
                    {event.startTime.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </Text>
                  {event.location && (
                    <Text style={styles.eventLocation} numberOfLines={1}>
                      {event.location}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Community Resources Section - Matches iOS exactly */}
        <View style={styles.communityResourcesSection}>
          <Text style={styles.sectionTitle}>Community Resources</Text>
          
          {/* WiFi Card - Matches iOS HomeWifiView exactly */}
          <TouchableOpacity 
            style={styles.wifiCard}
            onPress={() => console.log('Navigate to WiFi Setup')}
          >
            <View style={styles.wifiContent}>
              <View style={styles.cbxLogo}>
                <Text style={styles.cbxLogoText}>CBX</Text>
              </View>
              <Text style={styles.wifiTitle}>WiFi for Your Unit</Text>
              <Text style={styles.wifiDescription}>
                Connect your devices to fast, reliable WiFi
              </Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#C7C7CC" />
          </TouchableOpacity>

          {/* Resource Grid - Matches iOS 2x2 grid exactly */}
          <View style={styles.resourcesGrid}>
            {mockResources.map((resource, index) => (
              <TouchableOpacity key={resource.id} style={styles.resourceCard}>
                <View style={styles.resourceIcon}>
                  <Icon name="grid-outline" size={24} color="#007AFF" />
                </View>
                <Text style={styles.resourceTitle} numberOfLines={2}>
                  {resource.title}
                </Text>
                <Text style={styles.resourceDescription} numberOfLines={2}>
                  {resource.description}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* More Resources Card - Matches iOS exactly */}
            <TouchableOpacity style={styles.resourceCard}>
              <View style={[styles.resourceIcon, { backgroundColor: '#F2F2F7' }]}>
                <Icon name="apps-outline" size={24} color="#007AFF" />
              </View>
              <Text style={styles.resourceTitle}>More Resources</Text>
              <Text style={styles.resourceDescription}>
                View all available resources
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Linked Accounts Section - Matches iOS LinkedAccountsNavigationView exactly */}
        <View style={styles.linkedAccountsSection}>
          <TouchableOpacity 
            style={styles.linkedAccountsCard}
            onPress={() => console.log('Navigate to Linked Accounts')}
          >
            <View style={styles.linkedAccountsContent}>
              <View style={styles.avatarsContainer}>
                {mockConnections.map((connection, index) => (
                  <View 
                    key={connection.id} 
                    style={[
                      styles.avatar, 
                      { marginLeft: index > 0 ? -10 : 0 }
                    ]}
                  >
                    <Icon name="person" size={20} color="#000000" />
                  </View>
                ))}
              </View>
              <View style={styles.linkedAccountsText}>
                <Text style={styles.linkedAccountsTitle}>Linked Accounts</Text>
                <Text style={styles.linkedAccountsDescription} numberOfLines={2}>
                  Invite people and they'll be able to make payments on your behalf
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={24} color="#C7C7CC" />
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  
  // Header Styles - Matching iOS exactly
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  logo: {
    width: 88,
    height: 25,
  },
  shadowSeparator: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 3, // Appears above header and content
  },
  
  // Scroll Content
  scrollView: {
    flex: 1,
    zIndex: 2, // Ensures content appears above header
  },
  content: {
    paddingBottom: 24,
  },
  cardOverlay: {
    height: 28,
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop: -28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  
  // Home Actions Section - Matching iOS HomeActionsView
  homeActionsContainer: {
    paddingHorizontal: 16,
    marginTop: 0, // No margin needed due to negative spacing above
  },
  bulletinsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bulletinsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletinsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bulletinsText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
  },
  
  // Events Section - Matching iOS EventListView
  eventsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  eventsScrollContainer: {
    paddingHorizontal: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: (width - 32) / 2, // Matching iOS grid layout
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventDateContainer: {
    width: 60,
    alignItems: 'center',
    marginRight: 16,
  },
  eventMonth: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 2,
  },
  eventDay: {
    fontSize: 28,
    fontWeight: '300',
    color: '#000000',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 13,
    color: '#007AFF',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 13,
    color: '#8E8E93',
  },
  
  // Community Resources Section - Matching iOS CommunityResourcesView
  communityResourcesSection: {
    marginTop: 24,
  },
  
  // WiFi Card - Matching iOS HomeWifiView exactly
  wifiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wifiContent: {
    flex: 1,
  },
  cbxLogo: {
    width: 70,
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cbxLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  wifiTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  wifiDescription: {
    fontSize: 13,
    color: '#8E8E93',
  },
  
  // Resource Grid - Matching iOS 2x2 layout exactly
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  resourceCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourceTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 12,
    color: '#8E8E93',
  },
  
  // Linked Accounts Section - Matching iOS LinkedAccountsNavigationView exactly
  linkedAccountsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  linkedAccountsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linkedAccountsContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  linkedAccountsText: {
    flex: 1,
  },
  linkedAccountsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  linkedAccountsDescription: {
    fontSize: 13,
    color: '#8E8E93',
  },
}); 
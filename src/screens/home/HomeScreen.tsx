import React, { useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchHomeData } from '@/store/slices/homeSlice';
import { useHeaderAnimation } from '@/hooks/useHeaderAnimation';
import { RootStackParamList } from '@/navigation/RootNavigator';
import {
  BulletinCard,
  EventCard,
  WiFiCard,
  ResourceCard,
  LinkedAccountsCard,
  SectionTitle,
} from '@/components';
import { 
  mockResources, 
  mockConnections 
} from '@/data/mockHomeData';
import { Event, CommunityResource } from '@/types/home';
import {
  COLORS,
  PADDING,
  PLACEHOLDER_HEIGHT,
  ANIMATION,
  SHADOW,
  SCREEN_WIDTH,
} from '@/constants/homeConstants';
import { homeStrings } from '@/constants';

type RootNavigationProp = StackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector((state) => state.auth);
  const { bulletins, events, resources, unreadBulletinsCount, isLoading } = useAppSelector((state) => state.home);
  const { scrollY, animations } = useHeaderAnimation();

  // Log events data to see what we're getting
  console.log('🏡 HomeScreen - Events from Redux:', events);
  console.log('🏡 HomeScreen - Events count:', events.length);
  
  // Check for undefined events
  const undefinedEvents = events.filter(event => !event);
  if (undefinedEvents.length > 0) {
    console.error('🏡 HomeScreen - Found undefined events:', undefinedEvents.length);
  }
  
  if (events.length > 0) {
    console.log('🏡 HomeScreen - First event:', events[0]);
  }

  // Fetch home data when component mounts or when user changes
  useEffect(() => {
    if (user?.propertyId) {
      dispatch(fetchHomeData(user.propertyId));
    }
  }, [dispatch, user?.propertyId]);

  // Navigation handlers
  const handleBulletinPress = useCallback(() => {
    navigation.navigate('BulletinsList');
  }, [navigation]);

  const handleEventPress = useCallback((event: Event) => {
    navigation.navigate('EventDetail', { event });
  }, [navigation]);

  const handleWiFiPress = useCallback(() => {
    // TODO: Navigate to WiFi Setup screen
    console.log('Navigate to WiFi Setup');
  }, []);

  const handleResourcePress = useCallback((resource?: CommunityResource) => {
    if (resource) {
      // TODO: Navigate to Resource detail screen
      console.log('Navigate to Resource:', resource.title);
    } else {
      // TODO: Navigate to More Resources screen
      console.log('Navigate to More Resources');
    }
  }, []);

  const handleLinkedAccountsPress = useCallback(() => {
    // TODO: Navigate to Linked Accounts screen
    console.log('Navigate to Linked Accounts');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header - Matching iOS exactly */}
      <Animated.View style={[styles.header, { height: animations.headerHeight }]}>
        <Animated.Image
          source={require('@/assets/images/home_header_bg.png')}
          style={[
            styles.headerBackground, 
            { 
              opacity: animations.headerOpacity,
              transform: [{ scale: animations.imageScale }]
            }
          ]}
          resizeMode="cover"
        />
        <View style={[styles.headerContent, { paddingTop: insets.top + 13.5 }]}>
          <Image
            source={require('@/assets/images/logo_horizontal_white.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Shadow Separator - Positioned independently like iOS */}
      <Animated.View style={[
        styles.shadowSeparator, 
        { 
          opacity: animations.shadowOpacity,
          top: insets.top + 32
        }
      ]} />

      {/* Scrollable Content - Matching iOS structure exactly */}
      <Animated.ScrollView
        style={[styles.scrollView, { marginTop: insets.top + 64 }]}
        contentContainerStyle={[styles.content, { paddingTop: PADDING.padding4 }]}
        scrollEventThrottle={ANIMATION.scrollEventThrottle}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        showsVerticalScrollIndicator={false}
      >
        {/* Animation Placeholder */}
        <View style={{ height: PLACEHOLDER_HEIGHT }} />
        
        {/* Card Overlay */}
        <View style={styles.cardOverlay} />

        {/* Home Actions Section */}
        <View style={styles.homeActionsContainer}>
          <BulletinCard 
            unreadCount={unreadBulletinsCount}
            onPress={handleBulletinPress}
          />
        </View>

        {/* Events Section - Consistent padding with other sections */}
        <View style={styles.eventsSection}>
          <SectionTitle title={homeStrings.upcomingEvents.title} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsScrollContainer}
            style={styles.eventsCollectionView}
          >
            {events
              .filter((event) => event && event.id) // Filter out undefined/null events
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={handleEventPress}
                />
              ))}
          </ScrollView>
        </View>

        {/* Community Resources Section */}
        <View style={styles.communityResourcesSection}>
          <SectionTitle title={homeStrings.communityResources.title} />
          
          <WiFiCard onPress={handleWiFiPress} />

          {/* Resource Grid */}
          <View style={styles.resourcesGrid}>
            {mockResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onPress={handleResourcePress}
              />
            ))}
          </View>

          {/* More Resources Card */}
          <ResourceCard
            isMoreResourcesCard
            isFullWidth
            onPress={handleResourcePress}
          />
        </View>

        {/* Linked Accounts Section */}
        <View style={styles.linkedAccountsSection}>
          <LinkedAccountsCard 
            connections={mockConnections}
            onPress={handleLinkedAccountsPress}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header Styles
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
    paddingHorizontal: PADDING.padding4,
  },
  logo: {
    width: ANIMATION.logoSize.width,
    height: ANIMATION.logoSize.height,
  },
  shadowSeparator: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'transparent',
    ...SHADOW.separator,
    zIndex: 3,
  },
  
  // Scroll Content
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  content: {
    paddingBottom: PADDING.padding6,
  },
  cardOverlay: {
    height: 28,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop: -28,
    overflow: 'visible',
    ...SHADOW.cardOverlay,
  },
  
  // Section Containers
  homeActionsContainer: {
    paddingHorizontal: PADDING.padding4,
    marginTop: -12,
    marginBottom: PADDING.padding4,
    backgroundColor: COLORS.background,
  },
  eventsSection: {
    marginTop: PADDING.padding4, // iOS .Padding.padding4 top margin
    marginBottom: PADDING.padding2, // iOS .Padding.padding2 bottom margin
    paddingHorizontal: PADDING.padding4, // Section title padding
  },
  eventsCollectionView: {
    height: SCREEN_WIDTH / 2, // iOS: UIScreen.main.bounds.width / 2
    marginHorizontal: -PADDING.padding4, // Offset section padding for collection
  },
  eventsScrollContainer: {
    paddingHorizontal: PADDING.padding2, // iOS section insets: 8px left/right
    alignItems: 'flex-start',
  },
  communityResourcesSection: {
    marginTop: PADDING.padding4,
    paddingHorizontal: PADDING.padding4,
    paddingBottom: PADDING.padding4,
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PADDING.padding4, // iOS .Padding.padding4 spacing between items
    marginBottom: PADDING.padding4, // iOS stackView spacing to next section
  },
  linkedAccountsSection: {
    marginTop: PADDING.padding2,
    paddingHorizontal: PADDING.padding4, // iOS LinkedAccountsNavigationView margins
  },
}); 
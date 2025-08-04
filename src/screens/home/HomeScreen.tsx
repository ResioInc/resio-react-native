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
import { fetchWifiInfo } from '@/store/slices/wifiSlice';
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

// TODO: drag to drop modals
// TODO: qr code generator

// When sending an invite, server responds with 500 error on react native but 401 (api key required) on iOS swift

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector((state) => state.auth);
  const { events, resources, linkedAccounts, unreadBulletinsCount } = useAppSelector((state) => state.home);
  const { wifiInfo } = useAppSelector((state) => state.wifi);
  const { scrollY, animations } = useHeaderAnimation();
  
  // Check for undefined events and filter valid events
  const validEvents = events.filter((event) => event && event.id);
  const undefinedEvents = events.filter(event => !event);
  if (undefinedEvents.length > 0) {
    console.error('🏡 HomeScreen - Found undefined events:', undefinedEvents.length);
  }
  
  // iOS behavior: Hide sections when empty/unavailable
  const shouldShowEventsSection = validEvents.length > 0;
  const shouldShowWiFiCard = wifiInfo !== null;

  // Fetch home data when component mounts or when user changes
  useEffect(() => {
    if (user?.propertyId) {
      dispatch(fetchHomeData(user.propertyId));
    }
    // Fetch WiFi info if lease ID is available (matches iOS loadUnitInfo behavior)
    if (user?.currentLeaseId) {
      dispatch(fetchWifiInfo(user.currentLeaseId));
    }
  }, [dispatch, user?.propertyId, user?.currentLeaseId]);

  // Navigation handlers
  const handleBulletinPress = useCallback(() => {
    navigation.navigate('BulletinsList');
  }, [navigation]);

  const handleEventPress = useCallback((event: Event) => {
    navigation.navigate('EventDetail', { event });
  }, [navigation]);

  const handleWiFiPress = useCallback(() => {
    navigation.navigate('WifiConnection');
  }, [navigation]);

  const handleResourcePress = useCallback((resource?: CommunityResource) => {
    if (resource) {
      // Navigate to Resource detail screen (matching iOS showResource)
      navigation.navigate('ResourceDetail', { resource });
    } else {
      // Navigate to More Resources screen (matching iOS showMoreResources)
      navigation.navigate('MoreResources');
    }
  }, [navigation]);

  const handleLinkedAccountsPress = useCallback(() => {
    navigation.navigate('LinkedAccounts');
  }, [navigation]);

  // Render resource grid based on position like iOS
  const renderResourceGrid = useCallback(() => {
    // Sort resources by position and filter to only show positions 0-3
    const sortedResources = resources
      .filter(resource => resource.position !== undefined && resource.position >= 0 && resource.position <= 3)
      .sort((a, b) => a.position - b.position);

    // Group resources into rows like iOS
    const firstRowResources = sortedResources.filter(r => r.position === 0 || r.position === 1);
    const secondRowResources = sortedResources.filter(r => r.position === 2 || r.position === 3);
    
    return (
      <View style={styles.resourcesGrid}>
        {/* First Row - Positions 0 and 1 */}
        {firstRowResources.length > 0 && (
          <View style={styles.resourceRow}>
            {firstRowResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onPress={handleResourcePress}
              />
            ))}
            {/* Add spacer if only one item in row */}
            {firstRowResources.length === 1 && <View style={styles.resourceSpacer} />}
          </View>
        )}
        
        {/* Second Row - Positions 2 and 3 */}
        {secondRowResources.length > 0 && (
          <View style={styles.resourceRow}>
            {secondRowResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onPress={handleResourcePress}
              />
            ))}
            {/* Add spacer if only one item in row */}
            {secondRowResources.length === 1 && <View style={styles.resourceSpacer} />}
          </View>
        )}
      </View>
    );
  }, [resources, handleResourcePress]);

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

        {/* Events Section - Hidden when no events (matches iOS behavior) */}
        {shouldShowEventsSection && (
          <View style={styles.eventsSection}>
            <SectionTitle title={homeStrings.upcomingEvents.title} />
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsScrollContainer}
              style={styles.eventsCollectionView}
            >
              {validEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={handleEventPress}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Community Resources Section */}
        <View style={styles.communityResourcesSection}>
          <SectionTitle title={homeStrings.communityResources.title} />
          
          {/* WiFi Card - Hidden when no WiFi info available (matches iOS behavior) */}
          {shouldShowWiFiCard && <WiFiCard onPress={handleWiFiPress} />}

          {/* Resource Grid - Position-based like iOS */}
          {renderResourceGrid()}

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
            linkedAccounts={linkedAccounts}
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
    marginBottom: PADDING.padding4, // iOS stackView spacing to next section
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PADDING.padding4, // Spacing between rows
  },
  resourceSpacer: {
    // Same width as ResourceCard to maintain spacing when only one item in row
    width: (SCREEN_WIDTH - PADDING.padding4 * 2 - PADDING.padding4) / 2,
  },
  linkedAccountsSection: {
    marginTop: PADDING.padding2,
    paddingHorizontal: PADDING.padding4, // iOS LinkedAccountsNavigationView margins
  },
}); 
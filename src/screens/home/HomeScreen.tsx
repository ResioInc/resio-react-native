import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
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
const MAX_HEADER_HEIGHT = 244;
const CARD_OVERLAY_HEIGHT = 32;

export const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector((state) => state.auth);
  const { events, bulletins, resources, isLoading } = useAppSelector((state) => state.home);
  
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await dispatch(fetchHomeData()).unwrap();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Header animation calculations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT],
    outputRange: [MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT + insets.top],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, (MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT) / 2],
    outputRange: [0.8, 0.2],
    extrapolate: 'clamp',
  });

  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={require('@/assets/images/home_header_bg.png')}
          style={[styles.headerBackground, { opacity: headerOpacity }]}
          resizeMode="cover"
        />
        <View style={[styles.headerContent, { paddingTop: insets.top + 13.5 }]}>
          <Image
            source={require('@/assets/images/logo_horizontal_white.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Animated.View style={[styles.shadowSeparator, { opacity: shadowOpacity }]} />
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Placeholder for animation */}
        <View style={{ height: 180 }} />
        
        {/* Card Overlay */}
        <View style={styles.cardOverlay} />

        {/* Bulletins Action Card */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => console.log('Navigate to Bulletins')}
          >
            <View style={styles.actionCardContent}>
              <View style={styles.circleIcon}>
                <Icon name="megaphone-outline" size={20} color="#007AFF" />
              </View>
              <Text style={styles.actionCardText}>
                {bulletins.filter(b => !b.isRead).length > 0 
                  ? `${bulletins.filter(b => !b.isRead).length} new bulletins`
                  : 'No new bulletins'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Events Section */}
        {events.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsContainer}
            >
              {events.map((event) => (
                <TouchableOpacity key={event.id} style={styles.eventCard}>
                  <View style={styles.eventDateContainer}>
                    <Text style={styles.eventMonth}>
                      {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </Text>
                    <Text style={styles.eventDay}>
                      {new Date(event.startTime).getDate()}
                    </Text>
                  </View>
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                      {event.title}
                    </Text>
                    <Text style={styles.eventTime}>
                      {new Date(event.startTime).toLocaleTimeString('en-US', { 
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
        )}

        {/* Community Resources */}
        {resources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community Resources</Text>
            
            {/* WiFi Card */}
            <TouchableOpacity 
              style={styles.wifiCard}
              onPress={() => console.log('Navigate to WiFi Setup')}
            >
              <View style={styles.wifiContent}>
                <View style={styles.cbxLogoPlaceholder}>
                  <Text style={styles.cbxLogoText}>CBX</Text>
                </View>
                <Text style={styles.wifiTitle}>WiFi for Your Unit</Text>
                <Text style={styles.wifiDescription}>
                  Connect your devices to fast, reliable WiFi
                </Text>
              </View>
              <Icon name="chevron-forward" size={24} color="#C7C7CC" />
            </TouchableOpacity>

            {/* Resource Grid */}
            <View style={styles.resourcesGrid}>
              {resources.slice(0, 4).map((resource) => (
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
              
              {/* More Resources Card */}
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

            {/* Property Info Cards */}
            <View style={styles.propertyInfoContainer}>
              <TouchableOpacity style={styles.propertyInfoCard}>
                <Image
                  source={require('@/assets/images/contact_office.jpg')}
                  style={styles.propertyInfoBg}
                  resizeMode="cover"
                />
                <View style={styles.propertyInfoOverlay} />
                <View style={styles.propertyInfoContent}>
                  <View style={styles.propertyInfoIcon}>
                    <Icon name="chatbubble-ellipses-outline" size={20} color="#007AFF" />
                  </View>
                  <Text style={styles.propertyInfoText}>Contact Office</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.propertyInfoCard}>
                <Image
                  source={require('@/assets/images/resident_handbook.jpg')}
                  style={styles.propertyInfoBg}
                  resizeMode="cover"
                />
                <View style={styles.propertyInfoOverlay} />
                <View style={styles.propertyInfoContent}>
                  <View style={styles.propertyInfoIcon}>
                    <Icon name="help-circle-outline" size={20} color="#007AFF" />
                  </View>
                  <Text style={styles.propertyInfoText}>Resident Handbook</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
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
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  cardOverlay: {
    height: CARD_OVERLAY_HEIGHT,
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -CARD_OVERLAY_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: -8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionCardText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
  },
  eventsContainer: {
    paddingHorizontal: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
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
  cbxLogoPlaceholder: {
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
  propertyInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  propertyInfoCard: {
    flex: 1,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyInfoBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  propertyInfoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  propertyInfoContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyInfoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  propertyInfoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from '@/store';
import { BulletinListItem } from '@/components/bulletins/BulletinListItem';
import { Bulletin } from '@/types';
import { COLORS, PADDING, ICON_SIZES } from '@/constants/homeConstants';
import { HomeAPI } from '@/services/api/HomeAPI';
import { notificationStrings } from '@/constants/strings';
import { RootStackParamList } from '@/navigation/RootNavigator';

type RootNavigationProp = StackNavigationProp<RootStackParamList>;

export const BulletinsListScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { user } = useAppSelector((state) => state.auth);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [allBulletins, setAllBulletins] = useState<Bulletin[]>([]);

  // Navigation options are set in HomeStackNavigator to match iOS (no title, just back arrow)

  // iOS-style error handling function (matching UIViewController+Extensions showError)
  const showError = useCallback((error: Error | string, onRetry?: () => void) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    const buttons: Array<{text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void}> = [
      {
        text: 'OK', // iOS: "alert.accept".localized
        style: 'default',
      }
    ];
    
    // Add retry option for network-related errors
    if (onRetry && (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('timeout'))) {
      buttons.unshift({
        text: 'Retry',
        style: 'default',
        onPress: onRetry,
      });
    }
    
    Alert.alert(
      'Error', // iOS: "alert.error".localized
      errorMessage,
      buttons,
      { cancelable: true }
    );
  }, []);

  const loadBulletins = useCallback(async (isFirstPage: boolean = false) => {
    if (!user?.propertyId) {
      console.log('CSCurrentUser has no associated property.'); // iOS log message
      return;
    }

    try {
      const pageNum = isFirstPage ? 0 : currentPage + 1;
      
      const newBulletins = await HomeAPI.getBulletins(user.propertyId, pageNum);
            
      if (isFirstPage) {
        setAllBulletins(newBulletins);
        setCurrentPage(0);
      } else {
        setAllBulletins(prev => [...prev, ...newBulletins]);
        setCurrentPage(pageNum);
      }
      
      // iOS pagination logic: hasMorePages if we got exactly 25 items
      setHasMorePages(newBulletins.length === 25);
      
    } catch (error) {
      console.error('❌ Failed to load bulletins:', error);
      
      // iOS-style error handling: show user-facing error alert
      showError(error as Error, () => {
        // Retry function - reload the same page
        loadBulletins(isFirstPage);
      });
      
      // iOS behavior: Don't reset hasMorePages on first page errors
      // Only set hasMorePages to false for pagination errors
      if (!isFirstPage) {
        setHasMorePages(false);
      }
    }
  }, [user?.propertyId, currentPage, showError]);

  // Load initial bulletins
  useEffect(() => {
    if (user?.propertyId) {
      loadBulletins(true);
    }
  }, [user?.propertyId, loadBulletins]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadBulletins(true);
    setIsRefreshing(false);
  }, [loadBulletins]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMorePages) return;
    
    setIsLoadingMore(true);
    await loadBulletins(false);
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMorePages, loadBulletins]);

  const handleBulletinPress = useCallback((bulletin: Bulletin) => {
    navigation.navigate('BulletinDetail', { bulletin });
  }, [navigation]);

  const renderBulletinItem = ({ item }: { item: Bulletin }) => (
    <BulletinListItem 
      bulletin={item} 
      onPress={handleBulletinPress}
    />
  );

  const renderListFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {/* Bell icon matching iOS .Icon.notifications */}
      <View style={styles.emptyIconContainer}>
        <Icon
          name="notifications-outline"
          size={ICON_SIZES.jumbo}
          color={COLORS.textSubtitle}
          style={styles.emptyIcon}
        />
      </View>
      <Text style={styles.emptyTitle}>{notificationStrings.empty.title}</Text>
      <Text 
        style={styles.emptyDescription}
        numberOfLines={0} // iOS: numberOfLines = 0 (unlimited lines)
      >
        {notificationStrings.empty.description}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <FlatList
        data={allBulletins}
        renderItem={renderBulletinItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          allBulletins.length === 0 && styles.emptyListContent
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        // iOS-like scroll behavior
        scrollEventThrottle={16}
        decelerationRate="normal"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: PADDING.padding4,
    paddingBottom: PADDING.padding6,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loadingFooter: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: PADDING.padding2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING.padding6,
  },
  emptyIconContainer: {
    marginBottom: PADDING.padding4, // iOS spacing after icon
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    // Icon styling matches iOS gray tint and jumbo size
  },
  emptyTitle: {
    fontSize: 14, // iOS: .avenir900(withSize: 14)
    fontWeight: '900', // iOS: avenir900 (black weight)
    color: COLORS.textPrimary,
    marginBottom: PADDING.padding1, // Tighter spacing like iOS
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 13, // iOS: .avenir400(withSize: 13)
    fontWeight: '400', // iOS: avenir400 (regular weight)
    color: COLORS.textSubtitle, // iOS: .Text.profileSubtitle
    textAlign: 'center',
    lineHeight: 18, // Appropriate line height for 13px font
  },
});
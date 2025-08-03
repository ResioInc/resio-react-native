import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector, useAppDispatch } from '@/store';
import { checkAuthStatus } from '@/store/slices/authSlice';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { BulletinsListScreen } from '@/screens/bulletins/BulletinsListScreen';
import { BulletinDetailScreen } from '@/screens/bulletins/BulletinDetailScreen';
import { EventDetailScreen } from '@/screens/events/EventDetailScreen';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Bulletin, Event } from '@/types';
import { notificationStrings } from '@/constants/strings';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  // Bulletins screens at root level (iOS-style full screen)
  BulletinsList: undefined;
  BulletinDetail: {
    bulletin: Bulletin;
  };
  // Events screens
  EventDetail: {
    event: Event;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await dispatch(checkAuthStatus()).unwrap();
    } catch (error) {
      // User not authenticated
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          {/* Bulletins screens presented full-screen (iOS style) */}
          <Stack.Screen 
            name="BulletinsList" 
            component={BulletinsListScreen}
            options={{
              headerShown: true,
              title: notificationStrings.title, // iOS: "notifications.title".localized = "Bulletins"
              headerStyle: {
                backgroundColor: '#F2F2F7', // iOS background color
                shadowColor: 'transparent', // iOS: shadowImage = UIImage() (removes border)
                elevation: 0, // Android: remove shadow
                borderBottomWidth: 0, // Ensure no border on iOS
              },
              headerTintColor: '#000000', // iOS: NavigationBar.tintColorPrimary (resioBlack)
              headerBackTitleVisible: false, // Hide "Back" text on iOS
              headerTitleAlign: 'center', // Center the title like iOS
              headerShadowVisible: false, // React Navigation v6: explicitly disable shadow
              headerTitleStyle: {
                fontSize: 15, // iOS: CSConstants.navigationTitleFontSize = 15.0
                fontWeight: '700', // Heavy/Bold weight (cross-platform compatible)
                fontFamily: 'System', // Use system font with heavy weight for consistency
              },
            }}
          />
          <Stack.Screen 
            name="BulletinDetail" 
            component={BulletinDetailScreen}
            options={{
              headerShown: false,
              presentation: 'modal', // iOS-style modal presentation
            }}
          />
          <Stack.Screen 
            name="EventDetail" 
            component={EventDetailScreen}
            options={{
              headerShown: false,
              presentation: 'modal', // iOS-style modal presentation
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
}); 
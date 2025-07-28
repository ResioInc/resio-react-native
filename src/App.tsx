import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './store';
import { RootNavigator } from './navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { verifyConfiguration } from './utils/configVerification';
import { EnvironmentBadge } from './components';

export const App: React.FC = () => {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Verify configuration
      if (__DEV__) {
        verifyConfiguration();
      }
      
      // Initialize any services here
      // TODO: Initialize certificate pinning
      // TODO: Initialize remote config
      // TODO: Initialize analytics
    } catch (error) {
      console.error('App initialization failed:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <EnvironmentBadge />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}; 
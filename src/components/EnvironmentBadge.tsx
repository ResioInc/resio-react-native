import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppConfig } from '@/constants/config';

export const EnvironmentBadge: React.FC = () => {
  if (!__DEV__ || AppConfig.ENVIRONMENT.IS_PRODUCTION) {
    return null;
  }

  const getBackgroundColor = () => {
    switch (AppConfig.ENVIRONMENT.NAME) {
      case 'DEVELOPMENT':
        return '#4CAF50'; // Green
      case 'STAGE':
        return '#FF9800'; // Orange
      default:
        return '#2196F3'; // Blue
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.text}>{AppConfig.ENVIRONMENT.NAME}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1000,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
}); 
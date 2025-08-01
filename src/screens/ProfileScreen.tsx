import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/authSlice';

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const handleLogoutPress = () => {
    // Show confirmation alert (matching iOS behavior)
    Alert.alert(
      '',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'default',
          onPress: handleLogout,
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      // Navigation will be handled automatically by RootNavigator
      // when isAuthenticated becomes false
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API logout fails, we should still clear local state
      // The logout thunk handles this gracefully
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userText}>Welcome, {user.firstName || user.email}</Text>
        </View>
      )}
      
      <Text style={styles.subtitle}>Coming soon...</Text>
      
      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogoutPress}
        disabled={isLoading}
      >
        <Text style={styles.logoutButtonText}>
          {isLoading ? 'Logging out...' : 'Logout'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  userInfo: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 
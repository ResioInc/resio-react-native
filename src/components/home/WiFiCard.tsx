import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppSelector, useAppDispatch } from '@/store';
import { fetchWifiInfo } from '@/store/slices/wifiSlice';
import { WifiConnectionStatus } from '@/types';
import { COLORS, PADDING, CARD_STYLES, TYPOGRAPHY, ICON_SIZES } from '@/constants/homeConstants';
import { homeStrings } from '@/constants/strings';

interface WiFiCardProps {
  onPress: () => void;
}

export const WiFiCard: React.FC<WiFiCardProps> = ({ onPress }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { wifiInfo, connectionStatus } = useAppSelector((state) => state.wifi);

  useEffect(() => {
    // Fetch WiFi info when component mounts if not already loaded
    if (!wifiInfo && user?.currentLeaseId) {
      dispatch(fetchWifiInfo(user.currentLeaseId));
    }
  }, [dispatch, wifiInfo, user?.currentLeaseId]);

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case WifiConnectionStatus.CONNECTED:
        return homeStrings.wifi.button.connected;
      case WifiConnectionStatus.CONNECTING:
        return homeStrings.wifi.button.connecting;
      case WifiConnectionStatus.DISCONNECTED:
        return 'Not Connected';
      case WifiConnectionStatus.UNKNOWN:
      default:
        return homeStrings.wifi.description;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case WifiConnectionStatus.CONNECTED:
        return '#34C759'; // Green
      case WifiConnectionStatus.CONNECTING:
        return '#FF9500'; // Orange
      case WifiConnectionStatus.DISCONNECTED:
        return COLORS.red;
      case WifiConnectionStatus.UNKNOWN:
      default:
        return COLORS.textSubtitle;
    }
  };

  const showConnectionStatus = wifiInfo && connectionStatus !== WifiConnectionStatus.UNKNOWN;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${homeStrings.wifi.title}${showConnectionStatus ? `. ${getConnectionStatusText()}` : ''}`}
    >
      <View style={styles.content}>
        <View style={styles.cbxLogo}>
          <Text style={styles.cbxLogoText}>CBX</Text>
        </View>
        <Text style={styles.title}>{homeStrings.wifi.title}</Text>
        <Text style={styles.description}>
          {homeStrings.wifi.description}
        </Text>
      </View>
      {/* Chevron positioned at top-right of content like iOS */}
      <Icon 
        name="chevron-forward" 
        size={ICON_SIZES.medium} 
        color={COLORS.separator}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...CARD_STYLES, // iOS CardView styling
    padding: PADDING.padding4,
    marginBottom: PADDING.padding4,
    position: 'relative', // For absolute positioning of chevron
  },
  content: {
    // iOS: content has .Padding.padding4 from cellContainer edges
    // This is already handled by card padding
  },
  chevron: {
    position: 'absolute',
    top: PADDING.padding4, // iOS: content.topAnchor (at top of content area)
    right: PADDING.padding4, // iOS: content.trailingAnchor (at right of content area)
  },
  cbxLogo: {
    width: 70,
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING.padding4,
  },
  cbxLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  title: {
    ...TYPOGRAPHY.cardTitle,
    color: COLORS.textPrimary,
    marginBottom: PADDING.paddingHalf,
  },
  description: {
    ...TYPOGRAPHY.cardDescription,
    color: COLORS.textSubtitle,
  },
});
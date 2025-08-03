import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WifiConnectionStatus } from '@/types';
import { COLORS, PADDING, ICON_SIZES } from '@/constants/homeConstants';
import { strings } from '@/constants/strings';

interface WifiConnectionButtonProps {
  status: WifiConnectionStatus;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const WifiConnectionButton: React.FC<WifiConnectionButtonProps> = ({
  status,
  onPress,
  isLoading = false,
  disabled = false,
}) => {
  const getButtonStyle = () => {
    switch (status) {
      case WifiConnectionStatus.CONNECTED:
        return styles.connected;
      case WifiConnectionStatus.CONNECTING:
        return styles.connecting;
      case WifiConnectionStatus.DISCONNECTED:
      case WifiConnectionStatus.UNKNOWN:
      default:
        return styles.disconnected;
    }
  };

  const getButtonText = () => {
    switch (status) {
      case WifiConnectionStatus.CONNECTED:
        return strings.wifi.button.connected;
      case WifiConnectionStatus.CONNECTING:
        return 'Connecting...'; // Note: iOS doesn't have this state, keeping hardcoded
      case WifiConnectionStatus.DISCONNECTED:
        return strings.wifi.button.disconnected;
      case WifiConnectionStatus.UNKNOWN:
      default:
        return strings.wifi.button.disconnected;
    }
  };

  const getIcon = () => {
    switch (status) {
      case WifiConnectionStatus.CONNECTED:
        return 'wifi';
      case WifiConnectionStatus.CONNECTING:
        return 'wifi';
      case WifiConnectionStatus.DISCONNECTED:
      case WifiConnectionStatus.UNKNOWN:
      default:
        return 'wifi-outline';
    }
  };

  const shouldShowSpinner = isLoading || status === WifiConnectionStatus.CONNECTING;

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={onPress}
      disabled={disabled || shouldShowSpinner}
      accessibilityRole="button"
      accessibilityLabel={getButtonText()}
      accessibilityState={{ disabled: disabled || shouldShowSpinner }}
    >
      <View style={styles.content}>
        {shouldShowSpinner ? (
          <ActivityIndicator 
            size="small" 
            color={COLORS.textPrimary} 
            style={styles.icon}
          />
        ) : (
          <Icon
            name={getIcon()}
            size={ICON_SIZES.large}
            color={COLORS.textPrimary}
            style={styles.icon}
          />
        )}
        <Text style={styles.text}>{getButtonText()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 80, // iOS: .WifiButton.radius (circular)
    paddingHorizontal: PADDING.padding6,
    paddingVertical: PADDING.padding4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 80, // iOS: .WifiButton.diameter
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: PADDING.paddingHalf,
  },
  text: {
    fontSize: 9, // iOS: .tertiary(withSize: 9)
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  disconnected: {
    backgroundColor: '#E5E5EA', // iOS: .Button.wifiBackgroundDisconnected
  },
  connected: {
    backgroundColor: '#34C759', // iOS: .Button.wifiBackgroundConnected (green)
  },
  connecting: {
    backgroundColor: '#FF9500', // Orange for connecting state
  },
});
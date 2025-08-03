import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAppDispatch, useAppSelector } from '@/store';
import { fetchWifiInfo, connectToWifi, disconnectFromWifi, clearError, updateConnectionStatus } from '@/store/slices/wifiSlice';
import { WifiConnectionButton, InfoRow, WifiSupportRow } from '@/components';
import { WifiSupportType, WifiConnectionStatus, WifiSupportOption } from '@/types';
import { COLORS, PADDING, CARD_STYLES, TYPOGRAPHY, ICON_SIZES } from '@/constants/homeConstants';
import { strings } from '@/constants/strings';
import WifiService from '@/services/wifi/WifiService';

export const WifiConnectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector((state) => state.auth);
  const { wifiInfo, connectionStatus, isLoading, error } = useAppSelector((state) => state.wifi);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError());
    
    // Fetch WiFi info on mount - require valid lease ID
    console.log('📶 WifiConnectionScreen - User object:', user);
    console.log('📶 WifiConnectionScreen - Current lease ID:', user?.currentLeaseId);
    
    if (user?.currentLeaseId) {
      console.log('📶 WifiConnectionScreen - Fetching WiFi info for lease ID:', user.currentLeaseId);
      dispatch(fetchWifiInfo(user.currentLeaseId));
    } else {
      console.warn('📶 WifiConnectionScreen - No current lease ID available for user');
      // Don't call fetchWifiInfo without a lease ID
    }

    // Subscribe to WiFi service status changes
    const unsubscribe = WifiService.addConnectionStatusListener((status) => {
      // Update Redux store when service status changes
      console.log('📶 WifiConnectionScreen - Status update from service:', status);
      dispatch(updateConnectionStatus(status));
    });

    return unsubscribe;
  }, [dispatch, user?.currentLeaseId]);

  const handleWifiButtonPress = async () => {
    if (!wifiInfo) {
      Alert.alert('Error', 'No WiFi information available');
      return;
    }

    try {
      if (connectionStatus === WifiConnectionStatus.CONNECTED) {
        dispatch(disconnectFromWifi());
      } else {
        dispatch(connectToWifi());
      }
    } catch (error) {
      console.error('WiFi button press error:', error);
    }
  };

  const handleQRCodePress = () => {
    setShowQRCode(true);
  };

  const handleSupportPress = async (type: WifiSupportType, value: string) => {
    try {
      switch (type) {
        case WifiSupportType.TEXT:
          await WifiService.openSupportText(value);
          break;
        case WifiSupportType.EMAIL:
          await WifiService.openSupportEmail(value);
          break;
        case WifiSupportType.WEBSITE:
          await WifiService.openSupportWebsite(value);
          break;
      }
    } catch (error) {
      Alert.alert('Error', `Could not open ${type} app`);
    }
  };

  const getSupportOptions = (): WifiSupportOption[] => {
    if (!wifiInfo) return [];
    
    return [
      {
        type: WifiSupportType.TEXT,
        title: strings.wifi.support.text,
        value: wifiInfo.supportPhoneNumber,
        icon: 'chatbubble-outline',
        urlPrefix: 'sms:',
      },
      {
        type: WifiSupportType.EMAIL,
        title: strings.wifi.support.email,
        value: wifiInfo.supportEmail,
        icon: 'mail-outline',
        urlPrefix: 'mailto:',
      },
      {
        type: WifiSupportType.WEBSITE,
        title: 'Support Website', // Keep this one as is, since it's not in iOS strings
        value: wifiInfo.supportWebsite,
        icon: 'globe-outline',
        urlPrefix: 'https://',
      },
    ];
  };

  const qrCodeData = wifiInfo ? WifiService.generateQRCodeData(wifiInfo) : '';

  // Show error state
  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            if (user?.currentLeaseId) {
              dispatch(fetchWifiInfo(user.currentLeaseId));
            }
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show no info state (matching iOS)
  if (!wifiInfo && !isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        
        {/* Navigation Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={ICON_SIZES.large} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{strings.wifi.title}</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, styles.noInfoCard]}>
            <Text style={styles.noInfoTitle}>{strings.wifi.support.title}</Text>
            <Text style={styles.noInfoDescription}>
              {strings.wifi.noInfo.subtitle}
            </Text>
            
            {/* Default support contact */}
            <WifiSupportRow
              option={{
                type: WifiSupportType.TEXT,
                title: strings.wifi.support.text,
                value: '567-406-0378',
                icon: 'chatbubble-outline',
                urlPrefix: 'sms:',
              }}
              onPress={handleSupportPress}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={ICON_SIZES.large} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.wifi.title}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with CBX Logo and WiFi Button */}
        <View style={styles.headerContainer}>
          <View style={styles.cbxLogoContainer}>
            <Text style={styles.cbxLogoText}>CBX</Text>
          </View>
          <WifiConnectionButton
            status={connectionStatus}
            onPress={handleWifiButtonPress}
            isLoading={isLoading}
          />
        </View>

        {/* WiFi Information Card */}
        {wifiInfo && (
          <View style={styles.card}>
            <TouchableOpacity style={styles.qrButton} onPress={handleQRCodePress}>
              <Icon name="information-circle" size={ICON_SIZES.large} color={COLORS.textPrimary} />
            </TouchableOpacity>
            
            <InfoRow title={strings.wifi.info.network} value={wifiInfo.ssid} />
            <InfoRow title={strings.wifi.info.password} value={wifiInfo.password} />
            
            <View style={styles.divider} />
            
            <InfoRow 
              title={strings.wifi.info.unit} 
              value={strings.wifi.info.unitNumber(wifiInfo.unit)}
              isCopyEnabled={false}
            />
          </View>
        )}

        {/* Support Card */}
        {wifiInfo && (
          <View style={styles.card}>
            <Text style={styles.supportTitle}>{strings.wifi.support.title}</Text>
            <Text style={styles.supportDescription}>
              {strings.wifi.support.subtitle}
            </Text>
            
            {getSupportOptions().map((option, index) => (
              <WifiSupportRow
                key={index}
                option={option}
                onPress={handleSupportPress}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* QR Code Modal */}
      {showQRCode && wifiInfo && (
        <View style={styles.qrModal}>
          <View style={styles.qrModalContent}>
            <Text style={styles.qrModalTitle}>WiFi Connection String</Text>
            <View style={styles.qrDataContainer}>
              <Text style={styles.qrDataText}>{qrCodeData}</Text>
            </View>
            <Text style={styles.qrDataHint}>
              Copy this string to manually configure your WiFi connection
            </Text>
            <TouchableOpacity
              style={styles.qrModalCloseButton}
              onPress={() => setShowQRCode(false)}
            >
              <Text style={styles.qrModalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING.padding4,
    paddingVertical: PADDING.padding3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  backButton: {
    padding: PADDING.padding2,
    marginRight: PADDING.padding2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: PADDING.padding4,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: PADDING.padding5,
  },
  cbxLogoContainer: {
    width: 75, // iOS: multiplier: 2.35
    height: 32, // iOS: .Padding.padding8
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING.padding10,
  },
  cbxLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  card: {
    ...CARD_STYLES,
    marginBottom: PADDING.padding5,
    position: 'relative',
  },
  qrButton: {
    position: 'absolute',
    top: PADDING.padding4,
    right: PADDING.padding4,
    width: 40, // iOS: .Icon.background
    height: 40,
    borderRadius: 12, // iOS: .Icon.backgroundRadius
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginVertical: PADDING.padding4,
  },
  supportTitle: {
    fontSize: 27, // iOS: .secondary(withSize: 27)
    fontWeight: '600',
    color: COLORS.textPrimary,
    paddingHorizontal: PADDING.padding4,
    paddingTop: PADDING.padding4,
  },
  supportDescription: {
    fontSize: 15, // iOS: .avenir400(withSize: 15)
    fontWeight: '400',
    color: COLORS.textPrimary,
    paddingHorizontal: PADDING.padding4,
    paddingBottom: PADDING.padding5,
  },
  
  // No Info State
  noInfoCard: {
    marginTop: PADDING.padding5,
  },
  noInfoTitle: {
    fontSize: 27,
    fontWeight: '600',
    color: COLORS.textPrimary,
    paddingHorizontal: PADDING.padding4,
    paddingTop: PADDING.padding4,
  },
  noInfoDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.textPrimary,
    paddingHorizontal: PADDING.padding4,
    paddingBottom: PADDING.padding5,
    lineHeight: 20,
  },

  // Error State
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: PADDING.padding4,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.red,
    textAlign: 'center',
    marginBottom: PADDING.padding4,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: PADDING.padding6,
    paddingVertical: PADDING.padding3,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },

  // QR Code Modal
  qrModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: PADDING.padding6,
    alignItems: 'center',
    marginHorizontal: PADDING.padding4,
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: PADDING.padding4,
  },
  qrDataContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: PADDING.padding4,
    marginBottom: PADDING.padding3,
    width: '100%',
  },
  qrDataText: {
    fontSize: 12,
    fontFamily: 'Courier',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 16,
  },
  qrDataHint: {
    fontSize: 12,
    color: COLORS.textSubtitle,
    textAlign: 'center',
    marginBottom: PADDING.padding4,
  },
  qrModalCloseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: PADDING.padding6,
    paddingVertical: PADDING.padding3,
    borderRadius: 8,
    marginTop: PADDING.padding4,
  },
  qrModalCloseText: {
    color: 'white',
    fontWeight: '600',
  },
});
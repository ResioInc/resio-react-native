import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '@/navigation/RootNavigator';
import {
  COLORS,
  PADDING,
  TYPOGRAPHY,
  ICON_SIZES,
} from '@/constants/homeConstants';

type WebViewRouteProp = RouteProp<RootStackParamList, 'WebView'>;

export const WebViewScreen: React.FC = () => {
  const route = useRoute<WebViewRouteProp>();
  const navigation = useNavigation();
  const { url, title } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Set navigation title and add share button like iOS LocalWebViewController
  React.useEffect(() => {
    navigation.setOptions({ 
      title,
      headerRight: () => (
        <TouchableOpacity onPress={handleOpenInBrowser} style={styles.headerButton}>
          <Icon name="share-outline" size={ICON_SIZES.medium} color={COLORS.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, title]);

  // Format URL like iOS LocalWebView (add https:// if missing)
  const formatUrl = (urlString: string): string => {
    if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
      return urlString;
    }
    // Default to https for security
    return `https://${urlString}`;
  };

  const handleOpenInBrowser = async () => {
    try {
      const formattedUrl = formatUrl(url);
      const supported = await Linking.canOpenURL(formattedUrl);
      if (supported) {
        await Linking.openURL(formattedUrl);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open URL');
    }
  };

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={ICON_SIZES.jumbo} color={COLORS.red} />
          <Text style={styles.errorTitle}>Unable to Load Page</Text>
          <Text style={styles.errorText}>Please check your internet connection and try again.</Text>
          <TouchableOpacity style={styles.button} onPress={handleOpenInBrowser}>
            <Text style={styles.buttonText}>Open in Browser</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
      <WebView
        source={{ uri: formatUrl(url) }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: PADDING.padding8,
  },
  errorTitle: {
    ...TYPOGRAPHY.sectionTitle,
    color: COLORS.textPrimary,
    marginTop: PADDING.padding4,
    marginBottom: PADDING.padding2,
    textAlign: 'center',
  },
  errorText: {
    ...TYPOGRAPHY.cardDescription,
    color: COLORS.textSubtitle,
    textAlign: 'center',
    marginBottom: PADDING.padding8,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: PADDING.padding6,
    paddingVertical: PADDING.padding3,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerButton: {
    paddingHorizontal: PADDING.padding2,
    paddingVertical: PADDING.padding1,
  },
});
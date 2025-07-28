import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface LoginHeroHeaderProps {
  title: string;
  subtitle: string;
}

export const LoginHeroHeader: React.FC<LoginHeroHeaderProps> = ({
  title,
  subtitle,
}) => {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Fallback design if images fail to load
  if (imageError) {
    return (
      <View style={[styles.container, styles.fallbackContainer]}>
        <View style={styles.contentContainer}>
          {!logoError && (
            <Image
              source={require('@/assets/images/logo_horizontal_white.png')}
              style={styles.logo}
              resizeMode="contain"
              onError={() => setLogoError(true)}
            />
          )}
          <Text style={[styles.titleLabel, styles.fallbackTitle]}>{title}</Text>
          <Text style={[styles.subtitleLabel, styles.fallbackSubtitle]}>{subtitle}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/hero_login.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
        onError={() => setImageError(true)}
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <Image
              source={require('@/assets/images/logo_horizontal_white.png')}
              style={styles.logo}
              resizeMode="contain"
              onError={() => setLogoError(true)}
            />
            <Text style={styles.titleLabel}>{title}</Text>
            <Text style={styles.subtitleLabel}>{subtitle}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for text readability
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, // Account for status bar
    paddingBottom: 20,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: width * 0.6, // 60% of screen width
    height: 60,
    marginBottom: 16,
  },
  titleLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitleLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Fallback styles
  fallbackContainer: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  fallbackTitle: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  fallbackSubtitle: {
    color: '#FFFFFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 
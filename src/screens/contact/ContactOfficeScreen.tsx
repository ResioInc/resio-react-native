import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from '@/store';
import { RootStackParamList } from '@/navigation/RootNavigator';
import {
  COLORS,
  PADDING,
  CARD_STYLES,
  TYPOGRAPHY,
  ICON_SIZES,
} from '@/constants/homeConstants';
import { homeStrings } from '@/constants';
import { formatAsPhoneNumber } from '@/utils/utils';

type ContactOfficeNavigationProp = StackNavigationProp<RootStackParamList, 'ContactOffice'>;

interface ContactInfoItemProps {
  icon: string;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  isLast?: boolean;
}

const ContactInfoItem: React.FC<ContactInfoItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = false,
  isLast = false,
}) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component
      style={[styles.infoItem, !onPress && styles.infoItemDisabled]}
      onPress={onPress}
      // @ts-ignore - TouchableOpacity props
      disabled={!onPress}
    >
      <View style={styles.infoIconContainer}>
        <Icon name={icon} size={ICON_SIZES.medium} color={COLORS.primary} />
      </View>
      <View style={styles.infoContent}>
        {title && <Text style={styles.infoTitle}>{title}</Text>}
        {subtitle && <Text style={styles.infoSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && (
        <Icon name="chevron-forward" size={ICON_SIZES.small} color={COLORS.separator} />
      )}
      {/* Separator like iOS ContactOfficeInfoViewCell */}
      {!isLast && <View style={styles.separator} />}
    </Component>
  );
};

export const ContactOfficeScreen: React.FC = () => {
  const navigation = useNavigation<ContactOfficeNavigationProp>();
  const { user } = useAppSelector((state) => state.auth);
  const property = user?.property;

  // Set navigation title like iOS
  React.useEffect(() => {
    navigation.setOptions({ 
      title: homeStrings.propertyInfo.title 
    });
  }, [navigation]);

  const handleWebsitePress = (url: string) => {
    navigation.navigate('WebView', { url, title: url });
  };

  const handlePhonePress = (phone: string) => {
    Alert.alert(
      '',
      '',
      [
        {
          text: 'Call', // iOS: "phone.call".localized
          onPress: () => {
            const phoneUrl = `tel:${phone}`;
            Linking.canOpenURL(phoneUrl).then((supported) => {
              if (supported) {
                Linking.openURL(phoneUrl);
              }
            });
          },
        },
        {
          text: 'Text', // iOS: "phone.text".localized
          onPress: () => {
            const smsUrl = `sms:${phone}`;
            Linking.canOpenURL(smsUrl).then((supported) => {
              if (supported) {
                Linking.openURL(smsUrl);
              }
            });
          },
        },
        {
          text: 'Cancel', // iOS: "alert.cancel".localized
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleEmailPress = (email: string) => {
    const emailUrl = `mailto:${email}`;
    Linking.canOpenURL(emailUrl).then((supported) => {
      if (supported) {
        Linking.openURL(emailUrl);
      }
    });
  };

  const handleHandbookPress = (url: string) => {
    navigation.navigate('WebView', { url, title: homeStrings.faqs.title });
  };

  const handleResidentHandbookPress = () => {
    // Navigate to FAQ WebView (matching iOS showFAQ)
    // Use actual FAQ URL from property data (property.faqUrl) or handbook website
    const faqUrl = property?.faqUrl || property?.websites?.handbook || 'https://example.com/faq';
    navigation.navigate('WebView', { 
      url: faqUrl, 
      title: homeStrings.faqs.title 
    });
  };

  // Debug: Log the property data structure
  React.useEffect(() => {
    console.log('ContactOffice - Full user object:', JSON.stringify(user, null, 2));
    console.log('ContactOffice - Property object:', JSON.stringify(property, null, 2));
    if (property?.address) {
      console.log('ContactOffice - Address object:', JSON.stringify(property.address, null, 2));
    } else {
      console.log('ContactOffice - Address is undefined/null');
    }
  }, [user, property]);

  // Phone formatting function imported from utils

  // Format address string like iOS - API returns address as string!
  const formatAddress = (address: any): string | null => {
    if (!address) return null;
    
    // API returns address as a string already formatted
    if (typeof address === 'string') {
      return address; // Address is already a formatted string: "521 Red Drew Ave Tuscaloosa, AL 35401 US"
    }
    
    // Fallback: If it's an object, try to construct the address (legacy support)
    const street = address.street || address.address1 || address.line1;
    const city = address.city;
    const state = address.state || address.stateCode;
    const zipCode = address.zipCode || address.zip || address.postalCode;
    
    if (street && city && state && zipCode) {
      return `${street}, ${city}, ${state} ${zipCode}`;
    }
    
    return null;
  };

  if (!property) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No property information available</Text>
        </View>
      </View>
    );
  }

  const formattedAddress = formatAddress(property.address);

  // Build sections array like iOS ContactOfficeView.updateSections()
  const buildSections = () => {
    const sections = [];
    
    // Header - if property has photo
    if (property.photoUrl) {
      sections.push({ type: 'header' });
    }
    // Website - if property has websites.home (iOS: property?.websites?.home)
    if (property.websites?.home) {
      sections.push({ 
        type: 'website', 
        icon: 'globe-outline',
        title: 'Website', // iOS: "home.contact_office.website".localized
        onPress: () => handleWebsitePress(property.websites!.home!),
        showArrow: true
      });
    }
    
    // Phone - if property has phone
    if (property.phone) {
      sections.push({ 
        type: 'phone', 
        icon: 'call-outline',
        title: formatAsPhoneNumber(property.phone), // iOS: property?.phone?.formatAsPhoneNumber()
        onPress: () => handlePhonePress(property.phone!),
        showArrow: true
      });
    }
    
    // Email - if property has email
    if (property.email) {
      sections.push({ 
        type: 'email', 
        icon: 'mail-outline',
        title: property.email,
        onPress: () => handleEmailPress(property.email!),
        showArrow: true
      });
    }
    
    // Address - if property has address (no arrow, non-interactive)
    if (formattedAddress) {
      sections.push({ 
        type: 'address', 
        icon: 'location-outline',
        title: formattedAddress,
        showArrow: false
      });
    }
    
    // Handbook - if property has websites.handbook or faqUrl
    if (property.websites?.handbook || property.faqUrl) {
      sections.push({ 
        type: 'handbook', 
        icon: 'book-outline',
        title: 'Resident Handbook', // iOS: "home.contact_office.handbook".localized
        onPress: () => handleResidentHandbookPress(),
        showArrow: true
      });
    }
    
    return sections;
  };

  const sections = buildSections();

  return (
    <View style={styles.container}>
      {sections.map((section, index) => {
        if (section.type === 'header') {
          return (
            <View key={section.type} style={styles.headerImageContainer}>
              <Image
                source={{ uri: property.photoUrl }}
                style={styles.headerImage}
                resizeMode="cover"
              />
            </View>
          );
        }
        
        return (
          <ContactInfoItem
            key={section.type}
            icon={section.icon!}
            title={section.title!}
            onPress={section.onPress}
            showArrow={section.showArrow!}
            isLast={index === sections.length - 1}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // iOS: .Background.primary (#F2F2F7)
  },
  headerImageContainer: {
    height: 300, // Same height as iOS ContactOfficeHeaderViewCell
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background, // iOS: .Background.primary
    paddingVertical: 20, // iOS: .Padding.padding5 (top/bottom)
    paddingHorizontal: PADDING.padding4, // iOS: .Padding.padding4 (left/right)
    position: 'relative',
  },
  infoItemDisabled: {
    // Remove opacity change for non-interactive items
  },
  infoIconContainer: {
    width: 24, // iOS: .Padding.padding6
    height: 24, // iOS: .Padding.padding6
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: PADDING.padding3, // iOS: .Padding.padding3
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13, // iOS: .primary(withSize: 13.0)
    fontWeight: '400', // iOS: .primary font
    color: COLORS.textPrimary, // iOS: .Text.primary
  },
  infoSubtitle: {
    ...TYPOGRAPHY.cardDescription,
    color: COLORS.textSubtitle,
    fontSize: 14,
    marginTop: PADDING.paddingHalf,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth, // iOS: .BorderWidth.borderSmallest
    backgroundColor: COLORS.separator, // iOS: .Separator.primary
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: PADDING.padding8,
  },
  emptyText: {
    ...TYPOGRAPHY.cardDescription,
    color: COLORS.textSubtitle,
    textAlign: 'center',
  },
});
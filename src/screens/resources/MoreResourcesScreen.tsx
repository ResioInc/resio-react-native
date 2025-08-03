import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@/store';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { ResourceCard } from '@/components/home/ResourceCard';
import { PropertyInfoCard } from '@/components/home/PropertyInfoCard';
import { CommunityResource } from '@/types';
import {
  COLORS,
  PADDING,
  TYPOGRAPHY,
  SCREEN_WIDTH,
} from '@/constants/homeConstants';
import { homeStrings } from '@/constants/strings';

// Background images for PropertyInfoCards
const contactOfficeBackground = require('@/assets/images/contact_office.jpg');
const residentHandbookBackground = require('@/assets/images/resident_handbook.jpg');

type MoreResourcesNavigationProp = StackNavigationProp<RootStackParamList, 'MoreResources'>;

export const MoreResourcesScreen: React.FC = () => {
  const navigation = useNavigation<MoreResourcesNavigationProp>();
  const { resources } = useAppSelector((state) => state.home);
  const { user } = useAppSelector((state) => state.auth);

  // Filter resources with position > 3 (matching iOS logic)
  const moreResources = resources
    .filter((resource) => resource.position > 3)
    .sort((a, b) => a.position - b.position);

  const handleResourcePress = (resource?: CommunityResource) => {
    if (resource) {
      navigation.navigate('ResourceDetail', { resource });
    }
  };

  const handleContactOfficePress = () => {
    // Navigate to Contact Office screen (matching iOS showContactOffice)
    navigation.navigate('ContactOffice');
  };

  const handleResidentHandbookPress = () => {
    // Navigate to FAQ WebView (matching iOS showFAQ)
    // Use actual FAQ URL from user data (property.faqUrl) or handbook website
    const property = user?.property;
    const faqUrl = property?.faqUrl || property?.websites?.handbook || 'https://example.com/faq';
    navigation.navigate('WebView', { 
      url: faqUrl, 
      title: homeStrings.faqs.title 
    });
  };

  const renderResourceGrid = () => {
    if (moreResources.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No additional resources available</Text>
        </View>
      );
    }

    // Group resources into rows of 2 (matching iOS layout)
    const rows: CommunityResource[][] = [];
    for (let i = 0; i < moreResources.length; i += 2) {
      rows.push(moreResources.slice(i, i + 2));
    }

    return (
      <View style={styles.resourcesContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.resourceRow}>
            {row.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isInMoreResourcesScreen={true}
                onPress={handleResourcePress}
              />
            ))}
            {/* Add spacer if only one item in row */}
            {row.length === 1 && <View style={styles.resourceSpacer} />}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Property Info Cards (Contact Office & Resident Handbook) - matching iOS header */}
      <View style={styles.propertyInfoSection}>
        <View style={styles.propertyInfoRow}>
          <PropertyInfoCard
            title={homeStrings.propertyInfo.contactOffice}
            iconName="chatbubble-outline"
            backgroundImage={contactOfficeBackground}
            onPress={handleContactOfficePress}
          />
          <View style={styles.cardSpacer} />
          <PropertyInfoCard
            title={homeStrings.propertyInfo.residentHandbook}
            iconName="help-circle-outline"
            backgroundImage={residentHandbookBackground}
            onPress={handleResidentHandbookPress}
          />
        </View>
      </View>
      
      {renderResourceGrid()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: PADDING.padding4,
  },
  title: {
    ...TYPOGRAPHY.sectionTitle,
    color: COLORS.textPrimary,
    marginBottom: PADDING.paddingHalf,
  },
  description: {
    ...TYPOGRAPHY.cardDescription,
    color: COLORS.textSubtitle,
    marginBottom: PADDING.padding4,
  },
  resourcesContainer: {
    marginBottom: PADDING.padding4,
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PADDING.padding4,
  },
  resourceSpacer: {
    width: (SCREEN_WIDTH - PADDING.padding4 * 2 - PADDING.padding4) / 2, // Match ResourceCard width exactly
  },
  emptyContainer: {
    alignItems: 'center',
    padding: PADDING.padding8,
  },
  emptyText: {
    ...TYPOGRAPHY.cardDescription,
    color: COLORS.textSubtitle,
    textAlign: 'center',
  },
  propertyInfoSection: {
    marginBottom: PADDING.padding4,
  },
  propertyInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSpacer: {
    width: PADDING.padding4, // Spacing between the two cards
  },
});
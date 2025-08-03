import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { getCommunityResourceIcon, CommunityResourceIconColors } from '@/constants/communityResourceIcons';
import {
  COLORS,
  PADDING,
  CARD_STYLES,
  TYPOGRAPHY,
  ICON_SIZES,
} from '@/constants/homeConstants';
import { homeStrings } from '@/constants/strings';

type ResourceDetailRouteProp = RouteProp<RootStackParamList, 'ResourceDetail'>;

export const ResourceDetailScreen: React.FC = () => {
  const route = useRoute<ResourceDetailRouteProp>();
  const navigation = useNavigation();
  const { resource } = route.params;

  // Set navigation title like iOS (resource.name becomes the title)
  React.useEffect(() => {
    const title = resource.name || resource.title || 'Resource';
    navigation.setOptions({ title });
  }, [navigation, resource]);

  const handleUrlPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open URL');
    }
  };

  const handleFilePress = async (fileUrl: string, fileName: string) => {
    try {
      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert('Error', `Cannot open ${fileName}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to open ${fileName}`);
    }
  };

  const iconName = getCommunityResourceIcon(resource.icon || resource.iconName);
  const title = resource.name || resource.title || '';
  const description = resource.description || '';

  const renderContentSection = (sectionTitle: string, content: React.ReactNode) => (
    <View style={styles.contentSection}>
      <Text style={styles.contentSectionTitle}>{sectionTitle}</Text>
      {content}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Main Details Card */}
      <View style={styles.detailsCard}>
        <View style={[styles.icon, { backgroundColor: CommunityResourceIconColors.secondaryBackground }]}>
          <Icon 
            name={iconName} 
            size={ICON_SIZES.large} 
            color={CommunityResourceIconColors.primary} 
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Information Section */}
      {resource.content && (
        renderContentSection(
          homeStrings.communityResources.detail.info.title,
          <Text style={styles.contentText}>{resource.content}</Text>
        )
      )}

      {/* Website Section */}
      {resource.url && (
        renderContentSection(
          homeStrings.communityResources.detail.website.title,
          <TouchableOpacity onPress={() => handleUrlPress(resource.url!)}>
            <Text style={styles.linkText}>{resource.url}</Text>
          </TouchableOpacity>
        )
      )}

      {/* Files Section */}
      {resource.files && resource.files.length > 0 && (
        renderContentSection(
          homeStrings.communityResources.detail.files.title,
          <View style={styles.filesContainer}>
            {resource.files.map((file) => (
              <TouchableOpacity
                key={file.id}
                style={styles.fileItem}
                onPress={() => handleFilePress(file.fileUrl, file.label)}
              >
                <Text style={styles.linkText}>{file.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )
      )}
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
  detailsCard: {
    ...CARD_STYLES,
    backgroundColor: COLORS.cardBackground,
    padding: PADDING.padding4,
    alignItems: 'flex-start',
    marginBottom: PADDING.padding4,
  },
  icon: {
    width: ICON_SIZES.large,
    height: ICON_SIZES.large,
    borderRadius: ICON_SIZES.large / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING.padding2,
  },
  title: {
    ...TYPOGRAPHY.sectionTitle,
    color: COLORS.textPrimary,
    marginBottom: PADDING.paddingHalf,
  },
  description: {
    ...TYPOGRAPHY.cardDescription,
    color: COLORS.textSubtitle,
    fontSize: 14,
  },
  contentSection: {
    marginBottom: PADDING.padding4,
  },
  contentSectionTitle: {
    ...TYPOGRAPHY.cardTitle,
    color: COLORS.textSubtitle,
    fontSize: 13,
    marginBottom: PADDING.padding2,
  },
  contentText: {
    ...TYPOGRAPHY.cardDescription,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  linkText: {
    ...TYPOGRAPHY.cardDescription,
    color: '#007AFF', // iOS link color
    fontSize: 14,
    textDecorationLine: 'none', // iOS doesn't underline by default
  },
  filesContainer: {
    gap: PADDING.padding1,
  },
  fileItem: {
    marginBottom: PADDING.padding1,
  },
});
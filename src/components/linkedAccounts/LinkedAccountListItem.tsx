import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinkedAccount } from '@/types';
import { COLORS, PADDING, CARD_STYLES } from '@/constants/homeConstants';
import { linkedAccountsStrings, formatString } from '@/constants/strings';
import { getDisplayName } from '@/utils/utils';

interface LinkedAccountListItemProps {
  linkedAccount: LinkedAccount;
  onRemove: (linkedAccount: LinkedAccount) => void;
}

export const LinkedAccountListItem: React.FC<LinkedAccountListItemProps> = ({ 
  linkedAccount, 
  onRemove 
}) => {
  // Format connected since date like iOS
  const getConnectedSinceText = () => {
    if (!linkedAccount.connectedSince) return null;
    
    try {
      // Parse the date string (assuming ISO format from API)
      const date = new Date(linkedAccount.connectedSince);
      const dateString = date.toLocaleDateString();
      return formatString(linkedAccountsStrings.cell.connectedSinceFormatted, dateString);
    } catch (error) {
      return null;
    }
  };

  const handleRemovePress = () => {
    // iOS-style confirmation alert
    Alert.alert(
      linkedAccountsStrings.confirmDelete.title,
      linkedAccountsStrings.confirmDelete.description,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemove(linkedAccount),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.card}>
      {/* Main horizontal stack - matches iOS mainStackView */}
      <View style={styles.mainStack}>
        {/* Avatar Circle - matches iOS iconView (66x66) */}
        <View style={styles.avatarContainer}>
          {linkedAccount.user.photoUrl ? (
            <Image 
              source={{ uri: linkedAccount.user.photoUrl }} 
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Icon name="person" size={32} color={COLORS.circleIconPrimaryTint} />
          )}
        </View>

        {/* Right content stack - matches iOS rightContentStackView */}
        <View style={styles.rightContentStack}>
          {/* Label stack - matches iOS labelStackView */}
          <View style={styles.labelStack}>
            <Text style={styles.nameLabel}>{getDisplayName(linkedAccount.user.firstName, linkedAccount.user.lastName) || linkedAccount.user.email}</Text>
            <Text style={styles.descriptionLabel}>
              {linkedAccountsStrings.cell.sender}
            </Text>
          </View>

          {/* Bottom stack - matches iOS bottomStackView */}
          <View style={styles.bottomStack}>
            {getConnectedSinceText() && (
              <Text style={styles.dateLabel}>{getConnectedSinceText()}</Text>
            )}
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={handleRemovePress}
              accessibilityRole="button"
              accessibilityLabel={linkedAccountsStrings.cell.removeTitle}
            >
              <Text style={styles.removeButtonText}>
                {linkedAccountsStrings.cell.removeTitle}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...CARD_STYLES, // iOS CardTableViewCell base styling
    marginHorizontal: PADDING.padding4,
    marginBottom: PADDING.padding4,
  },
  mainStack: {
    flexDirection: 'row', // iOS: axis = .horizontal
    alignItems: 'flex-start', // iOS: alignment = .top
    padding: PADDING.padding5, // iOS: .Padding.padding5
    flex: 1,
  },
  avatarContainer: {
    width: 66, // iOS: pinWidthTo(66)
    height: 66, // iOS: pinAspectRatioTo(1.0)
    borderRadius: 33,
    backgroundColor: COLORS.circleIconBackground, // iOS: .CircleIcon.background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: PADDING.padding5, // iOS: spacing = .Padding.padding5
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
  },
  rightContentStack: {
    flex: 1,
    flexDirection: 'column', // iOS: axis = .vertical
    alignItems: 'flex-start', // iOS: alignment = .leading
    justifyContent: 'space-between',
    minHeight: 66, // Match avatar height for consistent spacing
  },
  labelStack: {
    flexDirection: 'column', // iOS: axis = .vertical
    alignItems: 'flex-start',
    marginBottom: PADDING.padding4, // iOS: spacing = .Padding.padding4
  },
  nameLabel: {
    fontSize: 16, // iOS: .Connections.primary
    fontWeight: '600',
    color: COLORS.textPrimary, // iOS: .Text.primary
    marginBottom: 2,
  },
  descriptionLabel: {
    fontSize: 13, // iOS: .Connections.secondary
    fontWeight: '400',
    color: COLORS.textSubtitle, // iOS: .Text.subtitle
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  bottomStack: {
    flexDirection: 'column', // iOS: axis = .vertical
    alignItems: 'flex-start',
  },
  dateLabel: {
    fontSize: 12, // iOS: .secondary(withSize: 12)
    fontWeight: '400',
    color: COLORS.textSubtitle,
    marginBottom: PADDING.padding1,
  },
  removeButton: {
    width: 150, // iOS: widthAnchor.constraint(equalToConstant: 150)
    height: 40, // iOS: heightAnchor.constraint(equalToConstant: 40)
    justifyContent: 'center',
    alignItems: 'flex-start', // iOS: contentHorizontalAlignment = .left
  },
  removeButtonText: {
    fontSize: 13, // iOS: .Connections.secondary
    fontWeight: '400',
    color: COLORS.primary, // iOS: .Button.primary
  },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Invitation } from '@/types/home';
import { COLORS, PADDING, CARD_STYLES } from '@/constants/homeConstants';
import { invitationsStrings } from '@/constants/strings';

interface InvitationListItemProps {
  invitation: Invitation;
  onAccept: (invitation: Invitation) => void;
  onDecline: (invitation: Invitation) => void;
}

export const InvitationListItem: React.FC<InvitationListItemProps> = ({ 
  invitation, 
  onAccept,
  onDecline 
}) => {

  const handleAcceptPress = () => {
    onAccept(invitation);
  };

  const handleDeclinePress = () => {
    // iOS-style confirmation alert
    const title = invitation.sender 
      ? invitationsStrings.confirmCancel.title 
      : invitationsStrings.confirmDecline.title;
    const description = invitation.sender 
      ? invitationsStrings.confirmCancel.description 
      : invitationsStrings.confirmDecline.description;

    Alert.alert(
      title,
      description,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: invitation.sender ? 'Cancel Invitation' : 'Decline',
          style: 'destructive',
          onPress: () => onDecline(invitation),
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
          {invitation.user.photoUrl ? (
            <Image 
              source={{ uri: invitation.user.photoUrl }} 
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
            <Text style={styles.nameLabel}>{invitation.user.email}</Text>
            <Text style={styles.descriptionLabel}>
              {invitation.sender 
                ? invitationsStrings.cell.didInvite 
                : invitationsStrings.cell.wasInvited}
            </Text>
          </View>

          {/* Action buttons stack */}
          <View style={styles.buttonStack}>
            {/* Accept button - only show for received invitations (matching iOS logic) */}
            {!invitation.sender && (
              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={handleAcceptPress}
                accessibilityRole="button"
                accessibilityLabel={invitationsStrings.cell.ctaTitle}
              >
                <Text style={styles.acceptButtonText}>
                  {invitationsStrings.cell.ctaTitle}
                </Text>
              </TouchableOpacity>
            )}
            
            {/* Decline/Cancel button */}
            <TouchableOpacity 
              style={styles.declineButton}
              onPress={handleDeclinePress}
              accessibilityRole="button"
              accessibilityLabel={invitation.sender ? invitationsStrings.cell.cancelTitle : invitationsStrings.cell.declineTitle}
            >
              <Text style={styles.declineButtonText}>
                {invitation.sender ? invitationsStrings.cell.cancelTitle : invitationsStrings.cell.declineTitle}
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
  buttonStack: {
    flexDirection: 'column', // iOS: axis = .vertical
    alignItems: 'flex-start',
    gap: PADDING.padding1, // Small spacing between buttons
  },
  acceptButton: {
    width: 150, // iOS: widthAnchor.constraint(equalToConstant: 150)
    height: 40, // iOS: heightAnchor.constraint(equalToConstant: 40)
    backgroundColor: COLORS.primary, // iOS: CSButtonPrimary
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 13, // iOS: .Connections.secondary
    fontWeight: '600',
    color: 'white',
  },
  declineButton: {
    width: 150, // iOS: widthAnchor.constraint(equalToConstant: 150)
    height: 40, // iOS: heightAnchor.constraint(equalToConstant: 40)
    justifyContent: 'center',
    alignItems: 'flex-start', // iOS: contentHorizontalAlignment = .left
  },
  declineButtonText: {
    fontSize: 13, // iOS: .Connections.secondary
    fontWeight: '400',
    color: COLORS.primary, // iOS: .Button.primary
  },
});
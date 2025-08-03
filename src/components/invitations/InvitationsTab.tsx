import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from '@/store';
import { InvitationListItem } from './InvitationListItem';
import { EmptyState } from '@/components/common/EmptyState';
import { Invitation } from '@/types/home';
import { COLORS, PADDING, ICON_SIZES } from '@/constants/homeConstants';
import { invitationsStrings } from '@/constants/strings';
import { acceptInvitation, declineInvitation, fetchInvitations } from '@/store/slices/invitationsSlice';

interface InvitationsTabProps {
  onSendInvite: () => void;
}

export const InvitationsTab: React.FC<InvitationsTabProps> = ({ onSendInvite }) => {
  const dispatch = useAppDispatch();
  const { invitations, isLoading, error } = useAppSelector((state) => state.invitations);

  // Load invitations when component mounts
  useEffect(() => {
    dispatch(fetchInvitations());
  }, [dispatch]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    dispatch(fetchInvitations());
  }, [dispatch]);

  // Handle accept invitation
  const handleAcceptInvitation = useCallback(async (invitation: Invitation) => {
    try {
      await dispatch(acceptInvitation(invitation.id)).unwrap();
      // Success - invitation accepted and removed from list
    } catch (error) {
      // Show error alert if accept fails
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to accept invitation',
        [{ text: 'OK', style: 'default' }],
        { cancelable: true }
      );
    }
  }, [dispatch]);

  // Handle decline invitation
  const handleDeclineInvitation = useCallback(async (invitation: Invitation) => {
    try {
      await dispatch(declineInvitation({ invitationId: invitation.id, sender: invitation.sender })).unwrap();
      // Success - invitation declined and removed from list
    } catch (error) {
      // Show error alert if decline fails
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to decline invitation',
        [{ text: 'OK', style: 'default' }],
        { cancelable: true }
      );
    }
  }, [dispatch]);

  // Render individual invitation item
  const renderInvitationItem = ({ item }: { item: Invitation }) => (
    <InvitationListItem 
      invitation={item} 
      onAccept={handleAcceptInvitation}
      onDecline={handleDeclineInvitation}
    />
  );

  // Render header with send invite button - matches iOS CTATableHeaderView
  const renderListHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.sendInviteCard}
        onPress={onSendInvite}
        accessibilityRole="button"
        accessibilityLabel={invitationsStrings.sendInvite.cta}
      >
        <View style={styles.sendInviteContent}>
          {/* Icon - matches iOS iconView (66x66) */}
          <View style={styles.iconContainer}>
            <Icon 
              name="mail-open-outline" 
              size={32} // Appropriate size for 66x66 container
              color={COLORS.circleIconPrimaryTint} // iOS: .CircleIcon.primaryTint
            />
          </View>
          
          {/* Right content stack - matches iOS rightContentStackView (vertical) */}
          <View style={styles.rightContentStack}>
            {/* Label stack - matches iOS labelStackView (vertical) */}
            <View style={styles.labelStack}>
              <Text style={styles.headerTitle}>{invitationsStrings.sendInvite.title}</Text>
              <Text style={styles.headerDescription}>{invitationsStrings.sendInvite.description}</Text>
            </View>
            
            {/* CTA Button - positioned below labels like iOS */}
            <TouchableOpacity style={styles.ctaButton} onPress={onSendInvite}>
              <Text style={styles.ctaButtonText}>{invitationsStrings.sendInvite.cta}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Render empty state - matches iOS emptyView
  const renderEmptyState = () => (
    <EmptyState
      title={invitationsStrings.empty.title}
      description={invitationsStrings.empty.description}
      iconName="mail-outline" // Matches iOS .Icon.emptyInbox
    />
  );

  return (
    <View style={styles.container}>
      {/* FlatList - matches iOS tableView */}
      <FlatList
        data={invitations}
        renderItem={renderInvitationItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          invitations.length === 0 && styles.emptyListContent
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        // iOS-like scroll behavior
        scrollEventThrottle={16}
        decelerationRate="normal"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // iOS: .Background.primary
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: PADDING.padding6,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingHorizontal: PADDING.padding4,
    paddingTop: PADDING.padding4,
    paddingBottom: PADDING.padding2,
  },
  sendInviteCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: PADDING.padding4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  sendInviteContent: {
    flexDirection: 'row', // iOS: mainStackView.axis = .horizontal
    alignItems: 'flex-start', // iOS: mainStackView.alignment = .top
  },
  iconContainer: {
    width: 66, // iOS: pinWidthTo(66)
    height: 66, // iOS: pinAspectRatioTo(1.0)
    borderRadius: 33,
    backgroundColor: COLORS.circleIconBackground, // iOS: .CircleIcon.background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: PADDING.padding5, // iOS: mainStackView.spacing = .Padding.padding5
  },
  rightContentStack: {
    flex: 1,
    flexDirection: 'column', // iOS: rightContentStackView.axis = .vertical
    alignItems: 'flex-start', // iOS: rightContentStackView.alignment = .leading
  },
  labelStack: {
    flexDirection: 'column', // iOS: labelStackView.axis = .vertical
    alignItems: 'flex-start',
    marginBottom: PADDING.padding4, // iOS: rightContentStackView.spacing = .Padding.padding4
  },
  headerTitle: {
    fontSize: 16, // iOS: .Connections.primary
    fontWeight: '600',
    color: COLORS.textPrimary, // iOS: .Text.primary
    marginBottom: 2,
  },
  headerDescription: {
    fontSize: 13, // iOS: .Connections.secondary
    fontWeight: '400',
    color: COLORS.textSubtitle, // iOS: .Text.subtitle
    lineHeight: 18,
    flexWrap: 'wrap', // iOS: numberOfLines = 0
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    width: 150, // iOS: widthAnchor.constraint(equalToConstant: 150)
    height: 40, // iOS: heightAnchor.constraint(equalToConstant: 40)
    borderRadius: 6, // iOS: .CornerRadius.radiusHalf
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 13, // iOS: .Connections.secondary
    fontWeight: '600',
    color: 'white',
  },
});
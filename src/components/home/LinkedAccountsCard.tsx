import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, PADDING, CARD_STYLES, ICON_SIZES } from '@/constants/homeConstants';
import { linkedAccountsStrings } from '@/constants/strings';
import { LinkedAccount } from '@/types/home';

interface LinkedAccountsCardProps {
  linkedAccounts: LinkedAccount[];
  onPress: () => void;
}

export const LinkedAccountsCard: React.FC<LinkedAccountsCardProps> = ({ 
  linkedAccounts, 
  onPress 
}) => {
  const visibleAccounts = linkedAccounts.length > 4 ? linkedAccounts.slice(0, 4) : linkedAccounts;
  const hasMoreThanFour = linkedAccounts.length > 4;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Linked Accounts - Invite people to make payments on your behalf"
    >
      {/* Avatar Stack - matches iOS avatarStack positioning exactly */}
      <View style={styles.avatarStack}>
        {visibleAccounts.map((linkedAccount, index) => {
          return (
            <View 
              key={linkedAccount.id} 
              style={[
                styles.avatar, 
                { marginLeft: index > 0 ? -10 : 0, zIndex: visibleAccounts.length - index }
              ]}
            >
              {linkedAccount.user.photoUrl ? (
                <Image 
                  source={{ uri: linkedAccount.user.photoUrl }} 
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Icon name="person" size={ICON_SIZES.small} color={COLORS.textPrimary} />
              )}
            </View>
          );
        })}
        {hasMoreThanFour && (
          <View style={[styles.avatar, styles.plusAvatar]}>
            <Icon name="add" size={16} color={COLORS.textPrimary} />
          </View>
        )}
      </View>

      {/* Chevron - positioned at top-right like iOS */}
      <Icon 
        name="chevron-forward" 
        size={ICON_SIZES.medium} 
        color={COLORS.separator}
        style={styles.chevron}
      />

      {/* Title - positioned below avatars like iOS */}
      <Text style={styles.title}>{linkedAccountsStrings.cardTitle}</Text>

      {/* Description - positioned below title like iOS */}
      <Text style={styles.description} numberOfLines={0}>
        {linkedAccountsStrings.cardDescription}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...CARD_STYLES, // iOS CardView styling
    marginTop: PADDING.padding2, // iOS top margin
    marginBottom: PADDING.padding2, // iOS bottom margin  
    padding: PADDING.padding4, // iOS internal padding
    position: 'relative', // For absolute positioning of chevron
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // iOS: leading alignment
    marginBottom: PADDING.padding2, // iOS: spacing to title
  },
  avatar: {
    width: 36, // iOS: 36.0 constraint
    height: 36, // iOS: 36.0 constraint
    borderRadius: 18,
    backgroundColor: COLORS.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBackground,
    overflow: 'hidden', // For image clipping
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  plusAvatar: {
    backgroundColor: COLORS.separator, // Different color for plus icon
  },
  chevron: {
    position: 'absolute',
    top: PADDING.padding5, // iOS: .Padding.padding5 from top
    right: PADDING.padding4, // iOS: .Padding.padding4 from right
  },
  title: {
    fontSize: 13, // iOS: .tertiary(withSize: 13.0)
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: PADDING.paddingHalf, // iOS: .Padding.paddingHalf spacing
  },
  description: {
    fontSize: 13, // iOS: .primary(withSize: 13.0)
    fontWeight: '400',
    color: COLORS.textSubtitle,
    paddingRight: PADDING.padding6, // iOS: avoid chevron overlap
  },
});
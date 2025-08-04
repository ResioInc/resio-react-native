import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { linkedAccountsStrings, invitationsStrings, connectionsStrings } from '@/constants/strings';
import { COLORS, PADDING } from '@/constants/homeConstants';
import { LinkedAccount } from '@/types/home';

interface ConnectionsTabViewProps {
  linkedAccounts: LinkedAccount[];
  onRemoveLinkedAccount: (account: LinkedAccount) => void;
  onSendInvite: () => void;
  renderAccountsTab: () => React.ReactNode;
  renderInvitationsTab: () => React.ReactNode;
}

export const ConnectionsTabView: React.FC<ConnectionsTabViewProps> = ({
  renderAccountsTab,
  renderInvitationsTab,
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const tabs = [
    linkedAccountsStrings.title,    // "Accounts"
    invitationsStrings.title        // "Invitations"
  ];

  const handleTabPress = useCallback((index: number) => {
    setSelectedTabIndex(index);
  }, []);

  const renderTabButton = (title: string, index: number) => {
    const isSelected = selectedTabIndex === index;
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.tabButton,
          isSelected && styles.selectedTabButton,
          index === 0 && styles.firstTabButton,
          index === tabs.length - 1 && styles.lastTabButton,
        ]}
        onPress={() => handleTabPress(index)}
        accessibilityRole="tab"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={title}
      >
        <Text style={[
          styles.tabButtonText,
          isSelected && styles.selectedTabButtonText,
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Segmented Control Container - matches iOS */}
      <View style={styles.segmentedControlContainer}>
        <View style={styles.segmentedControl}>
          {tabs.map((title, index) => renderTabButton(title, index))}
        </View>
      </View>

      {/* Content Container - matches iOS contentContainerView */}
      <View style={styles.contentContainer}>
        {selectedTabIndex === 0 && renderAccountsTab()}
        {selectedTabIndex === 1 && renderInvitationsTab()}
      </View>
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  segmentedControlContainer: {
    // iOS: stackView spacing and margins
    paddingTop: 18, // iOS: topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 18)
    paddingHorizontal: PADDING.padding4, // iOS: leadingAnchor/trailingAnchor constant: .Padding.padding4
    paddingBottom: 6, // iOS: spacing = .Padding.padding1AndAHalf (6px)
    alignItems: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA', // iOS: .Background.segmentControl
    borderRadius: 8, // iOS: layer.cornerRadius = 8
    padding: 4, // iOS: .Padding.padding1
    height: 54, // iOS: heightAnchor.constraint(equalToConstant: 54)
    width: screenWidth - (PADDING.padding4 * 2), // Full width minus horizontal padding
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6, // Slightly smaller than container
    marginHorizontal: 1,
  },
  selectedTabButton: {
    backgroundColor: COLORS.background, // iOS: .Background.primary (white)
    // iOS shadow effects
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  firstTabButton: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  lastTabButton: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSubtitle, // Unselected text color
  },
  selectedTabButtonText: {
    color: COLORS.textPrimary, // iOS: selected text color
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    // No padding here - let individual tabs handle their own spacing
  },
});
import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchLinkedAccounts, deleteLinkedAccount } from '@/store/slices/homeSlice';
import { ConnectionsTabView } from '@/components/connections/ConnectionsTabView';
import { InvitationsTab } from '@/components/invitations/InvitationsTab';
import { LinkedAccountListItem } from '@/components/linkedAccounts/LinkedAccountListItem';
import { EmptyState } from '@/components/common/EmptyState';
import { COLORS, PADDING } from '@/constants/homeConstants';
import { linkedAccountsStrings, connectionsStrings } from '@/constants/strings';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { LinkedAccount } from '@/types/home';

type LinkedAccountsNavigationProp = StackNavigationProp<RootStackParamList>;

export const LinkedAccountsScreen: React.FC = () => {
  const navigation = useNavigation<LinkedAccountsNavigationProp>();
  const dispatch = useAppDispatch();
  const { linkedAccounts, isLoading, error } = useAppSelector((state) => state.home);

  // Set navigation title to match iOS "Connections"
  useEffect(() => {
    navigation.setOptions({
      title: connectionsStrings.title,
    });
  }, [navigation]);

  // Load linked accounts when screen mounts
  useEffect(() => {
    dispatch(fetchLinkedAccounts());
  }, [dispatch]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    dispatch(fetchLinkedAccounts());
  }, [dispatch]);

  // Handle remove account - matches iOS delegate pattern
  const handleRemoveAccount = useCallback(async (linkedAccount: LinkedAccount) => {
    try {
      await dispatch(deleteLinkedAccount(linkedAccount.id)).unwrap();
      // Success - account already removed from Redux state
    } catch (error) {
      // Show error alert if deletion fails
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to remove linked account',
        [{ text: 'OK', style: 'default' }],
        { cancelable: true }
      );
    }
  }, [dispatch]);

  // Handle send invite - navigate to NewInvitationScreen
  const handleSendInvite = useCallback(() => {
    navigation.navigate('NewInvitation');
  }, [navigation]);

  // Render Accounts tab content
  const renderAccountsTab = useCallback(() => {
    const renderLinkedAccountItem = ({ item }: { item: LinkedAccount }) => (
      <LinkedAccountListItem 
        linkedAccount={item} 
        onRemove={handleRemoveAccount}
      />
    );

    const renderEmptyState = () => (
      <EmptyState
        title={linkedAccountsStrings.empty.title}
        description={linkedAccountsStrings.empty.description}
        iconName="people-outline" // Matches iOS .Icon.connections
      />
    );

    return (
      <FlatList
        data={linkedAccounts}
        renderItem={renderLinkedAccountItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          linkedAccounts.length === 0 && styles.emptyListContent
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        // iOS-like scroll behavior
        scrollEventThrottle={16}
        decelerationRate="normal"
      />
    );
  }, [linkedAccounts, isLoading, handleRefresh, handleRemoveAccount]);

  // Render Invitations tab content
  const renderInvitationsTab = useCallback(() => (
    <InvitationsTab onSendInvite={handleSendInvite} />
  ), [handleSendInvite]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ConnectionsTabView
        linkedAccounts={linkedAccounts}
        onRemoveLinkedAccount={handleRemoveAccount}
        onSendInvite={handleSendInvite}
        renderAccountsTab={renderAccountsTab}
        renderInvitationsTab={renderInvitationsTab}
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
    paddingTop: PADDING.padding4,
    paddingBottom: PADDING.padding6,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
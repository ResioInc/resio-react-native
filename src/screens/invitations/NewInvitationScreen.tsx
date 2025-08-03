import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '@/store';
import { sendInvitation } from '@/store/slices/invitationsSlice';
import { ExpandableInfoItem } from '@/components/common/ExpandableInfoItem';
import { COLORS, PADDING } from '@/constants/homeConstants';
import { newInvitationStrings, formatString } from '@/constants/strings';
import { RootStackParamList } from '@/navigation/RootNavigator';

type NewInvitationNavigationProp = StackNavigationProp<RootStackParamList>;

export const NewInvitationScreen: React.FC = () => {
  const navigation = useNavigation<NewInvitationNavigationProp>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.invitations);
  
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(null);
  const emailInputRef = useRef<TextInput>(null);

  // Initialize message with user's full name - matches iOS format
  React.useEffect(() => {
    const userFullName = user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user?.email || '';
    
    const formattedMessage = formatString(newInvitationStrings.messageFormatted, userFullName);
    setMessage(formattedMessage);
  }, [user]);

  // Handle send invitation
  const handleSendInvitation = useCallback(async () => {
    // Basic validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      emailInputRef.current?.focus();
      return;
    }
    
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      emailInputRef.current?.focus();
      return;
    }
    
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    try {
      await dispatch(sendInvitation({ email: email.trim(), message: message.trim() })).unwrap();
      
      // Success - navigate back (matches iOS popAnimated)
      navigation.goBack();
      
      // Optional: Show success message
      setTimeout(() => {
        Alert.alert('Success', 'Invitation sent successfully!');
      }, 500);
      
    } catch (error) {
      // Show error alert with server message (matches iOS behavior)
      const errorMessage = error instanceof Error ? error.message : 'Failed to send invitation';
      
      Alert.alert(
        'Error', // iOS: "alert.error".localized
        errorMessage, // Show server's message like iOS does
        [{ text: 'OK', style: 'default' }], // iOS: "alert.accept".localized
        { cancelable: true }
      );
    }
  }, [email, message, dispatch, navigation]);

  // How it works data - matches iOS exactly
  const howItWorksData = [
    {
      title: newInvitationStrings.howItWorks.item1.title,
      detail: newInvitationStrings.howItWorks.item1.detail,
    },
    {
      title: newInvitationStrings.howItWorks.item2.title,
      detail: newInvitationStrings.howItWorks.item2.detail,
    },
  ];

  // Handle expandable item press - iOS behavior: only one open at a time
  const handleExpandablePress = useCallback((index: number) => {
    setExpandedItemIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Stack - matches iOS mainStackView */}
        <View style={styles.mainStack}>
          
          {/* Header Label - matches iOS headerLabel */}
          <Text style={styles.headerText}>
            {newInvitationStrings.header}
          </Text>
          
          {/* Email Text Field - matches iOS emailTextField */}
          <View style={styles.inputContainer}>
            <TextInput
              ref={emailInputRef}
              style={styles.emailInput}
              value={email}
              onChangeText={setEmail}
              placeholder={newInvitationStrings.emailPlaceholder}
              placeholderTextColor={COLORS.textSubtitle}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => {
                // Focus message field or send if message is ready
                if (message.trim()) {
                  handleSendInvitation();
                }
              }}
            />
          </View>
          
          {/* Message Text View - matches iOS messageTextView */}
          <View style={styles.messageContainer}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              placeholder="Enter your message..."
              placeholderTextColor={COLORS.textSubtitle}
            />
          </View>
          
          {/* How it Works Section - matches iOS tableView */}
          <View style={styles.howItWorksContainer}>
            {howItWorksData.map((item, index) => (
              <ExpandableInfoItem
                key={index}
                title={item.title}
                detail={item.detail}
                isExpanded={expandedItemIndex === index}
                onPress={() => handleExpandablePress(index)}
              />
            ))}
          </View>
          
          {/* Send Button - matches iOS saveButton */}
          <TouchableOpacity 
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSendInvitation}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={newInvitationStrings.buttonTitle}
          >
            <Text style={styles.sendButtonText}>
              {isLoading ? 'Sending...' : newInvitationStrings.buttonTitle}
            </Text>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // iOS: .Background.primary
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainStack: {
    // iOS: mainStackView with vertical axis, center alignment, 20px spacing
    paddingTop: PADDING.padding5, // iOS: .Padding.padding5
    paddingBottom: PADDING.padding5,
    paddingHorizontal: PADDING.padding4,
    gap: 20, // iOS: spacing = 20
  },
  headerText: {
    fontSize: 14, // iOS: .primaryTextField(withSize: 14)
    fontWeight: '400',
    color: COLORS.textPrimary, // iOS: .Text.primary
    lineHeight: 20,
    textAlign: 'left',
  },
  inputContainer: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.background, // iOS: no special background, uses main background
    paddingVertical: PADDING.padding2,
  },
  emailInput: {
    fontSize: 13, // iOS: .primaryTextField(withSize: 13)
    color: COLORS.textPrimary, // iOS: .Text.primary
    paddingVertical: PADDING.padding2,
    paddingHorizontal: 0,
    backgroundColor: 'transparent', // iOS: no background
    borderWidth: 0, // iOS: no border visible
  },
  messageContainer: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.backgroundSecondary, // iOS: .Background.secondary
    borderRadius: 4, // iOS: .CornerRadius.radius1
    borderWidth: 1, // iOS: .BorderWidth.borderSmallest
    borderColor: COLORS.separator, // iOS: UIColor.separator.cgColor
    minHeight: 200, // iOS: heightAnchor.constraint(equalToConstant: 200)
  },
  messageInput: {
    fontSize: 13, // iOS: .primaryTextField(withSize: 13)
    color: COLORS.textPrimary, // iOS: .Text.primary
    padding: PADDING.padding2, // iOS: textContainerInset padding2
    minHeight: 200,
    textAlignVertical: 'top',
  },
  howItWorksContainer: {
    alignSelf: 'stretch',
  },
  sendButton: {
    backgroundColor: COLORS.primary, // iOS: .Button.primary
    height: 40, // iOS: .Padding.padding10 (40px)
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 13, // iOS: .Connections.secondary
    fontWeight: '600',
    color: 'white', // iOS: .Button.textPrimary
  },
});
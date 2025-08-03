import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { COLORS, PADDING, TYPOGRAPHY } from '@/constants/homeConstants';

interface InfoRowProps {
  title: string;
  value: string;
  isCopyEnabled?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  title,
  value,
  isCopyEnabled = true,
}) => {
  const handleLongPress = () => {
    if (!isCopyEnabled || !value) return;
    
    Clipboard.setString(value);
    Alert.alert('Copied', `${title} copied to clipboard`);
  };

  const Component = isCopyEnabled ? TouchableOpacity : View;

  return (
    <Component
      style={styles.container}
      onLongPress={isCopyEnabled ? handleLongPress : undefined}
      delayLongPress={500}
      accessibilityRole={isCopyEnabled ? "button" : undefined}
      accessibilityLabel={isCopyEnabled ? `${title}: ${value}. Long press to copy` : `${title}: ${value}`}
      accessibilityHint={isCopyEnabled ? "Long press to copy to clipboard" : undefined}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING.padding3, // iOS: .Padding.padding3
    paddingVertical: PADDING.padding2,
    minHeight: 60, // Ensure consistent height
  },
  title: {
    fontSize: 13, // iOS: .avenir400(withSize: 13)
    fontWeight: '400',
    color: COLORS.textSubtitle, // iOS: .Text.subtitle
    marginBottom: 2,
  },
  value: {
    fontSize: 15, // iOS: .avenir400(withSize: 15)
    fontWeight: '400',
    color: COLORS.textPrimary, // iOS: .Text.primary
    lineHeight: 20,
  },
});